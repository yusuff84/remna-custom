interface IProps {
    className?: string
    height?: number
    style?: React.CSSProperties
    width?: number
}

export const TopVpnLogoMark = ({
    size = 28,
    style,
    className
}: {
    className?: string
    size?: number
    style?: React.CSSProperties
}) => {
    return (
        <svg
            className={className}
            fill="none"
            height={size}
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
            viewBox="0 0 48 48"
            width={size}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M 11 36 A 18 18 0 1 1 37 36"
                fill="none"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="5"
            />
            <line
                stroke="white"
                strokeLinecap="round"
                strokeWidth="4.5"
                x1="24"
                x2="34"
                y1="25"
                y2="15"
            />
            <circle cx="24" cy="25" fill="white" r="2.5" />
        </svg>
    )
}

export const TopVpnLogo = ({ width = 120, height = 50, style, className }: IProps) => {
    return (
        <svg
            className={className}
            fill="none"
            height={height}
            style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
            viewBox="0 0 170 95"
            width={width}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* T */}
            <rect fill="white" height="8" rx="1" width="34" x="6" y="16" />
            <rect fill="white" height="40" rx="1" width="8" x="19" y="16" />

            {/* O (Speedometer Gauge) */}
            <path
                d="M 51.5 50 A 21 21 0 1 1 84.5 50"
                fill="none"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="7.5"
            />
            {/* Speedometer pointer */}
            <line
                stroke="white"
                strokeLinecap="round"
                strokeWidth="5.5"
                x1="64"
                x2="78"
                y1="40"
                y2="26"
            />
            <circle cx="64" cy="40" fill="white" r="3" />

            {/* Front Solid P */}
            <path
                d="M 100 16 H 118 C 126 16 130 20 130 28 C 130 36 126 40 118 40 H 108 V 56 H 100 Z"
                fill="white"
                fillRule="evenodd"
            />
            <path
                d="M 108 24 H 117 C 121 24 122 25.5 122 28 C 122 30.5 121 32 117 32 H 108 Z"
                fill="#050b14"
            />

            {/* Back Layered Outline P */}
            <path
                d="M 109 20 H 127 C 135 20 139 24 139 32 C 139 40 135 44 127 44 H 117 V 60 H 109 Z"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
            />

            {/* VPN Subtitle */}
            <text
                fill="white"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="17"
                fontWeight="900"
                letterSpacing="2"
                textAnchor="middle"
                x="68"
                y="78"
            >
                VPN
            </text>
        </svg>
    )
}
