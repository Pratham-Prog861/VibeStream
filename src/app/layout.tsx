import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import AppSidebar from '@/components/layout/sidebar';
import MusicPlayer from '@/components/layout/player';
import '@/lib/firebase';

export const metadata: Metadata = {
  title: 'VibeStream',
  description: 'A sleek and modern music streaming web app.',
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/music-player.ico"/>
      </head>
      <body className={cn('font-body antialiased')}>
        <div className="relative flex min-h-screen bg-background text-foreground">
          <AppSidebar />
          <main className="flex-1 md:ml-64">
            <div className="h-full overflow-y-auto p-6 pt-24 md:p-8 md:pt-8 pb-32">
              {children}
            </div>
          </main>
        </div>
        <MusicPlayer />
        <Toaster />
      </body>
    </html>
  );
}
