"use client";
export default function LoadingSpinner({ size = "medium", color = "green" }) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const colorClasses = {
    green: "border-green-600 border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-600 border-t-transparent",
    blue: "border-blue-600 border-t-transparent"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}></div>
    </div>
  );
}