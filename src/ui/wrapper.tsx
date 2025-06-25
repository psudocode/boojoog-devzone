import React from "react";

const PageWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-900 dark:text-white">{children}</div>
  );
};

const MainWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <main className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {children}
    </main>
  );
};

export { PageWrapper, MainWrapper };
