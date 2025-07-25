import React from 'react';
import { Building2, FileText, Mail, TrendingUp } from 'lucide-react';

interface StatsProps {
  propertiesCount: number;
  templatesCount: number;
  emailsGenerated: number;
}

export const Stats: React.FC<StatsProps> = ({ propertiesCount, templatesCount, emailsGenerated }) => {
  const stats = [
    {
      name: 'Nemovitosti',
      value: propertiesCount,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Šablony',
      value: templatesCount,
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Vygenerované e-maily',
      value: emailsGenerated,
      icon: Mail,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      name: 'Úspěšnost',
      value: '99.8%',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};