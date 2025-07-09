import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'yellow';
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, change, changeType, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          <div className="text-white">{icon}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {getChangeIcon()}
        <span className={`ml-2 text-sm font-medium ${
          changeType === 'increase' ? 'text-green-600' : 
          changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {Math.abs(change)}% from last week
        </span>
      </div>
    </div>
  );
};

export default StatusCard;