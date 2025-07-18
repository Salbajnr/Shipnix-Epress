export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="48"
        height="48"
        rx="12"
        fill="url(#gradient)"
      />
      <path
        d="M24 8L40 16V32L24 40L8 32V16L24 8Z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M24 12L34 18V30L24 36L14 30V18L24 12Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
}