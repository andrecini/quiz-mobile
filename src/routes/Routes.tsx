import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { AddThemeScreen } from "../screens/AddThemeScreen";
import { AddQuestionScreen } from "../screens/AddQuestionScreen";
import { PlayQuizScreen } from "../screens/PlayQuizScreen";
import { QuizGameScreen } from "../screens/QuizGameScreen"; 
import { ResultScreen } from "../screens/ResultScreen";

import { Theme } from "../styles/Theme";

export type RootStackParamList = {
  HomeScreen: undefined;
  AddThemeScreen: undefined;
  AddQuestionScreen: undefined;
  PlayQuizScreen: { themeId: number; questionCount: number };
  QuizGameScreen: { themeId: number; questionCount: number }; 
  ResultScreen: { score: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: Theme.colors.card, // Cor de fundo do header
          },
          headerTintColor: '#fff', // Cor do texto do header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="AddThemeScreen"
          component={AddThemeScreen}
          options={{ title: "Temas" }}
        />
        <Stack.Screen
          name="AddQuestionScreen"
          component={AddQuestionScreen}
          options={{ title: "Questões" }}
        />
        <Stack.Screen
          name="PlayQuizScreen"
          component={PlayQuizScreen}
          options={{ title: "Seleção de Tema" }}
        />
        <Stack.Screen
          name="QuizGameScreen"
          component={QuizGameScreen}
          options={{ title: "Quiz" }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{ title: "Resultados" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
