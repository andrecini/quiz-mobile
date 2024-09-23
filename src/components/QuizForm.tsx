import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import {
  Modal,
  Button,
  Text,
  Input,
  Box,
  VStack,
  Pressable,
  HStack,
} from "native-base";
import { getAllRows, getFirstRow } from "../database/Database";
import { Theme as AppTheme } from "../styles/Theme";

interface Theme {
  id: number;
  name: string;
}

interface QuizFormProps {
  navigation: {
    navigate: (
      screen: string,
      params?: { themeId: number; questionCount: number }
    ) => void;
  };
}

export const QuizForm: React.FC<QuizFormProps> = ({ navigation }) => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [questionsAvailable, setQuestionsAvailable] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<string>("0");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const result = await getAllRows("SELECT * FROM themes");
        setThemes(result as Theme[]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeSelect = async (theme: Theme) => {
    setSelectedTheme(theme);
    setModalVisible(false);

    try {
      const result = await getFirstRow(
        "SELECT COUNT(*) AS total FROM questions WHERE themeId = ?",
        [theme.id]
      );
      setQuestionsAvailable((result as { total: number }).total);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayQuiz = () => {
    const questionCountNumber = parseInt(questionCount, 10);
    if (
      selectedTheme &&
      questionCountNumber > 0 &&
      questionCountNumber <= questionsAvailable
    ) {
      navigation.navigate("PlayQuizScreen", {
        themeId: selectedTheme.id,
        questionCount: questionCountNumber,
      });
    } else {
      alert("Selecione um tema e uma quantidade válida de questões");
    }
  };

  return (
      <VStack space={5}>
        <Text
          color={AppTheme.colors.heading}
          fontSize={AppTheme.fontSizes.xl}
          bold
        >
          Escolha seu Tema
        </Text>

        <Pressable onPress={() => setModalVisible(true)}>
            <HStack alignItems="center" justifyContent="center" w="full">
              <Text
                color={AppTheme.colors.textPrimary}
                fontSize={AppTheme.fontSizes.md}
                bold
              >
                {selectedTheme ? selectedTheme.name : "Selecione"}
              </Text>
            </HStack>
        </Pressable>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Escolha um Tema</Modal.Header>
            <Modal.Body>
              <FlatList
                data={themes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleThemeSelect(item)}
                    mb={3}
                    bg={AppTheme.colors.background}
                    py={4}
                    px={5}
                    rounded="md"
                    borderColor={AppTheme.colors.border}
                    borderWidth={1}
                  >
                    <Text color={AppTheme.colors.textPrimary} bold>
                      {item.name}
                    </Text>
                  </Pressable>
                )}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>

        <Text mt={4} color={AppTheme.colors.textSecondary} fontSize="lg">
          Questões disponíveis: {questionsAvailable}
        </Text>

        <Input
          mt={4}
          placeholder="Quantidade de questões"
          keyboardType="numeric"
          value={questionCount}
          onChangeText={setQuestionCount}
          color={AppTheme.colors.textPrimary}
          bg={AppTheme.colors.background}
          borderColor={AppTheme.colors.border}
          borderWidth={1}
          rounded="md"
          px={4}
        />

        <Button
          mt={5}
          onPress={handlePlayQuiz}
          bg={AppTheme.colors.primary}
          rounded="md"
          py={3}
          _text={{ fontSize: AppTheme.fontSizes.md, bold: true }}
          _pressed={{ bg: AppTheme.colors.primaryLight }}
        >
          Começar Quiz
        </Button>
      </VStack>
  );
};
