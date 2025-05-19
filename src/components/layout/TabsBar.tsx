import React from 'react';
import { Shapes, Cpu } from 'lucide-react';

interface TabsBarProps {
  activeTab: 'shapes' | 'ai';
  setActiveTab: (tab: 'shapes' | 'ai') => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex items-center justify-center py-3 flex-1 text-sm font-medium ${
          activeTab === 'shapes'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('shapes')}
      >
        <Shapes size={16} className="mr-2" />
        Shapes
      </button>
      <button
        className={`flex items-center justify-center py-3 flex-1 text-sm font-medium ${
          activeTab === 'ai'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setActiveTab('ai')}
      >
        <Cpu size={16} className="mr-2" />
        AI
      </button>
    </div>
  );
};

export default TabsBar;