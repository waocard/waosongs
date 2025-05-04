// src/components/admin/admin-sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  MessageSquare, 
  LineChart, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShoppingCart,
  UserCheck,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { href: '/admin/artists', label: 'Artists', icon: <UserCheck className="w-5 h-5" /> },
    { href: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/songs', label: 'Songs', icon: <Music className="w-5 h-5" /> },
    { href: '/admin/statistics', label: 'Statistics', icon: <LineChart className="w-5 h-5" /> },
    { href: '/admin/payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { href: '/admin/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/admin/support', label: 'Support', icon: <HelpCircle className="w-5 h-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];
  
  const isActiveLink = (href: string) => {
    if (href === '/admin' && pathname === '/admin') {
      return true;
    }
    return href !== '/admin' && pathname.startsWith(href);
  };
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar - Desktop (fixed) and Mobile (overlay) */}
      <div 
        className={`
          ${isMobileOpen ? 'fixed inset-0 z-40 block' : 'hidden'} 
          md:relative md:block
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Backdrop for mobile */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        
        <aside 
          className={`
            fixed top-0 bottom-0 left-0 
            md:sticky md:top-0 md:h-screen
            bg-gray-900 bg-opacity-90 backdrop-blur-sm 
            transition-all duration-300 ease-in-out
            flex flex-col
            ${isCollapsed ? 'w-20' : 'w-64'}
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            z-50
          `}
        >
          {/* Sidebar Header */}
          <div className={`p-5 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center border-b border-gray-800`}>
            <div className="flex items-center">
              <Music className="w-8 h-8 text-pink-400" />
              {!isCollapsed && (
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
                  WaoSongs
                </span>
              )}
            </div>
            
            {!isCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="hidden md:block text-gray-400 hover:text-white"
                aria-label="Collapse sidebar"
              >
                <Menu size={20} />
              </button>
            )}
          </div>
          
          {/* Admin Info */}
          <div className={`p-5 ${isCollapsed ? 'items-center justify-center' : ''} flex mb-6 border-b border-gray-800`}>
            <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center'}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              
              {!isCollapsed && (
                <div className="ml-3">
                  <p className="font-medium">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-pink-400">Administrator</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center py-2 px-3 rounded-lg transition-colors duration-200
                      ${isActiveLink(item.href) 
                        ? 'bg-gradient-to-r from-pink-500/30 to-purple-600/30 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Logout */}
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={logout}
              className={`
                flex items-center py-2 px-3 rounded-lg text-gray-400 
                hover:text-white hover:bg-gray-800 w-full transition-colors duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
          
          {/* Expand button (only visible when collapsed) */}
          {isCollapsed && (
            <div className="p-3 hidden md:block">
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center p-2 w-full rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200"
                aria-label="Expand sidebar"
              >
                <Menu size={20} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}