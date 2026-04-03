import Progress from "../model/progressModel.js"
import Course from "../model/courseModel.js"
import Wishlist from "../model/wishlistModel.js"
import User from "../model/userModel.js"
import PDFDocument from "pdfkit"

// ─── PROGRESS ────────────────────────────────────────────────────────────

export const markLectureComplete = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body
        const userId = req.userId

        const course = await Course.findById(courseId).populate("lectures")
        if (!course) return res.status(404).json({ message: "Course not found" })

        let progress = await Progress.findOne({ user: userId, course: courseId })

        if (!progress) {
            progress = await Progress.create({
                user: userId,
                course: courseId,
                completedLectures: [lectureId]
            })
        } else {
            if (!progress.completedLectures.includes(lectureId)) {
                progress.completedLectures.push(lectureId)
            }
        }

        const totalLectures = course.lectures.length
        if (progress.completedLectures.length >= totalLectures && totalLectures > 0) {
            progress.isCompleted = true
            progress.completedAt = new Date()
        }

        await progress.save()
        return res.status(200).json(progress)
    } catch (error) {
        return res.status(500).json({ message: `Progress error: ${error}` })
    }
}

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        const progress = await Progress.findOne({ user: userId, course: courseId })
        const course = await Course.findById(courseId).populate("lectures")

        if (!course) return res.status(404).json({ message: "Course not found" })

        const totalLectures = course.lectures.length
        const completedCount = progress?.completedLectures?.length || 0
        const percentage = totalLectures > 0
            ? Math.round((completedCount / totalLectures) * 100)
            : 0

        return res.status(200).json({
            completedLectures: progress?.completedLectures || [],
            isCompleted:       progress?.isCompleted  || false,
            completedAt:       progress?.completedAt  || null,
            percentage,
            totalLectures,
            completedCount
        })
    } catch (error) {
        return res.status(500).json({ message: `Get progress error: ${error}` })
    }
}

// ─── CERTIFICATE HELPERS ──────────────────────────────────────────────────

/**
 * drawCursiveSignature
 * Student ka naam cursive style mein draw karta hai
 * PDFKit ke built-in Helvetica-BoldOblique + rotation + bezier flourish se
 * real handwriting jaisa effect aata hai
 *
 * @param {PDFDocument} doc
 * @param {string}      name       - student ka naam
 * @param {number}      centerX    - signature ka center X position
 * @param {number}      baseY      - signature ki top Y position
 * @param {number}      maxWidth   - maximum width allowed
 */
const drawCursiveSignature = (doc, name, centerX, baseY, maxWidth = 200) => {
    // naam ki length ke hisaab se font size adjust karo
    const fontSize = Math.min(26, Math.max(14, Math.floor(maxWidth / (name.length * 0.72))))
    const halfW    = maxWidth / 2

    doc.save()

    // ── Layer 1: purple glow shadow (depth ke liye) ──────────────────
    doc.translate(centerX, baseY + fontSize)
    doc.rotate(-4)  // signature slant

    doc.fontSize(fontSize + 1)
        .font("Helvetica-BoldOblique")
        .fillColor("#8b7dc0")
        .opacity(0.2)
        .text(name, -(halfW + 1), 2, { width: maxWidth, align: "center", lineBreak: false })

    // ── Layer 2: main ink ─────────────────────────────────────────────
    doc.fontSize(fontSize)
        .font("Helvetica-BoldOblique")
        .fillColor("#1e1060")
        .opacity(1)
        .text(name, -halfW, 0, { width: maxWidth, align: "center", lineBreak: false })

    doc.restore()

    // ── Flourish underline: wavy bezier curve ─────────────────────────
    const y0     = baseY + fontSize + 12
    const x0     = centerX - halfW * 0.75
    const x1     = centerX + halfW * 0.75
    const xMid   = (x0 + x1) / 2

    doc.save()
        .moveTo(x0, y0)
        .bezierCurveTo(x0  + 30, y0 - 5,  xMid - 20, y0 + 5,  xMid, y0)
        .bezierCurveTo(xMid + 20, y0 - 4,  x1 - 30,  y0 + 3,  x1,   y0 - 1)
        .lineWidth(1.2)
        .strokeColor("#6c63ff")
        .opacity(0.65)
        .stroke()
    doc.restore()
}

/**
 * drawAuthorizedSignature
 * "Amaid Khan" ka permanent authorized signature
 * Har certificate mein yahi aayega — platform owner ka fixed sign
 * More dramatic slant + longer flourish = authoritative look
 *
 * @param {PDFDocument} doc
 * @param {number}      centerX
 * @param {number}      baseY
 */
