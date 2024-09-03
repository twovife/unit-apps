import { Badge } from '@/shadcn/ui/badge';
import React from 'react';

const BargeStatus = ({ value }) => {
  if (value === 'open') {
    return <Badge variant="blue">{value}</Badge>;
  } else if (value === 'acc') {
    return <Badge variant="green">{value}</Badge>;
  } else if (value === 'success') {
    return <Badge variant="green">{value}</Badge>;
  } else if (value === 'tolak') {
    return <Badge variant="destructive">{value}</Badge>;
  } else if (value === 'gagal') {
    return <Badge variant="destructive">{value}</Badge>;
  } else {
    return <Badge variant="default">{value}</Badge>;
  }
};

export default BargeStatus;
