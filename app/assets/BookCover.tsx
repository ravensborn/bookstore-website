import React from 'react';

interface BookCoverProps {
  title: string;
  className?: string;
  width?: number | string;
  height?: number | string;
}

const BookCover: React.FC<BookCoverProps> = ({
  title,
  className = '',
  width = '100%',
  height = '100%',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
    width={width}
    height={height}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Background with a soft gradient */}
    <defs>
      <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4B5563" /> {/* Gray-700 */}
        <stop offset="100%" stopColor="#6B7280" /> {/* Gray-500 */}
      </linearGradient>
    </defs>

    <rect
      x="0"
      y="0"
      width="512"
      height="512"
      rx="16"
      ry="16"
      fill="url(#coverGradient)"
    />

    {/* Vertical strip like a spine */}
    <rect
      x="0"
      y="0"
      width="80"
      height="512"
      fill="#111827" // Gray-900
    />

    {/* Book title */}
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="32"
      fontWeight="bold"
      fill="#F9FAFB"
      letterSpacing="1px"
      textLength="340"
      lengthAdjust="spacingAndGlyphs"
    >
      {title}
    </text>
  </svg>
);

export default BookCover;
