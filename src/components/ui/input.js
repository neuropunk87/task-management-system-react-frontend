export const Input = ({ value, onChange, name, type = "text", placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white"
      placeholder={placeholder}
    />
  );
};


// import React from 'react';
//
// export const Input = ({ value, onChange, name, placeholder, className = "", ...props }) => {
//   return (
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
//       {...props}
//     />
//   );
// };
