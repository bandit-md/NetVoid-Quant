import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'NetVoid Quant',
  description: 'Quantitative intelligence and operations for web3 projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#00C2FF',
          colorBackground: '#0b0b12',
          colorInputBackground: '#10101a',
          colorText: '#e6e9f2',
          colorTextSecondary: '#8a8fa3',
          colorTextOnPrimaryBackground: '#000000',
          colorNeutral: '#e6e9f2',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} ${mono.variable}`}>
        <body className="min-h-screen">{children}</body>
      </html>
    </ClerkProvider>
  );
}
