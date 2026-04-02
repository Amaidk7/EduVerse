import React, { useEffect, useState, useCallback } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { setSelectedCourse } from '../redux/courseSlice'
import { FaStar } from "react-icons/fa6"
import { FaPlayCircle } from "react-icons/fa"
import { FaLock } from "react-icons/fa"
import axios from 'axios'
import { serverUrl } from '../App'
import Card from '../component/Card'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
import img from "../assets/empty.jpg"

function ViewCourse() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const dispatch = useDispatch()

  const { courseData } = useSelector(state => state.course)
  const { selectedCourse } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)

  const [selectedLecture, setSelectedLecture] = useState(null)
  const [creatorData, setCreatorData] = useState(null)
  const [creatorCourses, setCreatorCourses] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Fix 1: use .find() instead of .map() to avoid repeated dispatches
  const fetchCourseData = useCallback(() => {
    const found = courseData?.find(course => course._id === courseId)
    if (found) dispatch(setSelectedCourse(found))
  }, [courseData, courseId, dispatch])

  // ✅ Fix 2: checkEnrollment inside useEffect, no stale closure issues
  useEffect(() => {
    fetchCourseData()

    const verify = userData?.enrolledCourses?.some(c =>
      (typeof c === 'string' ? c : c._id).toString() === courseId?.toString()
    )
    setIsEnrolled(!!verify)
  }, [courseData, courseId, userData, fetchCourseData])

  // Fetch creator info when selectedCourse changes
  useEffect(() => {
    const handleCreator = async () => {
      if (!selectedCourse?.creator) return
      try {
        const result = await axios.post(
          serverUrl + "/api/course/creator",
          { userId: selectedCourse.creator },
          { withCredentials: true }
        )
        setCreatorData(result.data)
      } catch (error) {
        console.log("Creator fetch error:", error)
      }
    }
    handleCreator()
  }, [selectedCourse])

  // Filter other courses by same creator
  useEffect(() => {
    if (creatorData?._id && courseData?.length > 0) {
      const filtered = courseData.filter(
        course => course.creator === creatorData._id && course._id !== courseId
      )
      setCreatorCourses(filtered)
    }
  }, [creatorData, courseData, courseId])

  // ✅ Fix 3: null check before using userData._id
  const handleEnroll = async () => {
    if (!userData?._id) {
      toast.error("Please login to enroll.")
      return
    }
    try {
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId: userData._id, courseId },
        { withCredentials: true }
      )

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: 'INR',
        name: "VIRTUAL COURSES",
        description: "COURSE ENROLLMENT PAYMENT",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyPayment = await axios.post(
              serverUrl + "/api/order/verifypayment",
              { ...response, courseId, userId: userData._id },
              { withCredentials: true }
            )
            setIsEnrolled(true)
            toast.success(verifyPayment.data.message)
          } catch (error) {
            toast.error(error?.response?.data?.message || "Payment verification failed.")
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong while enrolling.")
    }
  }

  const handleReview = async () => {
    if (!rating) {
      toast.error("Please select a rating.")
      return
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.")
      return
    }
    setLoading(true)
    try {
      await axios.post(
        serverUrl + "/api/review/createreview",
        { rating, comment, courseId },
        { withCredentials: true }
      )
      toast.success("Review added successfully!")
      setRating(0)
      setComment("")
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Failed to submit review.")
      setRating(0)
      setComment("")
    } finally {
      setLoading(false)
    }
  }

  const calculateAvgReview = (reviews) => {
    if (!reviews || reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const avgRating = calculateAvgReview(selectedCourse?.reviews)
  const reviewCount = selectedCourse?.reviews?.length || 0

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='max-w-6xl mx-auto bg-white shadow-md rounded-xl p-4 md:p-6 space-y-6'>

        {/* ── Top Section ── */}
        <div className='flex flex-col md:flex-row gap-6'>

          {/* Thumbnail */}
          <div className='w-full md:w-1/2'>
            {/* ✅ Fix 4: mb-3 added so arrow doesn't stick to image */}
            <FaArrowLeftLong
              className='text-black w-5 h-5 cursor-pointer mb-3'
              onClick={() => navigate("/")}
            />
            <img
              src={selectedCourse?.thumbnail || img}
              alt={selectedCourse?.title || "Course thumbnail"}
              className='rounded-xl w-full object-cover'
            />
          </div>

          {/* Course Info */}
          {/* ✅ Fix 5: mt only on md screens */}
          <div className='flex-1 space-y-3 md:mt-5'>
            <h2 className='text-2xl font-bold'>{selectedCourse?.title}</h2>
            <p className='text-gray-600'>{selectedCourse?.subTitle}</p>

            {/* Rating */}
            <div className='flex items-center gap-2 text-yellow-500 font-medium'>
              <span className='flex items-center gap-1'>
                <FaStar />
                {avgRating}
              </span>
              {/* ✅ Fix 6: dynamic review count */}
              <span className='text-gray-400 text-sm'>({reviewCount} Reviews)</span>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-2'>
              <span className='text-xl font-semibold text-black'>
                ₹{selectedCourse?.price}
              </span>
              {/* ✅ Fix 7: only show original price if it exists in data */}
              {selectedCourse?.originalPrice && (
                <span className='line-through text-sm text-gray-400'>
                  ₹{selectedCourse.originalPrice}
                </span>
              )}
            </div>

            {/* Highlights */}
            <ul className='text-sm text-gray-700 space-y-1'>
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
            </ul>

            {/* CTA Button */}
            {!isEnrolled ? (
              <button
                className='bg-black text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors cursor-pointer'
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
            ) : (
              <button
                className='bg-green-100 text-green-600 px-6 py-2 rounded hover:bg-green-200 transition-colors cursor-pointer'
                onClick={() => navigate(`/viewlecture/${courseId}`)}
              >
                Watch Now
              </button>
            )}
          </div>
        </div>

        {/* ── What You'll Learn ── */}
        <div>
          <h2 className='text-xl font-semibold mb-2'>What You'll Learn</h2>
          <ul className='list-disc pl-6 text-gray-700 space-y-1'>
            <li>Learn {selectedCourse?.category} from the beginning</li>
          </ul>
        </div>

        {/* ── Who This Course Is For ── */}
        <div>
          <h2 className='text-xl font-semibold mb-2'>Who This Course Is For</h2>
          <p className='text-gray-700'>
            Beginners, aspiring developers, and professionals looking to upgrade their skills.
          </p>
        </div>

        {/* ── Curriculum + Video Preview ── */}
        <div className='flex flex-col md:flex-row gap-6'>

          {/* Curriculum List */}
          <div className='bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
            <h2 className='text-xl font-bold mb-1 text-gray-800'>Course Curriculum</h2>
            <p className='text-sm text-gray-500 mb-4'>
              {selectedCourse?.lectures?.length || 0} Lectures
            </p>

            {/* ✅ Fix 8: max-h + scroll so long lists don't push video too far down */}
            <div className='flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1'>
              {selectedCourse?.lectures?.map((lecture) => (
                <button
                  key={lecture._id}
                  disabled={!lecture.isPreviewFree}
                  onClick={() => {
                    if (lecture.isPreviewFree) setSelectedLecture(lecture)
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left
                    ${lecture.isPreviewFree
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                    }
                    ${selectedLecture?._id === lecture._id ? "bg-gray-100 border-gray-400" : ""}
                  `}
                >
                  <span className='text-lg text-gray-700'>
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span className='text-sm font-medium text-gray-800'>
                    {lecture?.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div className='bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200'>
            <div className='aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center'>
              {selectedLecture?.videoUrl ? (
                <video
                  className='w-full h-full object-cover'
                  src={selectedLecture.videoUrl}
                  controls
                />
              ) : (
                <span className='text-white text-sm text-center px-4'>
                  Select a free preview lecture to watch
                </span>
              )}
            </div>
            {selectedLecture && (
              <p className='text-sm text-gray-600 mt-3 font-medium'>
                {selectedLecture.lectureTitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Write a Review ── */}
        <div className='border-t pt-6'>
          {/* ✅ Fix 9: "Write a Reviews" → "Write a Review" */}
          <h2 className='text-xl font-semibold mb-4'>Write a Review</h2>

          <div className='flex gap-1 mb-3'>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-xl transition-colors ${
                  star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-300 text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-300'
            placeholder='Write your review here...'
            rows={3}
          />

          <button
            className='bg-black text-white mt-3 px-5 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]'
            disabled={loading}
            onClick={handleReview}
          >
            {loading ? <ClipLoader size={20} color='white' /> : "Submit Review"}
          </button>
        </div>

        {/* ── Creator Info ── */}
        <div className='flex items-center gap-4 pt-4 border-t'>
          <img
            src={creatorData?.photoUrl || img}
            alt={creatorData?.name || "Creator"}
            className='w-16 h-16 rounded-full object-cover border border-gray-200 flex-shrink-0'
          />
          <div className='min-w-0'>
            <h2 className='text-lg font-semibold'>{creatorData?.name}</h2>
            <p className='text-sm text-gray-600 mt-0.5'>{creatorData?.description}</p>
            {/* ✅ Fix 10: break-all prevents long email from overflowing */}
            <p className='text-sm text-gray-500 break-all'>{creatorData?.email}</p>
          </div>
        </div>

        {/* ── Other Courses by Creator ── */}
        {creatorCourses?.length > 0 && (
          <div>
            <p className='text-xl font-semibold mb-4'>
              Other Published Courses by the Educator
            </p>
            <div className='flex flex-wrap gap-6 justify-center lg:justify-start lg:px-0'>
              {creatorCourses.map((course) => (
                <Card
                  key={course._id}
                  thumbnail={course.thumbnail}
                  id={course._id}
                  price={course.price}
                  title={course.title}
                  category={course.category}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ViewCourse
