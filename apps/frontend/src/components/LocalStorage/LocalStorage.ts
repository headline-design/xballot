/**
 * Reading a value from local storage always return a string. It can lead to type problems in JavaScript. This method check whether the value is a boolean, number or string and returns the value as the proper type.
 * @param key The local storage key.
 * @param defaultValue Optional default value to return when the item is not found in the local storage.
 */
import { isNumber } from 'lodash'

export function getLocalStorageItemSafely(key: any, defaultValue = undefined) {
    const value = localStorage.getItem(key)
    if (value !== null) {
        if (['true', 'false'].includes(value)) {
            return Boolean(value === 'true')
        } else if (isNumber(value)) {
            return +value
        } else {
            return value
        }
    } else if (defaultValue !== undefined) {
        return defaultValue
    }
    return null
}

export function getLocalStorage(name: string) {
    return localStorage.getItem(name)
}

export function setLocalStorage(name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value))
}

export function deleteLocalStorage(name: string) {
    localStorage.removeItem(name)
}

export function clearLocalStorage() {
    localStorage.clear()
}

export function clearLocalStorageExcept(keys: string[]) {
    const values = []
    for (let key of keys) {
        const v = getLocalStorageItemSafely(key)
        if (v !== null && v !== undefined) {
            values.push(v)
        }
    }
    clearLocalStorage()
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        if (values[i] !== 'null' && values[i] !== 'undefined') {
            setLocalStorage(key, values[i])
        }
    }
}