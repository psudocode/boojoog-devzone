import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Github } from "lucide-react";

const AboutPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of Contents - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Table of Contents
            </h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('technologies')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Technologies Used
              </button>
              <button
                onClick={() => scrollToSection('getting-started')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Getting Started
              </button>
              <button
                onClick={() => scrollToSection('docker-setup')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Docker Setup
              </button>
              <button
                onClick={() => scrollToSection('troubleshooting')}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Troubleshooting
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
          About Boojoog Hosts Manager
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4">
            Boojoog Hosts Manager is a modern, comprehensive application for
            managing your system's hosts file and local development environment.
            It provides an intuitive interface to manage hosts entries, nginx
            configurations, and local development sites with ease.
          </p>

          <p className="mb-6">
            This application was created to streamline the development workflow
            by providing integrated tools for managing DNS entries, nginx
            virtual hosts, and local site configurations. It's particularly
            useful for web developers, system administrators, or anyone who
            needs to manage complex local development environments.
          </p>

          <div className="flex items-center mb-6">
            <a
              href="https://github.com/yourusername/devzone"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <Github size={20} className="mr-2" />
              View on GitHub
            </a>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Features
          </h2>

          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              Manage local development sites with integrated hosts and nginx
              configuration
            </li>
            <li>Add, edit, and delete host entries with a simple UI</li>
            <li>Create and manage nginx virtual host configurations</li>
            <li>Test hostnames directly from the application</li>
            <li>View and edit raw hosts file</li>
            <li>Filter and search entries</li>
            <li>Dark mode support</li>
            <li>Cross-platform support (Windows, macOS, Linux)</li>
            <li>Lightweight and fast Electron-based app</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Technologies Used
          </h2>

          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>React with TypeScript</li>
            <li>Electron for cross-platform desktop app</li>
            <li>Tailwind CSS for styling</li>
            <li>Jotai for state management</li>
            <li>Lucide React for icons</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Version
          </h2>

          <p className="mb-6">1.0.0 - Initial release</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
          How to Use
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Adding a New Entry
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>
              Click the <strong>Add New Entry</strong> button in the top right
              corner.
            </li>
            <li>Enter the IP address (e.g., 127.0.0.1).</li>
            <li>Enter the hostname (e.g., example.local).</li>
            <li>
              Optionally add a comment to remember what this entry is for.
            </li>
            <li>
              Click <strong>Add Entry</strong> to save.
            </li>
          </ol>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Note:</strong> Modifying the hosts file requires
              administrator privileges. You may be prompted for your password
              when saving changes.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Editing an Entry
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>Find the entry you want to edit in the table.</li>
            <li>
              Click the <strong>Edit</strong> button on the right side of the
              entry.
            </li>
            <li>Modify the IP address, hostname, or comment as needed.</li>
            <li>
              Click <strong>Save Changes</strong> to update the entry.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Deleting an Entry
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>Find the entry you want to delete in the table.</li>
            <li>
              Click the <strong>Delete</strong> button on the right side of the
              entry.
            </li>
            <li>Confirm the deletion when prompted.</li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Testing a Hostname
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>Find the hostname you want to test in the table.</li>
            <li>
              Click the <strong>Open</strong> link in the "Test Link" column.
            </li>
            <li>This will open the hostname in your default web browser.</li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Viewing the Raw Hosts File
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>
              Click the <strong>View Raw File</strong> button in the top right
              corner.
            </li>
            <li>
              This will show you the actual content of your system's hosts file.
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Switching Between Light and Dark Mode
          </h2>

          <ol className="list-decimal pl-6 mb-6 space-y-3">
            <li>Click the theme toggle button in the top right corner.</li>
            <li>The app will switch between light and dark mode.</li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Using Docker for Nginx (Alternative Setup)
          </h2>

          <p className="mb-4">
            If you don't have nginx installed on your system, you can use Docker
            to run nginx in a container. This is especially useful for users who
            want to test nginx configurations without installing nginx directly
            on their system.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Prerequisites
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Docker installed on your system</li>
            <li>Docker Compose (usually included with Docker Desktop)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Setup Instructions
          </h3>
          <ol className="list-decimal pl-6 mb-4 space-y-3">
            <li>Create a new directory for your nginx proxy setup</li>
            <li>
              Create a{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                docker-compose.yml
              </code>{" "}
              file with the following content:
            </li>
          </ol>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-sm">
              {`services:
  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/logs:/var/log/nginx
    networks:
      - proxy-network
    restart: unless-stopped

networks:
  proxy-network:
    driver: bridge`}
            </pre>
          </div>

          <ol className="list-decimal pl-6 mb-4 space-y-3" start={3}>
            <li>Create the required directories:</li>
          </ol>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <pre className="text-sm">
              {`mkdir -p nginx/conf.d
mkdir -p nginx/logs`}
            </pre>
          </div>

          <ol className="list-decimal pl-6 mb-4 space-y-3" start={4}>
            <li>Start the nginx container:</li>
          </ol>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <pre className="text-sm">{`docker-compose up -d`}</pre>
          </div>

          <ol className="list-decimal pl-6 mb-6 space-y-3" start={5}>
            <li>
              When you create nginx configurations in this app, place them in
              the{" "}
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                nginx/conf.d
              </code>{" "}
              directory
            </li>
            <li>
              The container will automatically reload nginx when you add new
              configuration files
            </li>
          </ol>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> This Docker setup provides an isolated
              nginx environment that won't interfere with other system services.
              You can easily start/stop the container as needed for development
              work.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200">
            Troubleshooting
          </h2>

          <ul className="list-disc pl-6 mb-6 space-y-3">
            <li>
              <strong>Permission Errors:</strong> If you receive permission
              errors, ensure you have administrator privileges on your system.
            </li>
            <li>
              <strong>Changes Not Taking Effect:</strong> Some systems may
              require a restart of the network service or a full system reboot
              for hosts file changes to take effect.
            </li>
            <li>
              <strong>Browser Cache:</strong> Browsers may cache DNS
              resolutions. Try clearing your browser cache if changes don't
              appear to be working.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
