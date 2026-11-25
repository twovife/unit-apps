import React from 'react';
import { NumericFormat } from 'react-number-format';
import { useModeRibuan } from '@/lib/modeAngka';

const FormatNumbering = ({
  value = 0,
  prefix,
  suffix,
  className = 'text-end',
  // Tampilkan dalam ribuan (65000 -> 65), buang "000" di tabel padat.
  // Ikut saklar global di header: mode rupiah penuh mematikannya.
  ribuan: ribuanProp = false,
}) => {
  const ribuan = useModeRibuan() && ribuanProp;
  return (
    <div className={`${className}`}>
      <NumericFormat
        value={ribuan ? (Number(value) || 0) / 1000 : value}
        decimalScale={ribuan ? 1 : undefined}
        displayType={'text'}
        thousandSeparator={','}
        prefix={prefix ?? ''}
        suffix={suffix ?? ''}
      />
    </div>
  );
};

export default FormatNumbering;
