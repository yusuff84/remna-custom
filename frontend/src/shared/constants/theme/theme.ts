import { createTheme } from '@mantine/core'

import components from './overrides'

export const theme = createTheme({
    components,
    cursorType: 'pointer',
    fontFamily:
        'Montserrat, Vazirmatn, Apple Color Emoji, Noto Sans SC, Twemoji Country Flags, sans-serif',
    fontFamilyMonospace: 'Fira Mono, monospace',
    breakpoints: {
        xs: '25em',
        sm: '30em',
        md: '48em',
        lg: '64em',
        xl: '80em',
        '2xl': '96em',
        '3xl': '120em',
        '4xl': '160em'
    },
    scale: 1,
    fontSmoothing: true,
    focusRing: 'never',
    white: '#ffffff',
    black: '#24292f',
    colors: {
        dark: [
            '#e2e8f0',
            '#cbd5e1',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e293b',
            '#0f172a',
            '#0a0f1d',
            '#060913'
        ],

        blue: [
            '#eff6ff',
            '#dbeafe',
            '#bfdbfe',
            '#93c5fd',
            '#60a5fa',
            '#3b82f6',
            '#2563eb',
            '#1d4ed8',
            '#1e40af',
            '#1e3a8a'
        ],
        green: [
            '#ecfdf5',
            '#d1fae5',
            '#a7f3d0',
            '#6ee7b7',
            '#34d399',
            '#10b981',
            '#059669',
            '#047857',
            '#065f46',
            '#064e3b'
        ],
        yellow: [
            '#fefce8',
            '#fef9c3',
            '#fef08a',
            '#fde047',
            '#facc15',
            '#eab308',
            '#ca8a04',
            '#a16207',
            '#854d0e',
            '#713f12'
        ],
        orange: [
            '#fff7ed',
            '#ffedd5',
            '#fed7aa',
            '#fdba74',
            '#fb923c',
            '#f97316',
            '#ea580c',
            '#c2410c',
            '#9a3412',
            '#7c2d12'
        ]
    },
    primaryShade: 6,
    primaryColor: 'blue',
    autoContrast: true,
    luminanceThreshold: 0.3,
    headings: {
        fontFamily: 'Unbounded, Vazirmatn, Apple Color Emoji, Noto Sans SC, sans-serif',
        fontWeight: '600'
    },
    defaultRadius: 'md'
})
