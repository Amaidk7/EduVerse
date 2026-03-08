import express from "express"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from "../controller/courseController.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"


const courseRouter = express.Router()
//for Courses
courseRouter.post("/create" ,isAuth, createCourse )
courseRouter.get("/getpublished" , getPublishedCourses)
courseRouter.get("/getcreator", isAuth , getCreatorCourses)
courseRouter.post("/editcourse/:courseId" , isAuth ,upload.single("thumbnail") , editCourse )
courseRouter.get("/getcourse/:courseId" ,isAuth ,getCourseById )
courseRouter.delete("/remove/:courseId" , isAuth , removeCourse)
 

//for Lectures


 

// for Search 

export default courseRouter