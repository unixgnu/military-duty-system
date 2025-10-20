interface LogoProps {
  size?: number;
  variant?: 'shield' | 'star' | 'badge' | 'minimal';
}

export function LogoShield({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 5 L85 20 L85 50 Q85 75 50 95 Q15 75 15 50 L15 20 Z"
        fill="url(#grad1)"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M50 15 L75 25 L75 50 Q75 68 50 82 Q25 68 25 50 L25 25 Z"
        fill="url(#grad2)"
        opacity="0.3"
      />
      <path
        d="M50 35 L53 45 L63 45 L55 51 L58 61 L50 55 L42 61 L45 51 L37 45 L47 45 Z"
        fill="white"
      />
      <rect x="45" y="62" width="10" height="2" fill="white" opacity="0.8" rx="1" />
      <rect x="42" y="67" width="16" height="2" fill="white" opacity="0.8" rx="1" />
      <rect x="40" y="72" width="20" height="2" fill="white" opacity="0.8" rx="1" />
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoStar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="45" fill="url(#gradStar1)" />
      <circle cx="50" cy="50" r="38" fill="url(#gradStar2)" opacity="0.3" />
      <path
        d="M50 20 L56 42 L78 42 L60 56 L66 78 L50 64 L34 78 L40 56 L22 42 L44 42 Z"
        fill="white"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient id="gradStar1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="gradStar2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoBadge({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="42" fill="url(#gradBadge1)" />
      <circle cx="50" cy="50" r="36" fill="url(#gradBadge2)" />
      <circle cx="50" cy="50" r="30" fill="white" opacity="0.1" />
      <text
        x="50"
        y="60"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        ВС
      </text>
      <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
      <defs>
        <linearGradient id="gradBadge1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="gradBadge2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMinimal({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="10" y="10" width="80" height="80" rx="16" fill="url(#gradMin1)" />
      <rect x="15" y="15" width="70" height="70" rx="12" fill="url(#gradMin2)" opacity="0.3" />
      <path
        d="M35 45 L50 30 L65 45 L60 45 L60 65 L40 65 L40 45 Z"
        fill="white"
        opacity="0.9"
      />
      <rect x="45" y="50" width="10" height="15" fill="white" opacity="0.7" />
      <defs>
        <linearGradient id="gradMin1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="gradMin2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ size = 40, variant = 'shield' }: LogoProps) {
  switch (variant) {
    case 'star':
      return <LogoStar size={size} />;
    case 'badge':
      return <LogoBadge size={size} />;
    case 'minimal':
      return <LogoMinimal size={size} />;
    default:
      return <LogoShield size={size} />;
  }
}
