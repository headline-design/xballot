import { createSlice } from '@reduxjs/toolkit'
import { IS_DARK_THEME_KEY } from '../../utils/constants/common'
import { getLocalStorageItemSafely } from '../../utils/functions'

export interface UserState {
    [x: string]: any
    lastUpdateVersionTimestamp?: number // the timestamp of the last updateVersion action
    userDarkMode: boolean // the user's choice for dark mode or light mode
}

export const initialState: UserState = {
    userDarkMode: getLocalStorageItemSafely(IS_DARK_THEME_KEY, true),
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserDarkMode(state, action) {
            localStorage.setItem(IS_DARK_THEME_KEY, action.payload.userDarkMode)
            state.userDarkMode = action.payload.userDarkMode
        },
    },
})

export const { updateUserDarkMode } = userSlice.actions
export default userSlice.reducer
