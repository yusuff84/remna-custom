import {
    IconArrowLeft,
    IconBrandAndroid,
    IconBrandApple,
    IconBrandWindows,
    IconCheck,
    IconChevronDown,
    IconCopy,
    IconDownload,
    IconExternalLink,
    IconQrcode,
    IconRocket,
    IconStarFilled,
    IconTerminal2,
    IconX
} from '@tabler/icons-react'
import {
    ActionIcon,
    Box,
    Button,
    Group,
    Image,
    Stack,
    Text
} from '@mantine/core'
import {
    TSubscriptionPageAppConfig,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useState } from 'react'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { TemplateEngine } from '@shared/utils/template-engine'
import { useAppConfig } from '@entities/app-config-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './onboarding-wizard.module.css'

interface IProps {
    isMobile?: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

type TWizardStep = 'ask' | 'download' | 'connect'

const PLATFORM_CONFIG: Record<
    TSubscriptionPagePlatformKey,
    { label: string; icon: React.ComponentType<{ size?: number }> }
> = {
    ios: { label: 'iOS / iPhone', icon: IconBrandApple },
    android: { label: 'Android', icon: IconBrandAndroid },
    windows: { label: 'Windows', icon: IconBrandWindows },
    macos: { label: 'macOS', icon: IconBrandApple },
    linux: { label: 'Linux', icon: IconTerminal2 },
    androidTV: { label: 'Android TV', icon: IconBrandAndroid },
    appleTV: { label: 'Apple TV', icon: IconBrandApple }
}

function detectPlatform(): TSubscriptionPagePlatformKey | undefined {
    if (typeof window === 'undefined') return undefined
    const ua = navigator.userAgent || ''
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
    if (/Android/i.test(ua)) return 'android'
    if (/Macintosh|Mac OS X/i.test(ua)) return 'macos'
    if (/Windows/i.test(ua)) return 'windows'
    if (/Linux/i.test(ua)) return 'linux'
    return undefined
}

function copyToClipboard(text: string): boolean {
    let success = false
    try {
        if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
            success = true
        }
    } catch {}

    try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.top = '-9999px'
        textArea.style.left = '-9999px'
        textArea.style.opacity = '0'
        textArea.setAttribute('readonly', '')
        document.body.appendChild(textArea)
        textArea.select()
        textArea.setSelectionRange(0, 99999)
        success = document.execCommand('copy') || success
        document.body.removeChild(textArea)
    } catch {}

    return success
}

