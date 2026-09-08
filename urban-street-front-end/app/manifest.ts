import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/', name: 'Urban Street', short_name: 'Urban Street',
    description: 'ขายสินค้า จัดการเมนู และดูยอดขาย Urban Street',
    lang: 'th', start_url: '/', scope: '/', display: 'standalone',
    background_color: '#ffffff', theme_color: '#ffffff',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'ขายสินค้า', url: '/' },
      { name: 'รายงานยอดขาย', url: '/dashboard' },
      { name: 'จัดการเมนู', url: '/menu' },
    ],
  };
}
