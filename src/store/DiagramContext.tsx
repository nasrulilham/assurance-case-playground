import React, { createContext, useContext, useReducer, useState } from 'react';
import { ShapeOnCanvas, Connection } from '../types/shapes';

interface DiagramState {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
  selectedId: string | null;
  selectedConnectionId: string | null;
  history: { shapes: ShapeOnCanvas[], connections: Connection[] }[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  stageSize: { width: number; height: number };
  isSidebarCollapsed: boolean;
  isConnecting: boolean;
  connectingFromId: string | null;
}

interface DiagramContextType extends DiagramState {
  addShape: (shape: ShapeOnCanvas) => void;
  updateShapePosition: (id: string, newAttrs: Partial<ShapeOnCanvas>) => void;
  setSelectedId: (id: string | null) => void;
  updateSelectedShape: (attrs: Partial<ShapeOnCanvas>) => void;
  selectedShape: ShapeOnCanvas | null;
  undo: () => void;
  redo: () => void;
  setZoomLevel: (level: number) => void;
  setStageSize: (size: { width: number; height: number }) => void;
  toggleSidebar: () => void;
  startConnection: (fromId: string) => void;
  completeConnection: (toId: string) => void;
  cancelConnection: () => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, points: number[]) => void;
  deleteConnection: (id: string) => void;
}

const initialState: DiagramState = {
  shapes: [],
  connections: [],
  selectedId: null,
  selectedConnectionId: null,
  history: [{ shapes: [], connections: [] }],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,
  zoomLevel: 1,
  stageSize: { width: 0, height: 0 },
  isSidebarCollapsed: false,
  isConnecting: false,
  connectingFromId: null,
};

type DiagramAction =
  | { type: 'ADD_SHAPE'; payload: ShapeOnCanvas }
  | { type: 'UPDATE_SHAPE'; payload: { id: string; attrs: Partial<ShapeOnCanvas> } }
  | { type: 'SET_SELECTED'; payload: string | null }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_STAGE_SIZE'; payload: { width: number; height: number } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'START_CONNECTION'; payload: string }
  | { type: 'COMPLETE_CONNECTION' }
  | { type: 'CANCEL_CONNECTION' }
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: string; points: number[] } }
  | { type: 'DELETE_CONNECTION'; payload: string };

const diagramReducer = (state: DiagramState, action: DiagramAction): DiagramState => {
  switch (action.type) {
    case 'ADD_SHAPE': {
      const newShapes = [...state.shapes, action.payload];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: state.connections });
      
      return {
        ...state,
        shapes: newShapes,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    
    case 'UPDATE_SHAPE': {
      const { id, attrs } = action.payload;
      const newShapes = state.shapes.map(shape => 
        shape.id === id ? { ...shape, ...attrs } : shape
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: state.connections });
      
      return {
        ...state,
        shapes: newShapes,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    
    case 'SET_SELECTED': {
      return {
        ...state,
        selectedId: action.payload,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    
    case 'START_CONNECTION': {
      return {
        ...state,
        isConnecting: true,
        connectingFromId: action.payload,
      };
    }
    
    case 'COMPLETE_CONNECTION': {
      return {
        ...state,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    
    case 'CANCEL_CONNECTION': {
      return {
        ...state,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    
    case 'ADD_CONNECTION': {
      const newConnections = [...state.connections, action.payload];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      
      return {
        ...state,
        connections: newConnections,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    
    case 'UPDATE_CONNECTION': {
      const { id, points } = action.payload;
      const newConnections = state.connections.map(conn =>
        conn.id === id ? { ...conn, points } : conn
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      
      return {
        ...state,
        connections: newConnections,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    
    case 'DELETE_CONNECTION': {
      const newConnections = state.connections.filter(conn => conn.id !== action.payload);
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      
      return {
        ...state,
        connections: newConnections,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    
    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      
      const newIndex = state.historyIndex - 1;
      const { shapes, connections } = state.history[newIndex];
      return {
        ...state,
        shapes,
        connections,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      };
    }
    
    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      
      const newIndex = state.historyIndex + 1;
      const { shapes, connections } = state.history[newIndex];
      return {
        ...state,
        shapes,
        connections,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
      };
    }
    
    case 'SET_ZOOM': {
      return {
        ...state,
        zoomLevel: action.payload,
      };
    }
    
    case 'SET_STAGE_SIZE': {
      return {
        ...state,
        stageSize: action.payload,
      };
    }
    
    case 'TOGGLE_SIDEBAR': {
      return {
        ...state,
        isSidebarCollapsed: !state.isSidebarCollapsed,
      };
    }
    
    default:
      return state;
  }
};

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(diagramReducer, initialState);
  
  const addShape = (shape: ShapeOnCanvas) => {
    dispatch({ type: 'ADD_SHAPE', payload: shape });
  };
  
  const updateShapePosition = (id: string, newAttrs: Partial<ShapeOnCanvas>) => {
    dispatch({ type: 'UPDATE_SHAPE', payload: { id, attrs: newAttrs } });
  };
  
  const setSelectedId = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED', payload: id });
  };
  
  const updateSelectedShape = (attrs: Partial<ShapeOnCanvas>) => {
    if (state.selectedId) {
      updateShapePosition(state.selectedId, attrs);
    }
  };
  
  const selectedShape = state.shapes.find(shape => shape.id === state.selectedId) || null;
  
  const startConnection = (fromId: string) => {
    dispatch({ type: 'START_CONNECTION', payload: fromId });
  };
  
  const completeConnection = (toId: string) => {
    if (state.connectingFromId && state.connectingFromId !== toId) {
      const connection: Connection = {
        id: `conn-${Date.now()}`,
        from: state.connectingFromId,
        to: toId,
        points: [],
      };
      dispatch({ type: 'ADD_CONNECTION', payload: connection });
    }
    dispatch({ type: 'COMPLETE_CONNECTION' });
  };
  
  const cancelConnection = () => {
    dispatch({ type: 'CANCEL_CONNECTION' });
  };
  
  const addConnection = (connection: Connection) => {
    dispatch({ type: 'ADD_CONNECTION', payload: connection });
  };
  
  const updateConnection = (id: string, points: number[]) => {
    dispatch({ type: 'UPDATE_CONNECTION', payload: { id, points } });
  };
  
  const deleteConnection = (id: string) => {
    dispatch({ type: 'DELETE_CONNECTION', payload: id });
  };
  
  const undo = () => {
    if (state.canUndo) {
      dispatch({ type: 'UNDO' });
    }
  };
  
  const redo = () => {
    if (state.canRedo) {
      dispatch({ type: 'REDO' });
    }
  };
  
  const setZoomLevel = (level: number) => {
    dispatch({ type: 'SET_ZOOM', payload: level });
  };
  
  const setStageSize = (size: { width: number; height: number }) => {
    dispatch({ type: 'SET_STAGE_SIZE', payload: size });
  };
  
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };
  
  const contextValue: DiagramContextType = {
    ...state,
    addShape,
    updateShapePosition,
    setSelectedId,
    updateSelectedShape,
    selectedShape,
    startConnection,
    completeConnection,
    cancelConnection,
    addConnection,
    updateConnection,
    deleteConnection,
    undo,
    redo,
    setZoomLevel,
    setStageSize,
    toggleSidebar,
  };
  
  return (
    <DiagramContext.Provider value={contextValue}>
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagramContext = () => {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagramContext must be used within a DiagramProvider');
  }
  return context;
};