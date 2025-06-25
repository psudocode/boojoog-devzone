import React from "react";
import { Github } from "lucide-react";
import { PageWrapper } from "../ui/wrapper";

const AboutPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Table of Contents - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Table of Contents
            </h2>
            <nav className="space-y-2">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("technologies")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Technologies Used
              </button>
              <button
                onClick={() => scrollToSection("getting-started")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Getting Started
              </button>
              <button
                onClick={() => scrollToSection("settings")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Settings
              </button>
              <button
                onClick={() => scrollToSection("docker-setup")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Docker Setup
              </button>
              <button
                onClick={() => scrollToSection("troubleshooting")}
                className="block w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors py-1"
              >
                Troubleshooting
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* About Section */}
          <section
            id="about"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              About Boojoog DevZone
            </h1>

            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-6 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">
                  <strong>Created by Ahmad Awdiyanto</strong>
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  Ahmad@boojoog.com • GitHub: @psudocode
                </p>
              </div>

              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Boojoog DevZone is a modern, comprehensive application for
                managing your system's hosts file and local development
                environment. It provides an intuitive interface to manage hosts
                entries, nginx configurations, and local development sites with
                ease.
              </p>

              <p className="mb-6 text-gray-700 dark:text-gray-300">
                This application was created to streamline the development
                workflow by providing integrated tools for managing DNS entries,
                nginx virtual hosts, and local site configurations. It's
                particularly useful for web developers, system administrators,
                or anyone who needs to manage complex local development
                environments.
              </p>

              <div className="flex items-center mb-6">
                <a
                  href="https://github.com/psudocode/boojoog-devzone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Github size={20} className="mr-2" />
                  View on GitHub
                </a>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Version:</strong> 1.0.0 - Initial release
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Platform:</strong> Cross-platform (Windows, macOS,
                  Linux)
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section
            id="features"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Manage local development sites with integrated hosts and
                    nginx configuration
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Add, edit, and delete host entries with a simple UI
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Create and manage nginx virtual host configurations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Test hostnames directly from the application
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    View and edit raw hosts file
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Filter and search entries
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Dark mode support
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Lightweight and fast Electron-based app
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technologies Section */}
          <section
            id="technologies"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Technologies Used
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Frontend
                </h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Backend
                </h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Electron for desktop app</li>
                  <li>• Node.js runtime</li>
                  <li>• File system APIs</li>
                </ul>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  State Management
                </h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Jotai for state management</li>
                  <li>• React Context</li>
                  <li>• Local storage</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section
            id="getting-started"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Getting Started
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  💻 Managing Hosts Entries
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      Navigate to the <strong>Hosts File</strong> page
                    </li>
                    <li>
                      Click <strong>Add New Entry</strong> to create a new
                      mapping
                    </li>
                    <li>
                      Enter IP address (e.g., 127.0.0.1) and hostname (e.g.,
                      mysite.local)
                    </li>
                    <li>Optionally add a comment for reference</li>
                    <li>
                      Click <strong>Save</strong> - you may be prompted for
                      admin privileges
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  🌐 Creating Local Sites
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      Go to the <strong>Local Sites</strong> page
                    </li>
                    <li>
                      Click <strong>Create New Site</strong>
                    </li>
                    <li>
                      Configure both hosts entry and nginx virtual host in one
                      step
                    </li>
                    <li>Set up port forwarding and SSL if needed</li>
                    <li>Test your new local development site</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  ⚙️ Nginx Configuration
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      Visit the <strong>Nginx Config</strong> page
                    </li>
                    <li>Create virtual host configurations from templates</li>
                    <li>
                      Customize server blocks, locations, and proxy settings
                    </li>
                    <li>Export configurations to your nginx directory</li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  ⚙️ Configure Nginx Path (Settings)
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      Go to the <strong>Settings</strong> page
                    </li>
                    <li>
                      Set the nginx configuration path where your config files
                      will be saved
                    </li>
                    <li>
                      Choose the directory where nginx looks for configuration
                      files
                    </li>
                    <li>
                      Save your settings to enable nginx configuration
                      management
                    </li>
                  </ol>

                  <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>💡 No nginx installed?</strong> If you don't have
                      nginx on your system, check out the{" "}
                      <button
                        onClick={() => scrollToSection("docker-setup")}
                        className="underline hover:text-blue-600 dark:hover:text-blue-300 font-medium"
                      >
                        Docker Setup
                      </button>{" "}
                      section for an alternative containerized approach.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ Administrator Privileges:</strong> Modifying the
                  hosts file requires administrator privileges. You may be
                  prompted for your password when saving changes.
                </p>
              </div>
            </div>
          </section>

          {/* Settings Section */}
          <section
            id="settings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Settings Configuration
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  🔧 Configure Nginx Path
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Before you can create nginx configurations, you need to set
                    up where the app should save them:
                  </p>
                  <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      Navigate to the <strong>Settings</strong> page
                    </li>
                    <li>Look for the "Nginx Configuration Path" setting</li>
                    <li>
                      Set the path to your nginx configuration directory (e.g.,{" "}
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                        /etc/nginx/conf.d
                      </code>
                      )
                    </li>
                    <li>
                      Save your settings to enable nginx configuration
                      management
                    </li>
                  </ol>

                  <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>💡 Don't have nginx installed?</strong> If you
                      don't have nginx on your system, check out the{" "}
                      <button
                        onClick={() => scrollToSection("docker-setup")}
                        className="underline hover:text-blue-600 dark:hover:text-blue-300 font-medium"
                      >
                        Docker Setup
                      </button>{" "}
                      section below for an alternative containerized approach
                      that doesn't require installing nginx directly.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  📁 Common Nginx Paths
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        System Installation
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>
                          • Ubuntu/Debian:{" "}
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            /etc/nginx/conf.d
                          </code>
                        </li>
                        <li>
                          • CentOS/RHEL:{" "}
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            /etc/nginx/conf.d
                          </code>
                        </li>
                        <li>
                          • macOS (Homebrew):{" "}
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            /usr/local/etc/nginx/conf.d
                          </code>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Docker Setup
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>
                          • Docker volume:{" "}
                          <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                            ./nginx/conf.d
                          </code>
                        </li>
                        <li>• Custom path: Any local directory</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Docker Setup Section */}
          <section
            id="docker-setup"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Using Docker for Nginx (Alternative Setup)
            </h2>

            <p className="mb-4 text-gray-700 dark:text-gray-300">
              If you don't have nginx installed on your system, you can use
              Docker to run nginx in a container. This is especially useful for
              users who want to test nginx configurations without installing
              nginx directly on their system.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Prerequisites
                </h3>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Docker installed on your system</li>
                  <li>Docker Compose (usually included with Docker Desktop)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Setup Instructions
                </h3>
                <ol className="list-decimal pl-6 mb-4 space-y-3 text-gray-700 dark:text-gray-300">
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

                <ol
                  className="list-decimal pl-6 mb-4 space-y-3 text-gray-700 dark:text-gray-300"
                  start={3}
                >
                  <li>Create the required directories:</li>
                </ol>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <pre className="text-sm text-gray-700 dark:text-gray-300">
                    {`mkdir -p nginx/conf.d
mkdir -p nginx/logs`}
                  </pre>
                </div>

                <ol
                  className="list-decimal pl-6 mb-4 space-y-3 text-gray-700 dark:text-gray-300"
                  start={4}
                >
                  <li>Start the nginx container:</li>
                </ol>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <pre className="text-sm text-gray-700 dark:text-gray-300">{`docker-compose up -d`}</pre>
                </div>

                <ol
                  className="list-decimal pl-6 mb-6 space-y-3 text-gray-700 dark:text-gray-300"
                  start={5}
                >
                  <li>
                    When you create nginx configurations in this app, place them
                    in the{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      nginx/conf.d
                    </code>{" "}
                    directory
                  </li>
                  <li>
                    The container will automatically reload nginx when you add
                    new configuration files
                  </li>
                  <li>
                    <strong>Configure App Settings:</strong> In the{" "}
                    <strong>Settings</strong> page of this app, set your nginx
                    configuration path to point to the{" "}
                    <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      ./nginx/conf.d
                    </code>{" "}
                    folder you created. This allows the app to directly manage
                    configurations that Docker will use.
                  </li>
                </ol>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                    <strong>💡 Tip:</strong> This Docker setup provides an
                    isolated nginx environment that won't interfere with other
                    system services. You can easily start/stop the container as
                    needed for development work.
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>🔄 Workflow:</strong> Create nginx configs in the
                    app → Files saved to Docker volume → Container automatically
                    picks up changes → Test your local sites immediately!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section
            id="troubleshooting"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
              Troubleshooting
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Permission Errors
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  If you receive permission errors, ensure you have
                  administrator privileges on your system. The app needs
                  elevated permissions to modify the hosts file.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Changes Not Taking Effect
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Some systems may require a restart of the network service or a
                  full system reboot for hosts file changes to take effect. Try
                  flushing your DNS cache with:
                </p>
                <div className="mt-2 bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs font-mono">
                  # Windows: ipconfig /flushdns
                  <br />
                  # macOS: sudo dscacheutil -flushcache
                  <br /># Linux: sudo systemctl flush-dns
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Browser Cache
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Browsers may cache DNS resolutions. Try clearing your browser
                  cache or using an incognito/private browsing window if changes
                  don't appear to be working.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Nginx Issues
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  If nginx configurations aren't working, check the nginx error
                  logs and ensure your configuration syntax is correct. Use{" "}
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">
                    nginx -t
                  </code>{" "}
                  to test configurations.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AboutPage;
