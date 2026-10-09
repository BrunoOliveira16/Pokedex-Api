import React from 'react';

import { BadgeIcon, StyledBadge } from './styled';

export interface BadgeProps {
  type: string;
  showIcon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, showIcon = true, className }) => {
  const iconPath = `/images/${type.toLowerCase()}.svg`;

  return (
    <StyledBadge $type={type.toLowerCase()} className={className}>
      {showIcon && (
        <BadgeIcon
          src={iconPath}
          alt={type}
          onError={(e) => {
            // Hide icon if SVG fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      )}
      <span>{type}</span>
    </StyledBadge>
  );
};
