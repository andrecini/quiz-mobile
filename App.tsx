import React, { useEffect } from 'react';
import { NativeBaseProvider, StatusBar } from 'native-base';
import { createTables } from './src/database/Database'; 
import Routes from './src/routes/Routes';
import { Theme } from './src/styles/Theme';

const App: React.FC = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTables(); 
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing the database:', error);
      }
    };

    initializeDatabase();
  }, []); 

  return (
    <NativeBaseProvider theme={Theme}>  
      <StatusBar backgroundColor={Theme.colors.primary} barStyle="light-content" />
      <Routes />
    </NativeBaseProvider>
  );
};

export default App;
