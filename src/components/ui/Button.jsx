import React from 'react';
import { cn } from '@/lib/utils';

const Button = ({ children, variant = 'primary', className, onClick, icon: Icon }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 active:scale-95";
  
  const variants = {
    primary: "btn-accent",
    secondary: "bg-white/[0.06] text-fg/80 hover:bg-white/10 border border-line",
    outline: "border-2 border-line text-fg/80 hover:border-accent hover:text-accent"
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