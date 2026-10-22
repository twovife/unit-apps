import Loading from '@/Components/Loading';
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/shadcn/ui/button';
import TambahVideo from '@/Components/TambahVideo';

const MAKS_MB = 50;

const VideoTutorial = ({ videos, menuOpsi }) => {
  const [tambahBuka, setTambahBuka] = useState(false);
  const [loading, setLoading] = useState(false);
  const [galat, setGalat] = useState({});

  const unggah = (kunci, file) => {
    if (!file) return;
    if (file.size > MAKS_MB * 1024 * 1024) {
      setGalat((g) => ({ ...g, [kunci]: `Maksimal ${MAKS_MB} MB.` }));
      return;
    }
    setGalat((g) => ({ ...g, [kunci]: null }));
    router.post(route('video_tutorial.store', kunci), { file }, {
      forceFormData: true,
      preserveScroll: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
      onError: (e) => setGalat((g) => ({ ...g, [kunci]: e.file ?? 'Gagal mengunggah.' })),
    });
  };

  const hapus = (v) => {
    if (!confirm(`Hapus video "${v.judul}"?`)) return;
    router.delete(route('video_tutorial.destroy', v.kunci), {
      preserveScroll: true,
      onStart: () => setLoading(true),
      onFinish: () => setLoading(false),
    });
  };

  return (
    <>
      <Loading show={loading} />
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Ganti video saat tampilan menu berubah. MP4, maksimal {MAKS_MB} MB. Video lama otomatis terhapus.
          </p>
          <Button onClick={() => setTambahBuka(true)}>Tambah Video</Button>
        </div>
        <TambahVideo open={tambahBuka} onOpenChange={setTambahBuka} menuOpsi={menuOpsi} onSelesai={() => router.reload()} />
        {videos.map((v) => (
          <div key={v.kunci} className="rounded-lg border p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{v.judul}</p>
                <p className="text-xs text-muted-foreground">{v.menu ? `Menu: ${v.menu}` : v.kunci}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="video/mp4"
                    className="hidden"
                    onChange={(e) => {
                      unggah(v.kunci, e.target.files[0]);
                      e.target.value = '';
                    }}
                  />
                  <span className="inline-flex h-9 items-center rounded-md border px-3 text-sm hover:bg-accent">
                    {v.ada ? 'Ganti' : 'Unggah'}
                  </span>
                </label>
                {v.ada && (
                  <Button variant="destructive" size="sm" onClick={() => hapus(v)}>
                    Hapus
                  </Button>
                )}
              </div>
            </div>
            {galat[v.kunci] && <p className="text-sm text-red-600">{galat[v.kunci]}</p>}
            {v.url ? (
              <video src={v.url} controls preload="none" className="w-full max-w-xl rounded" />
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada video.</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default VideoTutorial;
