import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile } from "../controller/userController.js"


const userRouter = express.Router()

userRouter.get("/getcurrentuser",isAuth,getCurrentUser)



export default userRouter