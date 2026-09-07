import { Box, Container, Group, Stack, Title } from '@mantine/core'
import { TSubscriptionPagePlatformKey } from '@remnawave/subscription-page-types'

import {
    OnboardingWizardWidget,
    QuickKeyWidget,
    SubscriptionInfoCardsWidget,
    SubscriptionLinkWidget
} from '@widgets/main'
import { useAppConfig, useAppConfigStoreActions, useCurrentLang } from '@entities/app-config-store'
import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { Page, TopVpnLogoMark } from '@shared/ui'

interface IMainPageComponentProps {
    isMobile: boolean
    platform: TSubscriptionPagePlatformKey | undefined
}

export const MainPageComponent = ({ isMobile, platform }: IMainPageComponentProps) => {
    const config = useAppConfig()
    const currentLang = useCurrentLang()
    const { setLanguage } = useAppConfigStoreActions()

    const brandName = config.brandingSettings.title

    const hasPlatformApps: Record<TSubscriptionPagePlatformKey, boolean> = {
        ios: Boolean(config.platforms.ios?.apps.length),
        android: Boolean(config.platforms.android?.apps.length),
        linux: Boolean(config.platforms.linux?.apps.length),
        macos: Boolean(config.platforms.macos?.apps.length),
        windows: Boolean(config.platforms.windows?.apps.length),
        androidTV: Boolean(config.platforms.androidTV?.apps.length),
        appleTV: Boolean(config.platforms.appleTV?.apps.length)
    }

    const atLeastOnePlatformApp = Object.values(hasPlatformApps).some((value) => value)
    const showSubscriptionInfo = config.uiConfig.subscriptionInfoBlockType !== 'hidden'

    return (
        <Page>
            {/* Header */}
            <Box className="header-wrapper" py="xs">
                <Container maw={1100} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
                    <Group justify="space-between">
                        {/* Logo Mark + Brand Name pulled from config */}
                        <Group gap="xs" style={{ userSelect: 'none' }} wrap="nowrap">
                            <TopVpnLogoMark size={28} />
                            <Title
                                c="white"
                                fw={800}
                                order={4}
                                size="md"
                                style={{ letterSpacing: '0.8px' }}
                            >
                                {brandName || 'TOP VPN'}
                            </Title>
                        </Group>

                        {/* Language & Support Actions */}
                        <Group gap="xs" wrap="nowrap">
                            <LanguagePicker
                                currentLang={currentLang}
                                locales={config.locales}
                                onLanguageChange={setLanguage}
                            />
                            <SubscriptionLinkWidget
                                hideGetLink={config.baseSettings.hideGetLinkButton}
                                supportUrl={config.brandingSettings.supportUrl}
                            />
                        </Group>
                    </Group>
                </Container>
            </Box>

            {/* Main Content */}
            <Container
                maw={600}
                px={{ base: 10, sm: 'md' }}
                py={{ base: 8, sm: 'md', md: 'lg' }}
                style={{ position: 'relative', zIndex: 1, margin: '0 auto' }}
            >
                <Stack gap={6} align="center" style={{ width: '100%' }}>
                    {/* 1. Верхний компактный блок: Срок действия и Трафик */}
                    {showSubscriptionInfo && (
                        <Box style={{ width: '100%' }}>
                            <SubscriptionInfoCardsWidget isMobile={isMobile} />
                        </Box>
                    )}

                    {/* 2. Ссылка на ключ для быстрого копирования */}
                    <Box style={{ width: '100%' }}>
                        <QuickKeyWidget isMobile={isMobile} />
                    </Box>

                    {/* 3. Нижний интерактивный блок подключения с аккуратным отступом */}
                    {atLeastOnePlatformApp && (
                        <Box mt={{ base: 10, sm: 16, md: 24 }} style={{ width: '100%' }}>
                            <OnboardingWizardWidget
                                isMobile={isMobile}
                                platform={platform}
                            />
                        </Box>
                    )}
                </Stack>
            </Container>
        </Page>
    )
}
