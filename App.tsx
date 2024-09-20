import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { AddThemeScreen } from './src/screens/AddThemeScreen';
import { AddQuestionScreen } from './src/screens/AddQuestionScreen';
import { PlayQuizScreen } from './src/screens/PlayQuizScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { createTables } from './src/database/Database'; // Função de inicialização do banco
import { Question } from './src/utils/types/Question'; // Tipos que você está usando

// Definindo as rotas e parâmetros de navegação
export type RootStackParamList = {
  HomeScreen: undefined;
  AddThemeScreen: undefined;
  AddQuestionScreen: undefined;
  PlayQuizScreen: { themeId: number; questionCount: number };
  ResultScreen: { userAnswers: number[]; questions: Question[] };
};

// Criando o Stack Navigator
const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  // Função para inicializar as tabelas do banco de dados
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await createTables(); // Inicializando as tabelas
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing the database:', error);
      }
    };

    initializeDatabase();
  }, []); // O array vazio garante que o useEffect execute apenas uma vez

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Quiz Home' }} />
        <Stack.Screen name="AddThemeScreen" component={AddThemeScreen} options={{ title: 'Add Theme' }} />
        <Stack.Screen name="AddQuestionScreen" component={AddQuestionScreen} options={{ title: 'Add Question' }} />
        <Stack.Screen name="PlayQuizScreen" component={PlayQuizScreen} options={{ title: 'Play Quiz' }} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Quiz Results' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
