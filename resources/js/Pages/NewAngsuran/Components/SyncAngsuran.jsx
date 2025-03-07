import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import axios from 'axios';

const SyncAngsuran = ({ show = show, onClosed, triggeredId }) => {
  const [syncData, setSyncData] = useState(null);

  const modalIsClosed = () => {
    onClosed();
  };

  useEffect(() => {
    if (show && triggeredId) {
      axios
        .get(route('pinjaman.get_synch_angsuran', triggeredId))
        .then((res) => {
          setSyncData(res.data);
        });
    }
  }, [show]);

  return (
    <Dialog open={show} onOpenChange={(open) => (open ? '' : modalIsClosed())}>
      <DialogContent className={`p-1 lg:p-6 min-w-[50vw] max-w-[90vw] w-auto`}>
        <DialogHeader>
          <DialogTitle>Perbaiki Angsuran</DialogTitle>
        </DialogHeader>
        <div className="h-[80vh]">
          {syncData ? JSON.stringify(syncData) : 'SyncAngsuran'}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SyncAngsuran;
