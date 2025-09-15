import React, { createContext, useContext, useState, useCallback } from 'react';

interface DataContextType {
  refreshTrigger: number;
  triggerRefresh: (entity?: string) => void;
  lastUpdated: { [key: string]: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<{ [key: string]: number }>({});

  const triggerRefresh = useCallback((entity?: string) => {
    const now = Date.now();
    if (entity) {
      setLastUpdated(prev => ({ ...prev, [entity]: now }));
    }
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <DataContext.Provider value={{ refreshTrigger, triggerRefresh, lastUpdated }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};