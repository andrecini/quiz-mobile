import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Alert,
  Badge,
  Pressable,
  Icon
} from "native-base";
import { getAllRows, runQuery } from "../database/Database";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Theme } from "../styles/Theme";

interface Question {
  id: number;
  question: string;
  theme: string;
  correctAnswer: number;
  answers: string[];
  themeId: number;
}

interface QuestionListProps {
  onEdit: (question: Question) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ onEdit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchQuestions = async () => {
    try {
      const result = await getAllRows(`
        SELECT q.id, q.question, q.correctAnswer, t.id as themeId, t.name as theme, 
               GROUP_CONCAT(a.answer, '|') as answers
        FROM questions q
        JOIN themes t ON q.themeId = t.id
        LEFT JOIN answers a ON a.questionId = q.id
        GROUP BY q.id, q.question, q.correctAnswer, t.id, t.name
      `);

      const formattedQuestions = result.map((row: any) => ({
        id: row.id,
        question: row.question,
        correctAnswer: row.correctAnswer,
        theme: row.theme,
        themeId: row.themeId,
        answers: row.answers.split("|"),
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      setMessage("Erro ao buscar as perguntas");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDeleteQuestion = async (id: number) => {
    try {
      await runQuery("DELETE FROM questions WHERE id = ?", [id]);
      fetchQuestions();
    } catch (error) {
      setMessage("Erro ao deletar a pergunta");
    }
  };

  const renderItem = ({ item }: { item: Question }) => (
    <Pressable
    paddingBottom={5}
    borderBottomColor="blue.500"
    borderBottomWidth={2}
    marginBottom={3}
    >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack space={3} flex={1}>
            <Text
              fontSize={Theme.fontSizes.md}
              fontWeight="bold"
              isTruncated
              color={Theme.colors.textPrimary}
            >
              {item.question}
            </Text>
          </VStack>
          <HStack space={2}>
            <Button
              size="sm"
              bg={Theme.colors.primary}
              onPress={() => onEdit(item)}
              leftIcon={<Icon as={MaterialIcons} name="edit" size="sm" />}
              _text={{ fontWeight: "bold", color: Theme.colors.textButton }}
            >
            </Button>
            <Button
              size="sm"
              bg={Theme.colors.errorLight}
              onPress={() => handleDeleteQuestion(item.id)}
              leftIcon={<Icon as={MaterialIcons} name="delete" size="sm" />}
              _text={{ color: Theme.colors.textButton, fontWeight: "bold" }}
            >
            </Button>
          </HStack>
        </HStack>
    </Pressable>
  );

  return (
    <VStack space={5} py={5}>
      {message && (
        <Alert w="100%" status="error">
          <Text color={Theme.colors.error}>{message}</Text>
        </Alert>
      )}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </VStack>
  );
};
