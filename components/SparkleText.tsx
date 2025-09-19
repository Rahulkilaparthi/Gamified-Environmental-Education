import React from 'react';

interface SparkleTextProps {
  text: string;
  className?: string;
}

export const SparkleText: React.FC<SparkleTextProps> = ({ text, className = '' }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="sparkle-char"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};
