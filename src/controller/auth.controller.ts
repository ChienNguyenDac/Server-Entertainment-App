import { Request, Response } from "express"
import { omit } from "lodash"
import { HttpStatusCode, JSONResponse } from "../helper/client"
import UserModel from "../model/user.model"

export async function userRegisterHandler(req:Request, res: Response) {
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        return JSONResponse.sendError(
            res,
            HttpStatusCode.BAD_REQUEST,
            'confirmPassword not match password.'
        )
    }

    try {
        const user = await UserModel.create(req.body)

        return JSONResponse.sendSuccess(
            res,
            omit(user.toJSON(), "password"),
            'user register successfully.'
        )
    } catch (error) {
        console.log(error)
        JSONResponse.sendErrorServerInterval(res)
    }
}

export async function userLoginHandler(req: Request, res: Response) {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        let validatePassword = true

        if (!user) {
            validatePassword = false
        } else {
            const isValid = await user.comparePassword(password)
            if (!isValid) {
                validatePassword = false
            }
        }

        if (!validatePassword) {
            return JSONResponse.sendError(
                res,
                HttpStatusCode.BAD_REQUEST,
                'email or password is wrong.'
            )
        }

        return JSONResponse.sendSuccess(
            res,
            omit(user?.toJSON(), "password"),
            'user login successfully.'
        )
    } catch (error) {
        console.log(error)
        return JSONResponse.sendErrorServerInterval(res)
    }
}