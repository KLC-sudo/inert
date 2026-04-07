import React from 'react';

const Logo: React.FC<{ src?: string; className?: string; style?: React.CSSProperties }> = ({ src, className, style }) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt="Anker Chicken Logo"
      className={className || "h-16 w-auto max-w-[250px] object-contain"}
      style={style}
    />
  );
};

export default Logo;
