export const Select = ({ value, onChange, name, children }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-lg dark:bg-zinc-700 dark:border-gray-600 dark:text-white"
    >
      {children}
    </select>
  );
};

export const SelectOption = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};


// import React from 'react';
//
// export const Select = ({ children, name, value, onChange, className = "" }) => {
//   return (
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
//     >
//       {children}
//     </select>
//   );
// };
//
// export const SelectOption = ({ children, value }) => {
//   return <option value={value}>{children}</option>;
// };
