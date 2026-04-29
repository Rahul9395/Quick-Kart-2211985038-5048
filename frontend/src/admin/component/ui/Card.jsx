import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl shadow-md border border-gray-200 bg-white p-4 ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => {
  return <div className={`mb-3 font-semibold text-lg ${className}`}>{children}</div>;
};

export const CardContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return <div className={`mt-3 border-t pt-2 ${className}`}>{children}</div>;
};
