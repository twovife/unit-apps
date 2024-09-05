import { Badge } from '@/shadcn/ui/badge';
import { Button } from '@/shadcn/ui/button';
import React from 'react';
const variantMap = {
  open: 'blue',
  acc: 'green',
  success: 'green',
  tolak: 'destructive',
  gagal: 'destructive',
};
const BargeStatus = ({ value, onClick, ...props }) => {
  console.log(value);

  const variant = variantMap[value] || 'default';
  return (
    <Button {...props} onClick={onClick} size="xs" variant={variant}>
      {value}
    </Button>
  );
};

export default BargeStatus;
