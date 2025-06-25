import React from "react";
import { Link } from "react-router-dom";
import {
  Edit3Icon,
  SettingsIcon,
  PlusCircleIcon,
  ServerIcon,
} from "lucide-react";
import PageHeader from "../ui/pageHeader";
import { PageWrapper, MainWrapper } from "../ui/wrapper";

const HomePage: React.FC = () => {
  return (
    <PageWrapper>
      <PageHeader
        title="Welcome to DevZone"
        description="A modern, comprehensive tool for managing your system's hosts file and local development environment. Create local sites, edit hosts entries, configure nginx virtual hosts, and streamline your development workflow with ease."
        variant="large"
      />

      <MainWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Link
            to="/local-site"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
          >
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-4">
              <PlusCircleIcon
                size={24}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Local Sites</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your local development sites with integrated hosts and
              nginx configuration.
            </p>
          </Link>

          <Link
            to="/hosts"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
              <Edit3Icon
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Hosts File</h2>
            <p className="text-gray-600 dark:text-gray-400">
              View, edit, and manage your system's hosts file entries with an
              intuitive interface.
            </p>
          </Link>

          <Link
            to="/nginx"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
          >
            <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full mb-4">
              <ServerIcon
                size={24}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nginx Config</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage nginx virtual host configurations for your local
              projects.
            </p>
          </Link>

          <Link
            to="/settings"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full mb-4">
              <SettingsIcon
                size={24}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Configure application preferences and system paths for optimal
              workflow.
            </p>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Get started by clicking on one of the options above.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                🚀 Quick Setup
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create local development sites with automatic hosts file entries
                and nginx configurations in just a few clicks.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                🔧 System Integration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Safely edit your system's hosts file with administrative
                privileges and manage nginx virtual hosts seamlessly.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                ⚡ Developer Friendly
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cross-platform support for Windows, macOS, and Linux with a
                modern, intuitive interface designed for developers.
              </p>
            </div>
          </div>
        </div>
      </MainWrapper>
    </PageWrapper>
  );
};

export default HomePage;
