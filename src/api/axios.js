import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

// Response interceptor – normalise errors
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Error de red. Por favor intente de nuevo.'
        return Promise.reject(new Error(message))
    }
)

export default api
