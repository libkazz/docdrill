// メタデータ（アプリ名/説明文）は明示的に未設定

import './globals.css';
import { Noto_Sans_JP } from 'next/font/google';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400','700','900'],
  display: 'swap'
});

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={notoSansJp.className}>{children}</body>
    </html>
  );
}
