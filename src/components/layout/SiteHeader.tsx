'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', current: pathname === '/' },
    { href: '/favorites', label: 'Favorites', current: pathname === '/favorites' },
  ];

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Crypto Explorer
          </h1>
          
          <nav className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${item.current
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
