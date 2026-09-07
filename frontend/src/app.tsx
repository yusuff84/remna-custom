import '@mantine/core/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/nprogress/styles.layer.css'
import '@gfazioli/mantine-spinner/styles.css'

import './global.css'

import { DirectionProvider, MantineProvider, v8CssVariablesResolver } from '@mantine/core'
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
import { enableMainThreadBlocking } from 'ios-vibrator-pro-max'
import { NavigationProgress } from '@mantine/nprogress'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect } from 'react'

import { initDayjs } from '@shared/utils/time-utils'
import { theme } from '@shared/constants'

import { Router } from './app/router/router'

polyfillCountryFlagEmojis()

enableMainThreadBlocking(false)

initDayjs()

export function App() {
    const mq = useMediaQuery('(min-width: 40em)')

    useEffect(() => {
        try {
            const tg = (window as unknown as { Telegram?: { WebApp?: {
                ready: () => void
                expand: () => void
                requestFullscreen?: () => void
                setHeaderColor?: (c: string) => void
                setBackgroundColor?: (c: string) => void
            } } })?.Telegram?.WebApp

            if (tg) {
                tg.ready()
                tg.expand()
                tg.requestFullscreen?.()
                tg.setHeaderColor?.('#040914')
                tg.setBackgroundColor?.('#040914')
            }
        } catch {}
    }, [])

    return (
        <DirectionProvider>
            <MantineProvider
                cssVariablesResolver={v8CssVariablesResolver}
                defaultColorScheme="dark"
                theme={theme}
            >
                <ModalsProvider>
                    <Notifications position={mq ? 'top-right' : 'bottom-right'} />
                    <NavigationProgress />

                    <Router />
                </ModalsProvider>
            </MantineProvider>
        </DirectionProvider>
    )
}
