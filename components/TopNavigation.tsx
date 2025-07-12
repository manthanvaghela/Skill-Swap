'use client';

import { useState } from 'react';

export default function TopNavigation() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, message: 'New swap request from Michael Chen', time: '2 min ago', unread: true },
    { id: 2, message: 'Emma Laurent accepted your request', time: '1 hour ago', unread: true },
    { id: 3, message: 'Sophia Wang sent you a message', time: '3 hours ago', unread: false },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-search-line text-gray-400 text-sm"></i>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search skills or users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 relative cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-notification-line"></i>
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <button className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 cursor-pointer">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-message-line"></i>
            </div>
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img
                src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20friendly%20young%20woman%20with%20shoulder-length%20brown%20hair%2C%20wearing%20a%20light%20blue%20blouse%2C%20smiling%20warmly%20at%20the%20camera%20in%20a%20clean%20modern%20office%20setting%20with%20soft%20lighting&width=40&height=40&seq=sarah-profile&orientation=squarish"
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover object-top"
              />
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-down-s-line text-gray-400"></i>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">sarah@example.com</p>
                </div>
                <div className="py-2">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    View Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer whitespace-nowrap">
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}