export const OnboardingWizardWidget = ({ platform }: IProps) => {
    const { t, baseTranslations } = useTranslation()
    const { platforms, svgLibrary } = useAppConfig()
    const subscription = useSubscription()
    const clipboard = useClipboard({ timeout: 2500 })

    const detectedPlatform = platform || detectPlatform()

    const [selectedPlatform, setSelectedPlatform] = useState<TSubscriptionPagePlatformKey>(() => {
        if (detectedPlatform && platforms[detectedPlatform]?.apps?.length) {
            return detectedPlatform
        }
        return 'ios'
    })

    const [isChoosingPlatform, setIsChoosingPlatform] = useState<boolean>(!detectedPlatform)
    const [step, setStep] = useState<TWizardStep>('ask')
    const [selectedAppName, setSelectedAppName] = useState<string>('')

    const availablePlatformKeys = (
        Object.keys(PLATFORM_CONFIG) as TSubscriptionPagePlatformKey[]
    ).filter((key) => Boolean(platforms[key]?.apps?.length))

    const currentPlatformApps: TSubscriptionPageAppConfig[] =
        platforms[selectedPlatform]?.apps || []

    // 2 Featured apps (left: Incy, right: Happ)
    const featuredApps = currentPlatformApps.filter((a) => a.featured)
    const topTwoApps =
        featuredApps.length >= 2
            ? featuredApps.slice(0, 2)
            : currentPlatformApps.slice(0, 2)

    // Active selected app
    const activeApp: TSubscriptionPageAppConfig =
        currentPlatformApps.find((a) => a.name === selectedAppName) ||
        topTwoApps[0] ||
        currentPlatformApps[0]

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopyKey = () => {
        vibrate('tap')
        copyToClipboard(subscriptionUrl)
        clipboard.copy(subscriptionUrl)
        notifications.show({
            title: t(baseTranslations.linkCopied),
            message: t(baseTranslations.linkCopiedToClipboard),
            color: 'blue'
        })
    }

    const handleOpenQr = () => {
        vibrate('tap')
        const subscriptionQrCode = renderSVG(subscriptionUrl, {
            whiteColor: '#0b1120',
            blackColor: '#3b82f6'
        })

        modals.open({
            centered: true,
            title: t(baseTranslations.scanQrCode),
            children: (
                <Stack align="center" gap="md">
                    <Box
                        p="xs"
                        style={{
                            background: '#0b1120',
                            borderRadius: 'var(--mantine-radius-md)',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <Image
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                            style={{ width: 220, height: 220 }}
                        />
                    </Box>
                    <Text c="dimmed" size="xs" ta="center">
                        {t(baseTranslations.scanQrCodeDescription)}
                    </Text>
                    <Button
                        fullWidth
                        leftSection={clipboard.copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                        onClick={handleCopyKey}
                        radius="md"
                    >
                        {clipboard.copied ? 'Скопировано!' : 'Скопировать ссылку'}
                    </Button>
                </Stack>
            )
        })
    }

    const handleConnect = (app: TSubscriptionPageAppConfig) => {
        vibrate('success')
        copyToClipboard(subscriptionUrl)
        clipboard.copy(subscriptionUrl)

        const linkBtn = app.blocks
            ?.flatMap((b) => b.buttons)
            ?.find((btn) => btn.type === 'subscriptionLink')

        const formattedUrl = linkBtn
            ? TemplateEngine.formatWithMetaInfo(linkBtn.link, {
                  subscriptionUrl,
                  username: subscription.user.username
              })
            : undefined

        notifications.show({
            title: 'Подключение к VPN',
            message: `Открываем ${app.name}... Ключ подписки скопирован в буфер.`,
            color: 'blue',
            autoClose: 3000
        })

        if (formattedUrl) {
            window.open(formattedUrl, '_blank')
        }
    }

    const CurrentPlatformIcon =
        PLATFORM_CONFIG[selectedPlatform]?.icon || IconBrandApple

    const renderAppIcon = (app: TSubscriptionPageAppConfig) => {
        if (app.name.toLowerCase().includes('incy')) {
            return (
                <svg
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    viewBox="0 0 24 24"
                    width="20"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            )
        }
        if (app.svgIconKey && svgLibrary[app.svgIconKey]) {
            return (
                <span
                    dangerouslySetInnerHTML={{ __html: svgLibrary[app.svgIconKey] }}
                    style={{ display: 'flex', alignItems: 'center', width: 20, height: 20 }}
                />
            )
        }
        return <IconRocket size={20} />
    }

    const getDownloadButtons = (app: TSubscriptionPageAppConfig) => {
        const externalButtons =
            app.blocks
                ?.flatMap((b) => b.buttons)
                ?.filter((b) => b.type === 'external') || []

        if (externalButtons.length > 0) {
            return externalButtons
        }
        return [
            {
                link: `https://www.google.com/search?q=${encodeURIComponent(app.name + ' vpn download')}`,
                text: { ru: `Скачать ${app.name}`, en: `Download ${app.name}` }
            }
        ]
    }

    return (
        <Box className={classes.wizardContainer}>
            {/* Device Bar */}
            <div>
                <div className={classes.deviceRow}>
                    <span className={classes.devicePill}>
                        <CurrentPlatformIcon size={14} />
                        {PLATFORM_CONFIG[selectedPlatform]?.label || selectedPlatform}
                    </span>
                    <button
                        type="button"
                        className={classes.changeDeviceBtn}
                        onClick={() => setIsChoosingPlatform(!isChoosingPlatform)}
                    >
                        {isChoosingPlatform ? 'Скрыть ▴' : 'Сменить ▾'}
                    </button>
                </div>
            </div>

            {/* Device Selector */}
            {isChoosingPlatform && (
                <div className={classes.deviceSelectorGrid}>
                    {availablePlatformKeys.map((key) => {
                        const { label, icon: Icon } = PLATFORM_CONFIG[key]
                        const isActive = selectedPlatform === key
                        return (
                            <button
                                key={key}
                                type="button"
                                className={`${classes.deviceOptionBtn} ${isActive ? classes.deviceOptionBtnActive : ''}`}
                                onClick={() => {
                                    vibrate('tap')
                                    setSelectedPlatform(key)
                                    setSelectedAppName('')
                                    setStep('ask')
                                    setIsChoosingPlatform(false)
                                }}
                            >
                                <Icon size={14} />
                                {label}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* ================= STEP 1: ASK (Установлено ли одно из приложений?) ================= */}
            {step === 'ask' && (
                <div>
                    <div className={classes.mainQuestion}>
                        Установлено у вас одно из приложений?
                    </div>
                    <div className={classes.mainSubtitle}>
                        Если да — выберите его и нажмите <strong>«Да»</strong>:
                    </div>

                    {/* Left: Incy, Right: Happ */}
                    <div className={classes.twoAppsContainer}>
                        {topTwoApps.map((app) => {
                            const isSelected = activeApp.name === app.name
                            return (
                                <div
                                    key={app.name}
                                    className={`${classes.appSelectCard} ${isSelected ? classes.appSelectCardActive : ''}`}
                                    onClick={() => {
                                        vibrate('tap')
                                        setSelectedAppName(app.name)
                                    }}
                                >
                                    <div className={classes.appIconCircle}>
                                        {renderAppIcon(app)}
                                    </div>
                                    <div className={classes.cardAppName}>{app.name}</div>
                                    <span className={classes.starBadge}>
                                        <IconStarFilled size={9} />
                                        Рекомендуем
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Two Big Action Buttons: YES / NO */}
                    <div className={classes.askButtonsRow}>
                        <button
                            type="button"
                            className={classes.btnYes}
                            onClick={() => {
                                handleConnect(activeApp)
                                setStep('connect')
                            }}
                        >
                            <IconCheck size={16} />
                            <span>ДА, У МЕНЯ {activeApp.name.toUpperCase()}</span>
                        </button>

                        <button
                            type="button"
                            className={classes.btnNo}
                            onClick={() => {
                                vibrate('tap')
                                setStep('download')
                            }}
                        >
                            <IconX size={15} />
                            <span>НЕТ, СКАЧАТЬ</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ================= STEP 2: DOWNLOAD (Экран скачивания для выбранного приложения) ================= */}
            {step === 'download' && (
                <div className={classes.downloadScreenBox}>
                    <div className={classes.mainQuestion}>
                        Скачайте {activeApp.name} на {PLATFORM_CONFIG[selectedPlatform]?.label || 'устройство'}
                    </div>
                    <div className={classes.mainSubtitle}>
                        Установите приложение на устройство, затем нажмите кнопку <strong>«Я скачал»</strong>:
                    </div>

                    {/* Dedicated Download Card for the chosen app */}
                    <div className={classes.singleAppDownloadCard}>
                        <div className={classes.appIconCircle}>
                            {renderAppIcon(activeApp)}
                        </div>
                        <div className={classes.cardAppName}>{activeApp.name}</div>

                        <div className={classes.downloadButtonsList}>
                            {getDownloadButtons(activeApp).map((btn, idx) => {
                                const raw = t(btn.text) || ''
                                const label = raw
                                    ? (raw.toLowerCase().includes(activeApp.name.toLowerCase())
                                        ? raw
                                        : `${raw} (${activeApp.name})`)
                                    : `Скачать ${activeApp.name}`

                                return (
                                    <a
                                        key={idx}
                                        href={btn.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={classes.downloadLinkCta}
                                    >
                                        <IconDownload size={15} />
                                        <span>{label}</span>
                                        <IconExternalLink size={13} />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Button: I DOWNLOADED */}
                    <button
                        type="button"
                        className={classes.iDownloadedBtn}
                        onClick={() => {
                            handleConnect(activeApp)
                            setStep('connect')
                        }}
                    >
                        <IconCheck size={18} />
                        <span>Я СКАЧАЛ {activeApp.name.toUpperCase()}</span>
                    </button>

                    {/* Back Button */}
                    <button
                        type="button"
                        className={classes.backBtn}
                        onClick={() => {
                            vibrate('tap')
                            setStep('ask')
                        }}
                    >
                        <IconArrowLeft size={14} />
                        Назад к выбору
                    </button>
                </div>
            )}

            {/* ================= STEP 3: CONNECT (Экран с кнопкой ПОДКЛЮЧИТЬ ВПН) ================= */}
            {step === 'connect' && (
                <div className={classes.connectScreenBox}>
                    <div className={classes.mainQuestion}>
                        Все готово к подключению!
                    </div>
                    <div className={classes.mainSubtitle}>
                        Нажмите кнопку ниже для автоматической настройки в {activeApp.name}:
                    </div>

                    {/* Big Primary Connect CTA Button (exact behavior like original Remnawave) */}
                    <button
                        type="button"
                        className={classes.connectButton}
                        onClick={() => handleConnect(activeApp)}
                    >
                        <IconRocket size={20} />
                        <span>ПОДКЛЮЧИТЬ ВПН</span>
                    </button>

                    {/* Fallback Manual Box */}
                    <div className={classes.manualFallbackBox}>
                        <Text
                            size="xs"
                            style={{
                                flex: 1,
                                fontFamily: 'monospace',
                                color: '#94a3b8',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {subscriptionUrl}
                        </Text>
                        <Button
                            size="xs"
                            variant="light"
                            color="blue"
                            leftSection={clipboard.copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                            onClick={handleCopyKey}
                        >
                            {clipboard.copied ? 'Скопировано' : 'Скопировать'}
                        </Button>
                        <ActionIcon
                            size="input-xs"
                            variant="default"
                            onClick={handleOpenQr}
                            style={{ background: 'rgba(30, 41, 59, 0.8)', color: '#93c5fd' }}
                            title="QR-код"
                        >
                            <IconQrcode size={16} />
                        </ActionIcon>
                    </div>

                    {/* Back Button */}
                    <button
                        type="button"
                        className={classes.backBtn}
                        onClick={() => {
                            vibrate('tap')
                            setStep('ask')
                        }}
                    >
                        <IconArrowLeft size={14} />
                        Выбрать другое приложение
                    </button>
                </div>
            )}
        </Box>
    )
}
