import React, { useState } from 'react'
import clsx from 'clsx'

export type InputFieldProps = {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  invalid?: boolean
  variant?: 'filled' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: string
  clearable?: boolean
  showPasswordToggle?: boolean
  id?: string
}

const sizeClasses = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

const variantClasses = {
  filled:
    'bg-gray-100 dark:bg-gray-800 border border-transparent focus:ring-2 focus:ring-blue-400',
  outlined:
    'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400',
  ghost: 'bg-transparent border border-transparent focus:ring-2 focus:ring-blue-400',
}

export const InputField: React.FC<InputFieldProps> = ({
  value = '',
  onChange,
  label,
  placeholder,
  helperText,
  errorMessage,
  disabled,
  invalid,
  variant = 'outlined',
  size = 'md',
  type = 'text',
  clearable = false,
  showPasswordToggle = false,
  id,
}) => {
  const [internalType, setInternalType] = useState(type)
  const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`
  const describedBy = errorMessage ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}

      <div
        className={clsx(
          'flex items-center rounded-md transition-shadow',
          variantClasses[variant],
          invalid ? 'ring-2 ring-red-400' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        )}
      >
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          type={internalType}
          className={clsx(
            "w-full flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm outline-none transition duration-200 ease-in-out",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-400",
            "placeholder-gray-400",
            disabled && "cursor-not-allowed bg-gray-100 text-gray-500 opacity-70",
            invalid && "border-red-500 focus:ring-red-400",
            sizeClasses[size]
          )}
        />


        {/* clear button */}
        {clearable && value && !disabled && (
          <button
            aria-label="Clear input"
            onClick={(e) => {
              e.preventDefault()
              onChange?.({ target: { value: '' } } as any)
            }}
            className="p-2 hover:bg-gray-200 rounded-r-md"
          >
            ✕
          </button>
        )}

        {/* password toggle */}
        {showPasswordToggle && type === 'password' && (
          <button
            aria-label="Toggle password visibility"
            onClick={(e) => {
              e.preventDefault()
              setInternalType((t) => (t === 'password' ? 'text' : 'password'))
            }}
            className="p-2 hover:bg-gray-200 rounded-r-md"
          >
            {internalType === 'password' ? '👁' : '🙈'}
          </button>
        )}
      </div>

      {helperText && !errorMessage && (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {errorMessage && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
