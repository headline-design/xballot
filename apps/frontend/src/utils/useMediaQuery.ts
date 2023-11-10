import React, {useState, useEffect} from 'react'

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = () => setMatches(media.matches)
        window.addEventListener('resize', listener)
        return () => window.removeEventListener('resize', listener)
    }, [matches, query])

    return matches
}

export const MOBILE = ('(max-width: 1025px)')
export const MICROMOBILE = ('(max-width: 420px)')
export const TABLET = ('(min-width: 769px)')
export const DESKTOP = ('(min-width: 1024px)')
export const DESKTOP_LG = ('(min-width: 1284px)')

// import { MOBILE, useMediaQuery } from 'utils/useMediaQuery'
// const isMobile = useMediaQuery(MOBILE)