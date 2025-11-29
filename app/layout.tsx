import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vocode - AI Oral Exam Trainer',
  description: 'Practice for any oral exam with an AI voice assessor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}