'use client'

import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { ButtonVariant, ButtonSize } from '@/types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 cursor-pointer ${sizeClasses[size]}`

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
    : ''

  if (variant === 'primary') {
    return (
      <button
        className={`group relative ${base} bg-gradient-to-r from-[#915eff] to-[#ff6b9d] text-white shadow-lg hover:shadow-[#915eff]/50 hover:scale-105 overflow-hidden ${disabledStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b9d] to-[#915eff] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    )
  }

  if (variant === 'secondary') {
    return (
      <button
        className={`${base} border-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:scale-105 hover:shadow-lg hover:shadow-[#00d4ff]/30 bg-[#0a0a0a]/80 backdrop-blur-sm ${disabledStyles} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      className={`${base} border border-white/10 hover:border-[#915eff] bg-white/5 hover:bg-[#915eff]/10 hover:scale-110 hover:shadow-lg hover:shadow-[#915eff]/30 ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
