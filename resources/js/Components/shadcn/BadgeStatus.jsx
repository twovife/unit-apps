import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import React from 'react';
const variantMap = {
  open: 'blue',
  acc: 'green',
  success: 'green',
  tolak: 'destructive',
  gagal: 'destructive',
  lama: 'old',
  baru: 'new',
};
const BadgeStatus = ({ value, onClick, ...props }) => {
  const variant = variantMap[value] || 'default';
  return (
    <Badge {...props} onClick={onClick} size="xs" variant={variant}>
      {value}
    </Badge>
  );
};

export default BadgeStatus;
