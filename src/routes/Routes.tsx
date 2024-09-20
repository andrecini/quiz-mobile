import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens/HomeScreen";
import { AddThemeScreen } from "../screens/AddThemeScreen";
import { AddQuestionScreen } from "../screens/AddQuestionScreen";
import { PlayQuizScreen } from "../screens/PlayQuizScreen";
import { ResultScreen } from "../screens/ResultScreen";

import { Question } from "../utils/types/Question"; // Tipos que você está usando

export type RootStackParamList = {
  HomeScreen: undefined;
  AddThemeScreen: undefined;
  AddQuestionScreen: undefined;
  PlayQuizScreen: { themeId: number; questionCount: number };
  ResultScreen: { userAnswers: number[]; questions: Question[] };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Quiz Home" }}
        />
        <Stack.Screen
          name="AddThemeScreen"
          component={AddThemeScreen}
          options={{ title: "Add Theme" }}
        />
        <Stack.Screen
          name="AddQuestionScreen"
          component={AddQuestionScreen}
          options={{ title: "Add Question" }}
        />
        <Stack.Screen
          name="PlayQuizScreen"
          component={PlayQuizScreen}
          options={{ title: "Play Quiz" }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{ title: "Quiz Results" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
