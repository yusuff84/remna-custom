import { IconCheck, IconCopy, IconKey, IconQrcode } from '@tabler/icons-react'
import { ActionIcon, Box, Button, Group, Image, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { vibrate } from '@shared/utils/vibrate'
import { useTranslation } from '@shared/hooks'

import classes from './quick-key.module.css'

interface IProps {
    isMobile?: boolean
}

export const QuickKeyWidget = ({ isMobile: _ }: IProps) => {
    const { t, baseTranslations } = useTranslation()
    const subscription = useSubscription()
    const clipboard = useClipboard({ timeout: 2500 })

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopy = () => {
        vibrate('tap')
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
                            style={{
                                width: 220,
                                height: 220,
                                display: 'block'
                            }}
                        />
                    </Box>
                    <Text c="dimmed" size="xs" ta="center" px="md">
                        {t(baseTranslations.scanQrCodeDescription)}
                    </Text>
                    <Button
                        fullWidth
                        leftSection={clipboard.copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                        onClick={handleCopy}
                        radius="md"
                        size="xs"
                    >
                        {clipboard.copied ? t(baseTranslations.linkCopied) : t(baseTranslations.copyLink)}
                    </Button>
                </Stack>
            )
        })
    }

    return (
        <Box className={classes.container}>
            <div className={classes.topRow}>
                <div className={classes.titleGroup}>
                    <div className={classes.keyIcon}>
                        <IconKey size={12} />
                    </div>
                    <span className={classes.title}>Ссылка на ключ подписки</span>
                </div>
                <span className={classes.subtitle}>для прямого импорта</span>
            </div>

            <div className={classes.inputGroup}>
                <div className={classes.keyDisplay} title={subscriptionUrl}>
                    {subscriptionUrl}
                </div>

                <Button
                    className={classes.copyButton}
                    leftSection={clipboard.copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    onClick={handleCopy}
                    radius="sm"
                >
                    {clipboard.copied ? 'Скопировано' : 'Скопировать'}
                </Button>

                <ActionIcon
                    className={classes.qrButton}
                    onClick={handleOpenQr}
                    radius="sm"
                    title={t(baseTranslations.scanQrCode)}
                >
                    <IconQrcode size={16} />
                </ActionIcon>
            </div>
        </Box>
    )
}
