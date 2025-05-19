import React, { useState } from 'react';
import { Menu, Type, FolderKanban, Edit, HelpCircle, Lightbulb } from 'lucide-react';
import { useDiagramContext } from '../../store/DiagramContext';
import MenuDropdown from '../ui/MenuDropdown';

const TopBar: React.FC = () => {
  const { toggleSidebar } = useDiagramContext();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const projectMenuItems = [
    { label: 'New Project', onClick: () => console.log('New Project'), shortcut: '' },
    { label: 'Import', onClick: () => console.log('Import'), shortcut: '' },
    { label: 'Export', onClick: () => console.log('Export'), shortcut: '' }
  ];

  const editMenuItems = [
    { label: 'Undo', onClick: () => console.log('Undo'), shortcut: 'Ctrl+Z' },
    { label: 'Redo', onClick: () => console.log('Redo'), shortcut: 'Ctrl+Y' },
    { label: 'Cut', onClick: () => console.log('Cut'), shortcut: 'Ctrl+X' },
    { label: 'Copy', onClick: () => console.log('Copy'), shortcut: 'Ctrl+C' },
    { label: 'Paste', onClick: () => console.log('Paste'), shortcut: 'Ctrl+V' },
    { label: 'Duplicate', onClick: () => console.log('Duplicate'), shortcut: 'Ctrl+D' },
    { label: 'Select All', onClick: () => console.log('Select All'), shortcut: 'Ctrl+A' }
  ];

  const helpMenuItems = [
    { label: 'Report Bug', onClick: () => console.log('Report Bug'), shortcut: '' },
    { label: 'Contact Support', onClick: () => console.log('Contact Support'), shortcut: '' }
  ];

  const handleMenuClick = (menuId: string) => {
    if (activeMenu === menuId) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuId);
    }
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3">
      <div className="flex items-center">
        <button 
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex ml-2">
          <div className="relative">
            <button 
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'typography' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('typography')}
            >
              <div className="flex items-center">
                <Type size={16} className="mr-1.5" />
                Typography
              </div>
            </button>
            {activeMenu === 'typography' && (
              <MenuDropdown items={[]} onClose={closeMenu} />
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'project' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('project')}
            >
              <div className="flex items-center">
                <FolderKanban size={16} className="mr-1.5" />
                PROJECT
              </div>
            </button>
            {activeMenu === 'project' && (
              <MenuDropdown items={projectMenuItems} onClose={closeMenu} />
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'edit' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('edit')}
            >
              <div className="flex items-center">
                <Edit size={16} className="mr-1.5" />
                EDIT
              </div>
            </button>
            {activeMenu === 'edit' && (
              <MenuDropdown items={editMenuItems} onClose={closeMenu} />
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'help' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('help')}
            >
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-1.5" />
                HELP
              </div>
            </button>
            {activeMenu === 'help' && (
              <MenuDropdown items={helpMenuItems} onClose={closeMenu} />
            )}
          </div>
          
          <div className="relative">
            <button 
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'guidance' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('guidance')}
            >
              <div className="flex items-center">
                <Lightbulb size={16} className="mr-1.5" />
                GUIDANCE
              </div>
            </button>
            {activeMenu === 'guidance' && (
              <MenuDropdown items={[]} onClose={closeMenu} />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full">
          G
        </div>
      </div>
    </div>
  );
};

export default TopBar;