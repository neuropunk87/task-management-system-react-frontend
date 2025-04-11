export const Label = ({ children, htmlFor }) => {
  return <label
    htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{children}
  </label>;
};


// import React from 'react';
//
// export const Label = ({ children, htmlFor, className = "" }) => {
//   return (
//     <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-white ${className}`}>
//       {children}
//     </label>
//   );
// };
