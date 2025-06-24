
import React from 'react';
import NavItem from './NavItem';
import { HomeIcon, Cog6ToothIcon, ChatBubbleLeftEllipsisIcon, MegaphoneIcon, UserGroupIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline'; // Using outline icons
import { NavItemType } from '../types';


const iconStyle = { width: '24px', height: '24px' };

const navItems: NavItemType[] = [
  { name: 'Dashboard', path: '/dashboard', icon: (props) => <HomeIcon {...props} /> },
  { name: 'Bot Config', path: '/config', icon: (props) => <Cog6ToothIcon {...props} /> },
  { name: 'Welcome Msg', path: '/welcome', icon: (props) => <ChatBubbleLeftEllipsisIcon {...props} /> },
  { name: 'Auto-Reply', path: '/auto-reply', icon: (props) => <PresentationChartBarIcon {...props} /> },
  { name: 'Broadcast', path: '/broadcast', icon: (props) => <MegaphoneIcon {...props} /> },
  { name: 'Customer Service', path: '/customer-service', icon: (props) => <UserGroupIcon {...props} /> },
];

const Navbar: React.FC = () => {
  return (
    <nav className="w-64 bg-gray-900 text-gray-300 flex flex-col p-4 space-y-2">
      <div className="text-2xl font-bold text-white mb-6 px-2">Viber Bot Admin</div>
      {navItems.map((item) => (
        <NavItem key={item.name} item={item} iconProps={iconStyle} />
      ))}
    </nav>
  );
};

export default Navbar;
