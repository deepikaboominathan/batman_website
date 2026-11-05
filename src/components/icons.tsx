import type { ReactNode } from "react";

type IconProps = {
  size?: number;
};

const S = ({
  size = 16,
  children,
}: IconProps & {
  children: ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const SkipForward = (props: IconProps) => (
  <S {...props}>
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </S>
);

export const RotateCcw = (props: IconProps) => (
  <S {...props}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </S>
);

export const ArrowRight = (props: IconProps) => (
  <S {...props}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </S>
);

export const ExternalLink = (props: IconProps) => (
  <S {...props}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </S>
);