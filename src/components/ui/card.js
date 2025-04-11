import React from "react";
import classNames from "classnames";

export const Card = ({ children, className }) => {
  return (
    <div className={classNames("bg-gray-800 p-6 rounded-2xl shadow-lg", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={classNames("p-4", className)}>{children}</div>;
};
