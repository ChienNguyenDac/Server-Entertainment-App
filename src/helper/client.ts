import { Response } from "express"

type DataResponse = {
    success: boolean,
    message?: string,
    data?: any,
    error?: string[]
}

export enum HttpStatusCode {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERVAL_SERVER_ERROR = 500,
}

export class JSONResponse {
    static sendSuccess(res: Response, data: any, message: string | null = null) {
        let dataResponse: DataResponse = { success: true, data }
        if (message) {
            dataResponse.message = message
        }

        return res.status(HttpStatusCode.SUCCESS).json(dataResponse)
    }

    static sendError(res: Response, statusCode: HttpStatusCode, message: string | null, error: string[] | null = null) {
        let dataResponse: DataResponse = { success: false }
        if (message) {
            dataResponse.message = message
        }
        if (error) {
            dataResponse.error = error
        }

        return res.status(statusCode).json(dataResponse)
    }

    static sendErrorServerInterval(res: Response) {
        const dataResponse: DataResponse = {
            success: false,
            message: 'Error Server Interval.'
        }
        return res.status(HttpStatusCode.INTERVAL_SERVER_ERROR)
                .json(dataResponse)
    }
}