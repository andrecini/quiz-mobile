import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Icon,
  Alert,
  Badge,
  Pressable,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAllRows, runQuery } from "../database/Database";
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
    <Pressable>
      <Box
        p={4}
        bg={Theme.colors.card}
        borderRadius="lg"
        shadow={3}
        mb={3}
        borderColor={Theme.colors.border}
        borderWidth={1}
      >
        <HStack
          justifyContent="space-between"
          alignItems="center"
          style={{ gap: 5 }}
        >
          <VStack space={2} flex={1}>
            <Badge
              colorScheme="teal"
              variant="solid"
              alignSelf="flex-start"
              mb={2}
            >
              {item.theme}
            </Badge>

            <Text
              fontSize={Theme.fontSizes.md}
              fontWeight="700"
              isTruncated
              maxW="200"
              noOfLines={1}
              color={Theme.colors.textPrimary}
            >
              {item.question}
            </Text>
          </VStack>
          <HStack space={3} alignSelf="flex-end">
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.primary}
              leftIcon={<Icon as={Ionicons} name="pencil" size="sm" />}
              onPress={() => onEdit(item)}
              _text={{ fontWeight: "700", color: Theme.colors.textPrimary }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="solid"
              bg={Theme.colors.error}
              leftIcon={<Icon as={Ionicons} name="trash" size="sm" />}
              onPress={() => handleDeleteQuestion(item.id)}
              _text={{ color: Theme.colors.textPrimary, fontWeight: "700" }}
            >
              Deletar
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <VStack space={4} py={4}>
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
