interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Background circle with gradient */}
        <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" />
        
        {/* Inner glow */}
        <circle cx="50" cy="50" r="42" fill="url(#innerGlow)" opacity="0.4" />
        
        {/* Shield shape */}
        <path
          d="M50 15 L75 25 L75 48 Q75 65 50 80 Q25 65 25 48 L25 25 Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Inner shield with gradient */}
        <path
          d="M50 22 L68 30 L68 48 Q68 61 50 72 Q32 61 32 48 L32 30 Z"
          fill="url(#shieldGradient)"
        />
        
        {/* Star symbol */}
        <path
          d="M50 35 L52.5 42 L60 42 L54 47 L56.5 54 L50 49 L43.5 54 L46 47 L40 42 L47.5 42 Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Bottom stripes */}
        <rect x="46" y="58" width="8" height="1.5" fill="white" opacity="0.9" rx="0.75" />
        <rect x="44" y="62" width="12" height="1.5" fill="white" opacity="0.9" rx="0.75" />
        <rect x="42" y="66" width="16" height="1.5" fill="white" opacity="0.9" rx="0.75" />
        
        {/* Outer ring */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="shieldGradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
