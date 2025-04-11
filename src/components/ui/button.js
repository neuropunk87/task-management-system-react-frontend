import React from "react";
import classNames from "classnames";

export const Button = ({ children, className, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(
        "px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200",
        className
      )}
    >
      {children}
    </button>
  );
};


// import React from 'react';
//
// export const Button = ({ children, onClick, size = "md", variant = "primary", className = "", ...props }) => {
//   const buttonStyles = {
//     primary: 'bg-blue-500 text-white hover:bg-blue-600',
//     secondary: 'bg-gray-500 text-white hover:bg-gray-600',
//     destructive: 'bg-red-500 text-white hover:bg-red-600',
//   };
//
//   const sizeStyles = {
//     sm: 'px-3 py-2 text-sm',
//     md: 'px-4 py-2 text-base',
//     lg: 'px-5 py-3 text-lg',
//   };
//
//   return (
//     <button
//       onClick={onClick}
//       className={`rounded-md focus:outline-none ${buttonStyles[variant]} ${sizeStyles[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };
