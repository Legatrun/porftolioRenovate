import React from 'react';
import { cn } from '@/lib/utils';

const Button = ({ children, variant = 'primary', className, onClick, icon: Icon }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600"
  };

  return (
    <button 
      onClick={onClick} 
      className={cn(baseStyles, variants[variant], className)}
    >
      {children}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

export default Button;