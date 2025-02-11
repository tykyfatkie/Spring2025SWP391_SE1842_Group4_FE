import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded ${
        variant === "ghost" ? "bg-transparent border" : "bg-blue-500 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
