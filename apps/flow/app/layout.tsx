import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Flow - Financial Tracking Tool',
  description:
    'Track your income, expenses, and build wealth. Let money flow healthily and create abundance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Sign-In SDK for popup-based authentication */}
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
