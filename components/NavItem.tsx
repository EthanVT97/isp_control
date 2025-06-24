
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NavItemType } from '../types';

interface NavItemProps {
  item: NavItemType;
  iconProps?: React.SVGProps<SVGSVGElement>;
}

const NavItem: React.FC<NavItemProps> = ({ item, iconProps }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
        ${isActive
          ? 'bg-sky-600 text-white shadow-lg'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      {React.createElement(item.icon, {...iconProps, className: "h-5 w-5"})}
      <span>{item.name}</span>
    </NavLink>
  );
};

export default NavItem;
