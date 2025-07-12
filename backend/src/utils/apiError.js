class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrrong",
        errors = [],
        stack = ""
    ){
        super(message) // supercall means this is gonna be overrided by the inputs
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }