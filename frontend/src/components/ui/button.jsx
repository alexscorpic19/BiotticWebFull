import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', variant = 'default', size = 'default', asChild = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    'custom-white': 'bg-white text-gray-900 hover:bg-gray-200 font-semibold',
    'hero-outline': 'border border-white text-white bg-transparent hover:bg-white/10 font-semibold',
  };

  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  const Comp = asChild ? Slot : motion.button; // Changed here

  return (
    <Comp
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </Comp>
  );
};

export { Button };
