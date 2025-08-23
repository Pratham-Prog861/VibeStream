'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Search, Library, ListMusic, Sparkles, Menu, Music2 } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Your Library', icon: Library },
  { href: '/playlists', label: 'Playlists', icon: ListMusic },
  { href: '/generate-playlist', label: 'AI Playlist', icon: Sparkles },
];

const NavContent = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-semibold">
          <Music2 className="h-8 w-8 text-accent" />
          VibeStream
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            asChild
            variant={pathname === link.href ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3"
          >
            <Link href={link.href}>
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default function AppSidebar() {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="fixed left-4 top-4 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col md:fixed md:inset-y-0 md:flex">
        <NavContent />
      </aside>
    </>
  );
}
