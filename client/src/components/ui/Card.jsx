import React from 'react'
import { twMerge } from 'tailwind-merge'

const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  padding = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-300'
  
  const variants = {
    default: 'border border-gray-200 shadow-sm',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-gray-200',
    ghost: 'border-none shadow-none',
  }
  
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  }
  
  const hoverStyles = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
    : ''
  
  return (
    <div
      className={twMerge(
        baseStyles,
        variants[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
