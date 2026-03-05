import api from './axios'

export const getEntries = (params = {}) => api.get('/entries', { params })
export const getEntry = (id) => api.get(`/entries/${id}`)
export const createEntry = (data) => api.post('/entries', data)
export const updateEntry = (id, data) => api.put(`/entries/${id}`, data)
export const deleteEntry = (id) => api.delete(`/entries/${id}`)
