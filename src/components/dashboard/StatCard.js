'use client';

export default function StatCard({ title, value, subtitle, icon, color = 'primary', className = '' }) {
  // Color classes based on the color prop
  const colorClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-700 text-white',
    success: 'bg-gradient-to-br from-green-500 to-green-700 text-white',
    warning: 'bg-gradient-to-br from-orange-500 to-orange-700 text-white',
    danger: 'bg-gradient-to-br from-red-500 to-red-700 text-white',
    info: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-700 text-white',
    // Add more color options as needed
  };

  const cardColorClass = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`card ${cardColorClass} ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-sm mt-2 opacity-80">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-white bg-opacity-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}