const drawAuthorizedSignature = (doc, centerX, baseY) => {
    const name     = "Amaid Khan"   // ← PERMANENT — kabhi change mat karo
    const fontSize = 24
    const maxWidth = 200
    const halfW    = maxWidth / 2

    doc.save()

    doc.translate(centerX, baseY + fontSize)
    doc.rotate(-6)   // steeper slant = more authoritative

    // ── Glow layer ───────────────────────────────────────────────────
    doc.fontSize(fontSize + 2)
        .font("Helvetica-BoldOblique")
        .fillColor("#6c63ff")
        .opacity(0.12)
        .text(name, -(halfW + 1), 2, { width: maxWidth, align: "center", lineBreak: false })

    // ── Shadow layer ─────────────────────────────────────────────────
    doc.fontSize(fontSize)
        .font("Helvetica-BoldOblique")
        .fillColor("#9b8fc0")
        .opacity(0.3)
        .text(name, -(halfW - 1), 1, { width: maxWidth, align: "center", lineBreak: false })

    // ── Main ink ─────────────────────────────────────────────────────
    doc.fontSize(fontSize)
        .font("Helvetica-BoldOblique")
        .fillColor("#150d50")
        .opacity(1)
        .text(name, -halfW, 0, { width: maxWidth, align: "center", lineBreak: false })

    doc.restore()

    // ── Long sweeping underline flourish ──────────────────────────────
    const y0  = baseY + fontSize + 12
    const x0  = centerX - halfW * 0.85
    const x1  = centerX + halfW * 0.85

    doc.save()

    // Main sweep
    doc.moveTo(x0, y0)
        .bezierCurveTo(
            x0  + 50, y0 - 8,
            x1  - 50, y0 + 6,
            x1,       y0
        )
        .lineWidth(1.6)
        .strokeColor("#6c63ff")
        .opacity(0.85)
        .stroke()

    // Return loop flourish at the end (like a real pen signature)
    doc.moveTo(x1, y0)
        .bezierCurveTo(
            x1 + 10, y0 - 4,
            x1 + 14, y0 + 5,
            x1 + 7,  y0 + 7
        )
        .lineWidth(1)
        .strokeColor("#6c63ff")
        .opacity(0.55)
        .stroke()

    doc.restore()

    // ── Seal dot beneath signature ────────────────────────────────────
    doc.circle(centerX, y0 + 16, 3.5)
        .fillColor("#6c63ff")
        .opacity(0.55)
        .fill()
}

// ─── GENERATE CERTIFICATE ─────────────────────────────────────────────────

