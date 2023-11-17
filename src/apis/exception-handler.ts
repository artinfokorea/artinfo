import axios from "axios"

const exceptionHandler = (error: any, message: string) => {
  if (axios.isAxiosError(error)) {
    return `😫 error message \n ${message} \n ${error.message}`
  }
  return `😱 unexpected error: ${error}`
}

export { exceptionHandler }
