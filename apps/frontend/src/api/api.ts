import axios from 'axios'
import { getLocalStorage } from '../localStorage/localStorage'

export const apiCall = (method: string, url: string, body?: any) => {
    if (method === 'get') {
        attachTokenToHeader(url)
        return axios.get(url)
    } else if (method === 'post') {
        attachTokenToHeader(url)
        return axios.post(url, body)
    } else if (method === 'put') {
        attachTokenToHeader(url)
        return axios.put(url, body)
    } else {
        attachTokenToHeader(url)
        return axios.delete(url)
    }
}
function attachTokenToHeader(url: string) {
    if (!url.includes('login') && getLocalStorage('token')) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(
            getLocalStorage('token') || ''
        )}`
    }
}