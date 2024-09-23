import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../screens/HomeScreen";
import { AddThemeScreen } from "../screens/AddThemeScreen";
import { AddQuestionScreen } from "../screens/AddQuestionScreen";
import { PlayQuizScreen } from "../screens/PlayQuizScreen";
import { QuizGameScreen } from "../screens/QuizGameScreen"; 
import { ResultScreen } from "../screens/ResultScreen";
import { Theme } from "../styles/Theme";
import { Feather } from '@expo/vector-icons'; // Use Feather ou outro ícone

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
            backgroundColor: Theme.colors.primary, // Cor de fundo do header ajustada
          },
          headerTintColor: Theme.colors.textButton, // Cor do texto e dos ícones no header
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 20,
          },
          headerBackTitleVisible: false, // Esconde o texto do botão de voltar
          headerTitleAlign: 'center', // Centraliza o título para uma melhor organização visual
          gestureEnabled: true, // Ativa o gesto de voltar (swipe back)
          headerBackImage: () => (
            <Feather
              name="arrow-left"
              size={24} // Tamanho do ícone de voltar
              color={Theme.colors.textButton} // Cor do ícone de voltar
              style={{ marginLeft: 10 }} // Adiciona um espaçamento ao ícone
            />
          ),
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Início" }}
        />
        <Stack.Screen
          name="AddThemeScreen"
          component={AddThemeScreen}
          options={{ title: "Gerenciar Temas" }}
        />
        <Stack.Screen
          name="AddQuestionScreen"
          component={AddQuestionScreen}
          options={{ title: "Gerenciar Questões" }}
        />
        <Stack.Screen
          name="PlayQuizScreen"
          component={PlayQuizScreen}
          options={{ title: "Selecionar Tema" }}
        />
        <Stack.Screen
          name="QuizGameScreen"
          component={QuizGameScreen}
          options={{ title: "Jogar Quiz" }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{ title: "Resultados Finais" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
