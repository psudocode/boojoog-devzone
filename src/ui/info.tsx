import { LucideIcon, X } from "lucide-react";
import { useState } from "react";

type InfoProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  variant?: "default" | "info" | "alert" | "success" | "warning" | "error";
  actions?: React.ReactNode;
  closable?: boolean;
  className?: string;
};

const Info: React.FC<InfoProps> = ({
  icon: Icon,
  title,
  description,
  variant = "default",
  actions,
  closable = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variantStyles = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    alert:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const variantClass = variantStyles[variant] || variantStyles.default;

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex relative flex-col items-center justify-center p-12 rounded-md mb-4 ${variantClass} ${className} transition-colors`}
    >
      {Icon && <Icon size={50} className="flex-shrink-0" />}
      <div className="flex-1 text-center">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-700 dark:text-white max-w-1/2 m-auto">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="justify-center items-center mt-4">{actions}</div>
      )}
      {closable && (
        // make the button absolute positioned to the top right corner
        <button
          onClick={() => handleClose()}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Info;
