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
  Icon,
} from "native-base";
import { getAllRows, getFirstRow } from "../database/Database";
import Ionicons from "react-native-vector-icons/Ionicons";
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
      } catch (error) {}
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
    } catch (error) {}
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
      alert("Please select a valid theme and number of questions");
    }
  };

  return (
    <Box flex={1} p={4} bg={AppTheme.colors.background}>
      <Text color={AppTheme.colors.textPrimary}>Select a Theme:</Text>

      <Pressable onPress={() => setModalVisible(true)}>
        <Box
          py={4}
          px={3}
          rounded="lg"
          borderWidth={1}
          borderColor={AppTheme.colors.border}
          alignItems="center"
          bg={AppTheme.colors.secondary}
        >
          <Text color={AppTheme.colors.textPrimary}>
            {selectedTheme ? selectedTheme.name : "Choose a theme"}
          </Text>
        </Box>
      </Pressable>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Select a Theme</Modal.Header>
          <Modal.Body>
            <FlatList
              data={themes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleThemeSelect(item)}
                  mb={3}
                  bg={AppTheme.colors.secondary}
                  py={3}
                  px={5}
                  rounded="lg"
                >
                  <Text color={AppTheme.colors.textPrimary}>{item.name}</Text>
                </Pressable>
              )}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Text mt={4} color={AppTheme.colors.textPrimary}>
        Questions available: {questionsAvailable}
      </Text>

      <Input
        mt={4}
        placeholder="Enter number of questions"
        keyboardType="numeric"
        value={questionCount}
        onChangeText={setQuestionCount}
        color={AppTheme.colors.textPrimary}
        bg={AppTheme.colors.secondary}
      />

      <Button mt={4} onPress={handlePlayQuiz} bg={AppTheme.colors.primary}>
        Start Quiz
      </Button>
    </Box>
  );
};
