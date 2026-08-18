import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aanand Family Resto — POS',
  description: 'Multi-outlet restaurant POS and management system',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}