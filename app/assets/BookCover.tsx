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
}) => {
  let fontSize = 24;
  if (title.length < 10) {
    fontSize = 40;
  } else if (title.length < 20) {
    fontSize = 32;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#6B7280" />
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

      {/* Spine */}
      <rect x="0" y="0" width="80" height="512" fill="#111827" />

      {/* Book title */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fill="#F9FAFB"
        fontFamily="'Noto Naskh Arabic', 'Arial', 'Tahoma', sans-serif"
      >
        {title}
      </text>
    </svg>
  );
};

export default BookCover;
