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
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512.004 512.004"
    xmlSpace="preserve"
    className={className}
    width={width}
    height={height}
  >
    <rect
      x="49.003"
      className="fill-gray-300"
      width="413.998"
      height="512.004"
    />
    <rect x="49.003" width="120.914" height="512.004" />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      alignmentBaseline="middle"
      fontSize="30"
      fontWeight="bold"
      fill="white"
      textLength="300"
      lengthAdjust="spacingAndGlyphs"
    >
      {title}
    </text>
  </svg>
);

export default BookCover;
