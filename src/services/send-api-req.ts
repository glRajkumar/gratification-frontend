import axios, { type AxiosRequestConfig } from "axios"

type SendApiReqParams = AxiosRequestConfig

export function sendApiReq<T = unknown>(params: SendApiReqParams): Promise<T> {
  const instance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
  })

  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      const err = new Error(
        error?.response?.data?.message ??
          error?.message ??
          "Something went wrong",
      )
      throw err
    },
  )

  return instance(params) as Promise<T>
}
