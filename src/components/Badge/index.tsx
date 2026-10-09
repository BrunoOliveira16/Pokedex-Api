import { StyledBadge, TypeIcon } from './styled';

export interface BadgeProps {
  type: string;
  showIcon?: boolean;
  className?: string;
}

export const Badge = ({ type, showIcon = true, className }: BadgeProps) => {
  const normalizedType = type.toLowerCase();

  return (
    <StyledBadge $type={normalizedType} className={className}>
      {showIcon && <TypeIcon $type={normalizedType} role="img" aria-label={type} />}
      <span>{type}</span>
    </StyledBadge>
  );
};