export const generateCertificate = async (req, res) => {
    try {
        const { courseId } = req.params
        const userId = req.userId

        // ── 1. Check course is completed ──────────────────────────────
        const progress = await Progress.findOne({ user: userId, course: courseId })
        if (!progress?.isCompleted) {
            return res.status(400).json({
                message: "Complete the course first to get certificate"
            })
        }

        // ── 2. Fetch user + course data ───────────────────────────────
        const user   = await User.findById(userId).select("-password")
        const course = await Course.findById(courseId).populate("creator", "name")

        if (!user || !course) {
            return res.status(404).json({ message: "Not found" })
        }

        const completedDate = progress.completedAt
            ? new Date(progress.completedAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })
            : new Date().toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric"
              })

        // ── 3. Create PDF document ────────────────────────────────────
        const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 })

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=EduVerse-Certificate-${user.name.replace(/\s+/g, "-")}.pdf`
        )
        doc.pipe(res)

        const W = 841.89
        const H = 595.28

        // ── 4. Background ─────────────────────────────────────────────
        doc.rect(0, 0, W, H).fill("#f8f7f4")

        // ── 5. Top + bottom accent bars ───────────────────────────────
        doc.rect(0, 0, W, 8).fill("#6c63ff")
        doc.rect(0, H - 8, W, 8).fill("#6c63ff")

        // ── 6. Borders ────────────────────────────────────────────────
        doc.rect(20, 20, W - 40, H - 40).lineWidth(2).stroke("#6c63ff")
        doc.rect(28, 28, W - 56, H - 56).lineWidth(0.5).stroke("#6c63ff")

        // ── 7. Corner dots ────────────────────────────────────────────
        [[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]].forEach(([x, y]) => {
            doc.circle(x, y, 6).fill("#6c63ff")
        })

        // ── 8. Subtle diagonal watermark ─────────────────────────────
        doc.save()
        doc.translate(W / 2, H / 2)
        doc.rotate(-35)
        doc.fontSize(80)
            .font("Helvetica-Bold")
            .fillColor("#6c63ff")
            .opacity(0.035)
            .text("EduVerse", -180, -40)
        doc.restore()

        // ── 9. EduVerse brand name ────────────────────────────────────
        doc.fontSize(13)
            .font("Helvetica-Bold")
            .fillColor("#6c63ff")
            .opacity(1)
            .text("EduVerse", 0, 55, { align: "center" })

        // ── 10. Title ─────────────────────────────────────────────────
        doc.fontSize(36)
            .font("Helvetica-Bold")
            .fillColor("#0f0e0d")
            .text("Certificate of Completion", 0, 80, { align: "center" })

        // ── 11. Top divider ───────────────────────────────────────────
        doc.moveTo(200, 133)
            .lineTo(W - 200, 133)
            .lineWidth(1).strokeColor("#6c63ff").opacity(0.6).stroke()

        // ── 12. "This is to certify that" ─────────────────────────────
        doc.fontSize(13)
            .font("Helvetica")
            .fillColor("#5a5855")
            .opacity(1)
            .text("This is to certify that", 0, 148, { align: "center" })

        // ── 13. Student name — big and bold ───────────────────────────
        doc.fontSize(40)
            .font("Helvetica-BoldOblique")
            .fillColor("#0f0e0d")
            .text(user.name, 0, 170, { align: "center" })

        // Name underline
        const nw    = Math.min(doc.widthOfString(user.name, { fontSize: 40 }) + 40, 400)
        const nlX   = (W - nw) / 2
        doc.moveTo(nlX, 224)
            .lineTo(nlX + nw, 224)
            .lineWidth(0.7).strokeColor("#cccccc").opacity(1).stroke()

        // ── 14. "has successfully completed" ─────────────────────────
        doc.fontSize(13)
            .font("Helvetica")
            .fillColor("#5a5855")
            .text("has successfully completed the course", 0, 238, { align: "center" })

        // ── 15. Course title ──────────────────────────────────────────
        doc.fontSize(26)
            .font("Helvetica-Bold")
            .fillColor("#6c63ff")
            .text(course.title, 60, 263, { align: "center", width: W - 120 })

        // ── 16. Category · Level ──────────────────────────────────────
        const meta = [course.category, course.level].filter(Boolean).join("  ·  ")
        if (meta) {
            doc.fontSize(11)
                .font("Helvetica")
                .fillColor("#9a9793")
                .text(meta, 0, 308, { align: "center" })
        }

        // ── 17. Middle divider ────────────────────────────────────────
        doc.moveTo(200, 335)
            .lineTo(W - 200, 335)
            .lineWidth(0.5).strokeColor("#dddddd").opacity(1).stroke()

        // ── 18. Date + Instructor ─────────────────────────────────────
        doc.fontSize(11)
            .font("Helvetica")
            .fillColor("#5a5855")
            .opacity(1)
        doc.text(`Completed on: ${completedDate}`, 120, 350)
        doc.text(
            `Instructor: ${course.creator?.name || "EduVerse Educator"}`,
            W - 340, 350
        )

        // ── 19. Signature baseline ─────────────────────────────────────
        const leftCX   = 220          // left signature center X
        const rightCX  = W - 220      // right signature center X
        const sigLineY = 445          // horizontal line Y

        // Draw the two signature lines
        doc.moveTo(leftCX  - 100, sigLineY).lineTo(leftCX  + 100, sigLineY)
            .lineWidth(1).strokeColor("#0f0e0d").opacity(0.65).stroke()
        doc.moveTo(rightCX - 100, sigLineY).lineTo(rightCX + 100, sigLineY)
            .lineWidth(1).strokeColor("#0f0e0d").opacity(0.65).stroke()

        // ── 20. STUDENT SIGNATURE — user.name in cursive ─────────────
        //        drawn above the left signature line
        drawCursiveSignature(doc, leftCX, sigLineY - 46, 200)

        // ── 21. AUTHORIZED SIGNATURE — Amaid Khan permanent ──────────
        //        drawn above the right signature line
        drawAuthorizedSignature(doc, rightCX, sigLineY - 46)

        // ── 22. Signature labels ──────────────────────────────────────
        doc.fontSize(10)
            .font("Helvetica")
            .fillColor("#9a9793")
            .opacity(1)
        doc.text("Student Signature",    leftCX  - 100, sigLineY + 8, { width: 200, align: "center" })
        doc.text("Authorized Signature", rightCX - 100, sigLineY + 8, { width: 200, align: "center" })

        // ── 23. Certificate ID at bottom ──────────────────────────────
        const certId = `EV-${courseId.toString().slice(-6).toUpperCase()}-${userId.toString().slice(-6).toUpperCase()}`
        doc.fontSize(9)
            .fillColor("#c0bdb9")
            .opacity(0.8)
            .text(`Certificate ID: ${certId}`, 0, H - 26, { align: "center" })

        doc.end()

    } catch (error) {
        return res.status(500).json({ message: `Certificate error: ${error}` })
    }
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────

export const toggleWishlist = async (req, res) => {
    try {
        const { courseId } = req.body
        const userId = req.userId

        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, courses: [courseId] })
            return res.status(200).json({ wishlist, added: true })
        }

        const isAdded = wishlist.courses.includes(courseId)
        if (isAdded) {
            wishlist.courses = wishlist.courses.filter(id => id.toString() !== courseId)
        } else {
            wishlist.courses.push(courseId)
        }

        await wishlist.save()
        return res.status(200).json({ wishlist, added: !isAdded })
    } catch (error) {
        return res.status(500).json({ message: `Wishlist error: ${error}` })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const userId = req.userId
        const wishlist = await Wishlist.findOne({ user: userId }).populate({
            path: "courses",
            populate: { path: "reviews" }
        })

        return res.status(200).json(wishlist?.courses || [])
    } catch (error) {
        return res.status(500).json({ message: `Get wishlist error: ${error}` })
    }
}
