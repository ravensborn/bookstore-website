import React, { useEffect, useState } from 'react';

interface BookCoverProps {
  title: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
}

const BookCover: React.FC<BookCoverProps> = ({
  title,
  className = '',
  width = '100%',
  height = '100%',
  color = '#6B7280',
}) => {
  const baseFontSize = 48;
  const minFontSize = 40;

  const wrapText = (text: string, maxLength: number) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += word + ' ';
      } else {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const maxLength = 14;
  const wrappedTitle =
    title.length > maxLength ? wrapText(title, maxLength) : [title];

  const [fontSize, setFontSize] = useState(baseFontSize);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    let newFontSize = baseFontSize;

    if (screenWidth < 600) {
      newFontSize = baseFontSize * 0.8;
    } else if (screenWidth < 1024) {
      newFontSize = baseFontSize * 1.2;
    } else {
      newFontSize = baseFontSize * 1.4;
    }

    setFontSize(Math.max(newFontSize, minFontSize));
  }, []);

  const totalTextHeight = wrappedTitle.length * fontSize * 1.2;
  const startY = (512 - totalTextHeight) / 2 + fontSize / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="0" y="0" width="512" height="512" rx="16" ry="16" fill={color} />
      <rect x="0" y="0" width="80" height="512" fill="#111827" />
      {wrappedTitle.map((line, index) => (
        <text
          key={index}
          x="50%"
          y={startY + index * (fontSize * 1.2)}
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="bold"
          fill="#F9FAFB"
          fontFamily="'Noto Naskh Arabic', 'Arial', 'Tahoma', sans-serif"
        >
          {line}
        </text>
      ))}
    </svg>
  );
};

export default BookCover;
