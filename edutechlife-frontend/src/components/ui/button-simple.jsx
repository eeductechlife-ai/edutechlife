import React from "react";
import { cn } from "../../lib/utils-simple";

export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false, 
  children,
  ...props 
}, ref) => {
  
  const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 ring-primary/20",
    destructive: "bg-red-600 text-white hover:bg-red-700 ring-red-600/20",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground ring-gray-400/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 ring-secondary/20",
    ghost: "hover:bg-accent hover:text-accent-foreground ring-gray-400/20",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  
  const buttonClassName = cn(
    baseStyles, 
    variants[variant], 
    sizes[size], 
    "focus-visible:ring-2 focus-visible:ring-offset-2",
    className
  );
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(children.props.className, buttonClassName),
      ref,
      ...props,
    });
  }
  
  return (
    <button
      className={buttonClassName}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";