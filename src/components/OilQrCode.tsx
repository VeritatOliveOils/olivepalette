"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** QR code linking to this oil's public story page — producers can print it on labels. */
export default function OilQrCode({ productId, name }: { productId: string; name: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = `${window.location.origin}/oil/${productId}`;
    QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: "#3a4227" } })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [productId]);

  if (!dataUrl) return null;

  return (
    <div className="rounded-2xl border border-olive-200 bg-white p-5 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-olive-500">
        Label QR — links to this page
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`QR code for ${name}`} className="mx-auto h-36 w-36" />
      <a
        href={dataUrl}
        download={`${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-qr.png`}
        className="mt-2 inline-block text-sm font-medium text-olive-700 hover:underline"
      >
        Download PNG
      </a>
    </div>
  );
}
