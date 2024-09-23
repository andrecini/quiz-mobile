import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Select,
  Button,
  Text,
  Input,
  View,
} from "native-base";
import Feather from "react-native-vector-icons/Feather"; // Mudança para Feather Icons
import { getAllRows } from "../database/Database";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../routes/Routes";
import { Theme as AppTheme } from "../styles/Theme";

type PlayQuizScreenProp = StackNavigationProp<
  RootStackParamList,
  "PlayQuizScreen"
>;

export const PlayQuizScreen: React.FC = () => {
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(undefined);
  const [questionsAvailable, setQuestionsAvailable] = useState<number>(0);
  const [numQuestions, setNumQuestions] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation = useNavigation<PlayQuizScreenProp>();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getAllRows("SELECT * FROM themes");
        setThemes(result as { id: number; name: string }[]);
      } catch (error) {
        console.error("Erro ao buscar temas", error);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeChange = async (themeId: string) => {
    setSelectedTheme(parseInt(themeId));
    try {
      const result = await getAllRows(
        "SELECT COUNT(*) as count FROM questions WHERE themeId = ?",
        [themeId]
      );
      const countResult = result as { count: number }[];
      setQuestionsAvailable(countResult[0].count);
    } catch (error) {
      console.error("Erro ao buscar quantidade de perguntas", error);
    }
  };

  const handleStartQuiz = () => {
    if (!selectedTheme || numQuestions.trim() === "") {
      setErrorMessage("Selecione um tema e uma quantidade válida de perguntas.");
      return;
    }
    const numQuestionsInt = parseInt(numQuestions);
    if (numQuestionsInt <= 0) {
      setErrorMessage(`Número de perguntas deve ser maior que 0. Tente entre 1 e ${questionsAvailable}.`);
      return;
    }
    if (numQuestionsInt > questionsAvailable) {
      setErrorMessage(`Só existem ${questionsAvailable} perguntas disponíveis.`);
      return;
    }
    setErrorMessage("");

    navigation.navigate("QuizGameScreen", {
      themeId: selectedTheme,
      questionCount: numQuestionsInt,
    });
  };

  return (
    <View flex={1} bg={AppTheme.colors.backgroundLight} p={5} alignItems="center" justifyContent="center">
        <VStack space={5} alignSelf="center">
          <Text
            fontSize={AppTheme.fontSizes.lg}
            color={AppTheme.colors.heading}
            fontWeight="bold"
            textAlign="center"
          >
            Selecione o Tema e a Quantidade de Perguntas
          </Text>

          <Select
            selectedValue={selectedTheme ? selectedTheme.toString() : ""}
            minWidth="220"
            placeholder="Selecione um tema"
            onValueChange={handleThemeChange}
            _selectedItem={{
              bg: AppTheme.colors.primaryLight,
              endIcon: <Feather name="check-circle" size={18} color={AppTheme.colors.textButton} />
            }}
            color={AppTheme.colors.textPrimary}
            bg={AppTheme.colors.card}
            borderRadius="full"
            borderWidth={1}
            borderColor={AppTheme.colors.primary}
          >
            {themes.map((theme) => (
              <Select.Item
                key={theme.id}
                label={theme.name}
                value={theme.id.toString()}
              />
            ))}
          </Select>


          <Input
            placeholder="Quantidade de perguntas"
            value={numQuestions}
            onChangeText={setNumQuestions}
            keyboardType="numeric"
            color={AppTheme.colors.textPrimary}
            bg={AppTheme.colors.background}
            borderRadius="full"
            borderWidth={1}
            borderColor={AppTheme.colors.primary}
            p={3}
            placeholderTextColor={AppTheme.colors.textSecondary}
          />

          <Button
            onPress={handleStartQuiz}
            bg={AppTheme.colors.primary}
            borderRadius="full"
            _pressed={{ bg: AppTheme.colors.primaryLight }}
            p={3}
          >
            <Text color={AppTheme.colors.textButton} fontWeight="bold" fontSize="md">
              Começar
            </Text>
          </Button>
        </VStack>
    </View>
  );
};
