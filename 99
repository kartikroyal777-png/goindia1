import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.FC<LucideProps>;
  path: string;
  color: string;
  comingSoon: boolean;
}

const colorVariants: { [key: string]: { bg: string; text: string; border: string } } = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-300' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'hover:border-amber-300' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-300' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'hover:border-indigo-300' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'hover:border-rose-300' },
};

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon: Icon, path, color, comingSoon }) => {
  const { bg, text, border } = colorVariants[color] || colorVariants.blue;

  const cardContent = (
    <motion.div
      className={`relative h-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between overflow-hidden transition-all ${border}`}
      whileHover={{ y: -5 }}
    >
      <div>
        <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${text}`} />
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          SOON
        </div>
      )}
    </motion.div>
  );

  return comingSoon ? (
    <div className="cursor-not-allowed opacity-60">{cardContent}</div>
  ) : (
    <Link to={path}>{cardContent}</Link>
  );
};

export default ToolCard;
