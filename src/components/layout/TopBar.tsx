import React, { useState, useEffect } from "react";
import {
  Menu,
  Type,
  FolderKanban,
  Edit,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import MenuDropdown from "../ui/MenuDropdown";

const TopBar: React.FC = () => {
  const {
    toggleSidebar,
    undo,
    redo,
    copyShape,
    pasteShape,
    selectAllShapes,
    canUndo,
    canRedo,
    clipboard,
    duplicateSelectedShapes,
    deleteSelectedShapes,
    shapes,
    selectedIds,
  } = useDiagramContext();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "c":
            e.preventDefault();
            copyShape();
            break;
          case "v":
            e.preventDefault();
            pasteShape();
            break;
          case "a":
            e.preventDefault();
            console.log("Ctrl+A detected, calling selectAllShapes");
            selectAllShapes();
            break;
          case "d":
            e.preventDefault();
            // Duplicate functionality (copy then paste with offset)
            copyShape();
            setTimeout(() => pasteShape(30, 30), 10);
            break;
          case "x":
            e.preventDefault();
            // Cut functionality (copy then delete)
            copyShape();
            deleteSelectedShapes();
            break;
        }
      }

      // Delete key for deleting selected shapes
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteSelectedShapes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    copyShape,
    pasteShape,
    selectAllShapes,
    deleteSelectedShapes,
  ]);

  const projectMenuItems = [
    {
      label: "New Project",
      onClick: () => {
        // Implement new project functionality
        console.log("New Project - implement this");
      },
      shortcut: "",
    },
    {
      label: "Import",
      onClick: () => {
        // Implement import functionality
        console.log("Import - implement this");
      },
      shortcut: "",
    },
    {
      label: "Export",
      onClick: () => {
        // Implement export functionality
        console.log("Export - implement this");
      },
      shortcut: "",
    },
  ];

  const editMenuItems = [
    {
      label: "Undo",
      onClick: () => undo(),
      shortcut: "Ctrl+Z",
      disabled: !canUndo,
    },
    {
      label: "Redo",
      onClick: () => redo(),
      shortcut: "Ctrl+Y",
      disabled: !canRedo,
    },
    {
      label: "Cut",
      onClick: () => {
        copyShape();
        deleteSelectedShapes();
      },
      shortcut: "Ctrl+X",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Copy",
      onClick: () => copyShape(),
      shortcut: "Ctrl+C",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Paste",
      onClick: () => pasteShape(),
      shortcut: "Ctrl+V",
      disabled: !clipboard,
    },
    {
      label: "Duplicate",
      onClick: () => {
        duplicateSelectedShapes();
      },
      shortcut: "Ctrl+D",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Select All",
      onClick: () => selectAllShapes(),
      shortcut: "Ctrl+A",
      disabled: shapes.length === 0,
    },
    {
      label: "Delete",
      onClick: () => deleteSelectedShapes(),
      shortcut: "Del",
      disabled: selectedIds.length === 0,
    },
  ];

  const helpMenuItems = [
    {
      label: "Report Bug",
      onClick: () => console.log("Report Bug"),
      shortcut: "",
    },
    {
      label: "Contact Support",
      onClick: () => console.log("Contact Support"),
      shortcut: "",
    },
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
              className={`px-3 py-1.5 text-sm font-medium bg-gray-50 hover:bg-gray-100 rounded-md`}
              type="button"
            >
              <div className="flex items-center">
                <Type size={16} className="mr-1.5" />
                Typography
              </div>
            </button>
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                activeMenu === "project" ? "bg-gray-100" : "hover:bg-gray-50"
              } rounded-md`}
              onClick={() => handleMenuClick("project")}
            >
              <div className="flex items-center">
                <FolderKanban size={16} className="mr-1.5" />
                PROJECT
              </div>
            </button>
            {activeMenu === "project" && (
              <MenuDropdown items={projectMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                activeMenu === "edit" ? "bg-gray-100" : "hover:bg-gray-50"
              } rounded-md`}
              onClick={() => handleMenuClick("edit")}
            >
              <div className="flex items-center">
                <Edit size={16} className="mr-1.5" />
                EDIT
              </div>
            </button>
            {activeMenu === "edit" && (
              <MenuDropdown items={editMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                activeMenu === "help" ? "bg-gray-100" : "hover:bg-gray-50"
              } rounded-md`}
              onClick={() => handleMenuClick("help")}
            >
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-1.5" />
                HELP
              </div>
            </button>
            {activeMenu === "help" && (
              <MenuDropdown items={helpMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                activeMenu === "guidance" ? "bg-gray-100" : "hover:bg-gray-50"
              } rounded-md`}
              onClick={() => handleMenuClick("guidance")}
            >
              <div className="flex items-center">
                <Lightbulb size={16} className="mr-1.5" />
                GUIDANCE
              </div>
            </button>
            {activeMenu === "guidance" && (
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
