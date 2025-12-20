import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const hasError = Boolean(error)
  
  const baseInputStyles = 'w-full px-4 py-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 placeholder:text-gray-400'
  
  const inputStyles = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-gray-400'
  
  const iconPadding = icon ? 'pl-11' : ''
  const rightIconPadding = rightIcon ? 'pr-11' : ''
  
  return (
    <div className={twMerge('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={twMerge(
            baseInputStyles,
            inputStyles,
            iconPadding,
            rightIconPadding,
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={twMerge(
          'mt-1.5 text-sm',
          hasError ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
