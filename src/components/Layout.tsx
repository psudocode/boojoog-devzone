import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  InfoIcon,
  HomeIcon,
  SettingsIcon,
  Edit3Icon,
  ServerIcon,
  PlusCircleIcon,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Navigation items with path and active state
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: <HomeIcon size={16} className="mr-1" />,
      isActive: location.pathname === "/",
    },
    {
      path: "/local-site",
      label: "Local Site",
      icon: <PlusCircleIcon size={16} className="mr-1" />,
      isActive: location.pathname === "/local-site",
    },
    {
      path: "/hosts",
      label: "Hosts",
      icon: <Edit3Icon size={16} className="mr-1" />,
      isActive: location.pathname === "/hosts",
    },
    {
      path: "/nginx",
      label: "Nginx",
      icon: <ServerIcon size={16} className="mr-1" />,
      isActive: location.pathname === "/nginx",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <SettingsIcon size={16} className="mr-1" />,
      isActive: location.pathname === "/settings",
    },
    {
      path: "/about",
      label: "About & Help",
      icon: <InfoIcon size={16} className="mr-1" />,
      isActive: location.pathname === "/about",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors flex flex-col">
      <header className="sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Boojoog DevZone
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              by Ahmad Awdiyanto • Your development control center
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="sticky top-[73px] h-[calc(100vh-73px)] w-56 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    item.isActive
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        <nav className="md:hidden sticky top-[73px] z-10 flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto bg-white dark:bg-gray-900">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-3 px-4 whitespace-nowrap ${
                item.isActive
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.icon}
              <span className="ml-1">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto h-[calc(100vh-73px)]">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
