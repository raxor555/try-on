import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white',
        outline: 'border border-slate-700 hover:bg-slate-800 text-slate-200',
        ghost: 'hover:bg-slate-800 text-slate-200',
        danger: 'bg-error hover:bg-red-600 text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

export const Card = ({ className, children, ...props }) => (
    <div className={cn('glass-card p-6 rounded-lg', className)} {...props}>
        {children}
    </div>
);

export const Input = React.forwardRef(({ className, error, ...props }, ref) => (
    <div className="space-y-1 w-full">
        <input
            ref={ref}
            className={cn(
                'input-field',
                error && 'border-error focus:ring-error/50',
                className
            )}
            {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
    </div>
));
