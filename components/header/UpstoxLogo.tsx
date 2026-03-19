export function UpstoxLogo() {
  return (
    <svg
      width="110"
      height="28"
      viewBox="0 0 110 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Upstox"
    >
      {/* U mark — stylised arrow/chevron */}
      <path
        d="M4 4 L4 17 Q4 24 11 24 Q18 24 18 17 L18 4"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 18 L18 11 L25 18"
        stroke="var(--color-brand-light)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Wordmark */}
      <text
        x="30"
        y="20"
        fontFamily="'Geist', 'Inter', sans-serif"
        fontWeight="700"
        fontSize="16"
        fill="white"
        letterSpacing="-0.3"
      >
        upstox
      </text>
    </svg>
  );
}
