import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  variant?: "default" | "large";
  showBackButton?: boolean;
  backButtonTo?: string;
  backButtonText?: string;
  icon?: LucideIcon;
  className?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  variant = "default",
  showBackButton = false,
  backButtonTo = "/",
  backButtonText = "Back to Home",
  icon: Icon,
  className = "",
  actions,
}) => {
  // Get appropriate styles based on variant
  const getHeaderStyles = () => {
    switch (variant) {
      case "large":
        return {
          container: "text-center mb-10",
          title: "text-4xl font-bold mb-4 text-blue-600 dark:text-blue-400",
          description:
            "text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto",
        };
      default:
        return {
          container: "flex items-center justify-between mb-6",
          title: "text-2xl font-bold text-gray-900 dark:text-white",
          description: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  const styles = getHeaderStyles();

  const renderBackButton = () => {
    if (!showBackButton) return null;

    return (
      <div className="flex items-center mb-6">
        <Link
          to={backButtonTo}
          className="flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          {backButtonText}
        </Link>
      </div>
    );
  };

  const renderTitle = () => (
    <div className={variant === "default" ? "flex items-start" : ""}>
      {Icon && (
        <Icon
          size={variant === "large" ? 32 : 24}
          className={`${
            variant === "large" ? "mb-4" : "mr-3"
          } text-blue-600 dark:text-blue-400`}
        />
      )}
      <div>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );

  return (
    <div className={className}>
      {renderBackButton()}

      {variant === "default" ? (
        <div className={styles.container}>
          {renderTitle()}
          {actions && (
            <div className="flex items-center space-x-3">{actions}</div>
          )}
        </div>
      ) : (
        <div className={styles.container}>
          {renderTitle()}
          {actions && (
            <div
              className={`${variant === "large" ? "text-center mt-4" : "mt-4"}`}
            >
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
