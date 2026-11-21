'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/app', label: 'Dashboard' },
  { href: '/app/treasury', label: 'Treasury' },
  { href: '/app/community', label: 'Community' },
  { href: '/app/crm', label: 'Investor CRM' },
  { href: '/app/billing', label: 'Billing' },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-line bg-panel">
      <div className="px-5 py-5 text-base font-semibold tracking-tight">
        NetVoid<span className="text-accent"> Quant</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => {
          const active = n.href === '/app' ? path === '/app' || path.startsWith('/app/tokens') : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-raised hover:text-white'}`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-line p-4">
        <OrganizationSwitcher hidePersonal appearance={{ elements: { rootBox: 'w-full' } }} />
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}
