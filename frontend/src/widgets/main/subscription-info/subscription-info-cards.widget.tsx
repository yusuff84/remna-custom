import { IconCalendar } from '@tabler/icons-react'
import { Box, Group, Text } from '@mantine/core'

import { useSubscription } from '@entities/subscription-info-store'
import { formatDate } from '@shared/utils/config-parser'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-info-cards.module.css'

interface IProps {
    isMobile?: boolean
}

export const SubscriptionInfoCardsWidget = ({ isMobile: _ }: IProps) => {
    const { t, currentLang, baseTranslations } = useTranslation()
    const subscription = useSubscription()
    const { user } = subscription

    return (
        <Box className={classes.cardItem}>
            <Group justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                    <div className={classes.iconWrapper}>
                        <IconCalendar size={14} />
                    </div>
                    <Text className={classes.label}>
                        {t(baseTranslations.expires)}
                    </Text>
                </Group>
                <Text className={classes.value}>
                    {formatDate(user.expiresAt, currentLang, baseTranslations)}
                </Text>
            </Group>
        </Box>
    )
}
