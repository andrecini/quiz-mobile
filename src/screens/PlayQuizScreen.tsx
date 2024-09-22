import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Select,
  Button,
  Text,
  Input,
  Icon,
  View,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
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
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(
    undefined
  );
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
      setErrorMessage(
        "Por favor, selecione um tema e uma quantidade de perguntas."
      );
      return;
    }
    const numQuestionsInt = parseInt(numQuestions);
    if (numQuestionsInt <= 0) {
      setErrorMessage(
        `Número de perguntas deve ser maior ou igual a 0. Selecione um valor entre 1 e ${questionsAvailable}.`
      );
      return;
    }
    if (numQuestionsInt > questionsAvailable) {
      setErrorMessage(
        `Número de perguntas excede o disponível. Existem apenas ${questionsAvailable} perguntas.`
      );
      return;
    }
    setErrorMessage("");

    navigation.navigate("QuizGameScreen", {
      themeId: selectedTheme,
      questionCount: numQuestionsInt,
    });
  };

  return (
    <View flex={1} bg={AppTheme.colors.background} p={4}>
      <Box p={4} borderRadius="lg" shadow={2} bg={AppTheme.colors.card}>
        <VStack space={4}>
          <Text
            fontSize={AppTheme.fontSizes.lg}
            color={AppTheme.colors.textPrimary}
            bold
          >
            Selecione um tema e quantidade de perguntas
          </Text>

          <Select
            selectedValue={selectedTheme ? selectedTheme.toString() : ""}
            minWidth="200"
            placeholder="Escolha um tema"
            onValueChange={handleThemeChange}
            _selectedItem={{
              bg: AppTheme.colors.primary,
              _text: { color: AppTheme.colors.textPrimary },
              endIcon: (
                <Icon
                  as={Ionicons}
                  name="checkmark-sharp"
                  size="lg"
                  color={AppTheme.colors.textPrimary}
                />
              ),
            }}
            color={AppTheme.colors.textPrimary}
          >
            {themes.map((theme) => (
              <Select.Item
                key={theme.id}
                label={theme.name}
                value={theme.id.toString()}
              />
            ))}
          </Select>

          {selectedTheme && (
            <Text color={AppTheme.colors.textSecondary}>
              {`Este tema tem ${questionsAvailable} perguntas disponíveis.`}
            </Text>
          )}

          <Input
            placeholder="Digite a quantidade de perguntas"
            value={numQuestions}
            onChangeText={setNumQuestions}
            keyboardType="numeric"
            color={AppTheme.colors.textPrimary}
            bg={AppTheme.colors.card}
          />

          {errorMessage && (
            <Text color={AppTheme.colors.error}>{errorMessage}</Text>
          )}

          <Button
            onPress={handleStartQuiz}
            leftIcon={<Icon as={Ionicons} name="play" size="md" />}
            bg={AppTheme.colors.primary}
          >
            Iniciar Quiz
          </Button>
        </VStack>
      </Box>
    </View>
  );
};
