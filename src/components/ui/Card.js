'use client';

export default function Card({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'default',
  hover = false,
  onClick = null,
  ...props 
}) {
  // Padding classes
  const paddingClasses = {
    none: '',
    small: 'p-3',
    default: 'p-6',
    large: 'p-8'
  };

  // Hover effect
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-300' : '';
  
  // Interactive card (with onClick)
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300' : '';

  // Combine classes
  const cardClasses = `bg-white dark:bg-gray-800 rounded-xl shadow-card ${paddingClasses[padding] || paddingClasses.default} ${hoverClasses} ${interactiveClasses} ${className}`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      {...props}
    >
      {title && (
        <div className={`${subtitle ? 'mb-2' : 'mb-4'}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {title && subtitle && <div className="mb-4"></div>}
      {children}
    </div>
  );
}