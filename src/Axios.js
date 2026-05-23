import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:4000"
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token")
            navigate("/login")
        }
        return Promise.reject(error)
    }
)

export const setToken = (token) => {
    localStorage.setItem("token", token)
}

export const getToken = () => {
    return localStorage.getItem("token")
}

export const getCall = async (url, filters) => {
    return await axiosInstance.get(url, {
        params: filters
    })
}

export const postCall = async (url, data) => {
    return await axiosInstance.post(url, data)
}

export const putCall = async (url, data) => {
    return await axiosInstance.put(url, data)
}

export const deleteCall = async (url, data) => {
    return await axiosInstance.delete(url, {
        data: data
    })
}

export const patchCall = async (url, data) => {
    return await axiosInstance.patch(url, data)
}

