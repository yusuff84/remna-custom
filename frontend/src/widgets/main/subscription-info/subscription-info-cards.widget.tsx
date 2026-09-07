import { IconArrowsUpDown, IconCalendar } from '@tabler/icons-react'
import { Box, Group, Progress, Stack, Text } from '@mantine/core'

import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-info-cards.module.css'

interface IProps {
    isMobile: boolean
}

export const SubscriptionInfoCardsWidget = ({ isMobile: _ }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()
    const { user } = subscription

    const isUnlimited = user.trafficLimit === '0' || !user.trafficLimit
    const bandwidthValue = isUnlimited
        ? `${user.trafficUsed} / ∞`
        : `${user.trafficUsed} / ${user.trafficLimit}`

    const trafficPercent = (() => {
        try {
            const used = Number(user.trafficUsedBytes) || 0
            const limit = Number(user.trafficLimitBytes) || 0
            if (limit <= 0) return 0
            return Math.min(100, Math.round((used / limit) * 100))
        } catch {
            return 0
        }
    })()

    return (
        <div className={classes.cardsGrid}>
            {/* 1. Срок действия */}
            <Box className={classes.cardItem}>
                <Group gap="xs" wrap="nowrap">
                    <div className={classes.iconWrapper}>
                        <IconCalendar size={15} />
                    </div>
                    <Stack gap={1} style={{ minWidth: 0, flex: 1 }}>
                        <Text className={classes.label}>
                            {t(baseTranslations.expires)}
                        </Text>
                        <Text className={classes.value} truncate="end">
                            {formatDate(user.expiresAt, currentLang, baseTranslations)}
                        </Text>
                    </Stack>
                </Group>
            </Box>

            {/* 2. Трафик с прогресс-баром */}
            <Box className={classes.cardItem}>
                <Group gap="xs" wrap="nowrap">
                    <div className={classes.iconWrapper}>
                        <IconArrowsUpDown size={15} />
                    </div>
                    <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                        <Group justify="space-between" wrap="nowrap">
                            <Text className={classes.label}>
                                {t(baseTranslations.bandwidth)}
                            </Text>
                            {!isUnlimited && (
                                <Text c="dimmed" size="10px" fw={600} lh={1}>
                                    {trafficPercent}%
                                </Text>
                            )}
                        </Group>
                        <Text className={classes.value} lh={1.1} truncate="end">
                            {bandwidthValue}
                        </Text>
                        {!isUnlimited && (
                            <Progress
                                color="blue"
                                radius="xl"
                                size="xs"
                                styles={{
                                    root: { background: 'rgba(255, 255, 255, 0.08)', height: 3 }
                                }}
                                value={trafficPercent}
                            />
                        )}
                    </Stack>
                </Group>
            </Box>
        </div>
    )
}
