import Loading from '@/Components/Loading';
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shadcn/ui/accordion';
import React, { useState } from 'react';
import WhiteOff from './WhiteOff';
import PengajuanLama from './PengajuanLama';

/**
 * Gerbang tombol "Pengajuan" (top-up/refinance): cuma boleh dipakai kalau
 * sisa saldo pinjaman ini sudah kecil DAN belum masuk kategori macet berat.
 *
 *  - saldo <= 40% dari pokok pinjaman (sudah bayar >= 60%)
 *  - status_pinjaman (kategori umur tunggakan) masih 'normal' atau 'cm' -
 *    'mb'/'ml' berarti sudah macet, tidak layak ditawari top-up.
 */
const canAjukanPengajuan = (triggeredPinjaman) => {
  const pinjaman = triggeredPinjaman?.pinjaman ?? 0;
  const saldo = triggeredPinjaman?.saldo ?? 0;
  if (pinjaman <= 0) return false;
  if (saldo / pinjaman > 0.4) return false;
  return ['normal', 'cm'].includes(triggeredPinjaman?.status_pinjaman);
};

const Pengajuan = ({ triggeredId, triggeredPinjaman, instalment }) => {
  const [activePanel, setActivePanel] = useState(null);
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const pelunasan = instalment.sort((a, b) => a.saldo - b.saldo)[0]?.saldo ?? 0;
  const bolehPengajuan = canAjukanPengajuan(triggeredPinjaman);

  return (
    <Card className="relative w-full mb-3">
      <Loading show={false} />
      <CardHeader>
        <CardTitle>Action</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex gap-3 mb-1">
          <Button
            variant={activePanel == 'item-1' ? 'green' : 'outline'}
            onClick={() => togglePanel('item-1')}
            disabled={!bolehPengajuan}
          >
            Pengajuan
          </Button>

          <Button
            variant={activePanel == 'item-2' ? 'green' : 'outline'}
            onClick={() => togglePanel('item-2')}
          >
            Pemutihan
          </Button>
        </div>
        {!bolehPengajuan && (
          <p className="mb-3 text-xs font-medium leading-relaxed text-amber-600">
            Pengajuan cuma bisa dipakai kalau sisa saldo pinjaman ini sudah
            &le;40% dari pokok pinjaman dan belum masuk kategori MB/ML.
          </p>
        )}
        <Accordion
          type="single"
          collapsible
          value={activePanel}
          onValueChange={setActivePanel}
        >
          <AccordionItem borderless={true} value="item-1">
            <AccordionContent>
              {activePanel == 'item-1' && (
                <PengajuanLama
                  isActive={activePanel == 'item-1'}
                  triggeredId={triggeredId}
                  triggeredPinjaman={triggeredPinjaman}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem borderless={true} value="item-2">
            <AccordionContent>
              {activePanel == 'item-2' && (
                <WhiteOff
                  triggeredId={triggeredId}
                  nominalWhiteOff={pelunasan ?? 0}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Pengajuan;
