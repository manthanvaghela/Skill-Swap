'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: 'ri-dashboard-line', href: '/' },
    { name: 'My Profile', icon: 'ri-user-line', href: '/profile' },
    { name: 'My Swaps', icon: 'ri-exchange-line', href: '/swaps' },
    { name: 'Schedule', icon: 'ri-calendar-line', href: '/schedule' },
    { name: 'Messages', icon: 'ri-message-line', href: '/messages' },
    { name: 'Settings', icon: 'ri-settings-line', href: '/settings' },
    { name: 'Help Center', icon: 'ri-question-line', href: '/help' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="text-2xl font-bold text-blue-600 font-pacifico">logo</div>
      </div>
      
      <nav className="px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center mr-3">
              <i className={item.icon}></i>
            </div>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}