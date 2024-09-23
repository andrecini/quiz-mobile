import React, { useState, useEffect } from "react";
import { View, Box, VStack, Text, Button, Pressable } from "native-base";
import { getAllRows } from "../database/Database";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../routes/Routes";
import { Theme as AppTheme } from "../styles/Theme";

type QuizGameScreenProp = StackNavigationProp<
  RootStackParamList,
  "QuizGameScreen"
>;

interface QuizGameScreenProps {
  route: {
    params: {
      themeId: number;
      questionCount: number;
    };
  };
}

export const QuizGameScreen: React.FC<QuizGameScreenProps> = ({ route }) => {
  const { themeId, questionCount } = route.params;
  const navigation = useNavigation<QuizGameScreenProp>();

  const [questions, setQuestions] = useState<
    { id: number; question: string; correctAnswer: number; answers: string[] }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await getAllRows(
          `SELECT q.id, q.question, q.correctAnswer, 
           GROUP_CONCAT(a.answer, '|') as answers
           FROM questions q 
           JOIN answers a ON q.id = a.questionId 
           WHERE q.themeId = ? 
           GROUP BY q.id LIMIT ?`,
          [themeId, questionCount]
        );
        const formattedQuestions = result.map((row: any) => ({
          id: row.id,
          question: row.question,
          correctAnswer: row.correctAnswer,
          answers: row.answers.split("|"),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Erro ao buscar perguntas", error);
      }
    };

    fetchQuestions();
  }, [themeId, questionCount]);

  const handleConfirmAnswer = () => {
    setIsConfirmed(true);

    if (
      selectedAnswer !== null &&
      selectedAnswer === questions[currentQuestionIndex].correctAnswer
    ) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsConfirmed(false);
    } else {
      const score = Math.round((correctAnswersCount / questions.length) * 100);
      navigation.navigate("ResultScreen", { score });
    }
  };

  if (questions.length === 0) {
    return (
      <Text color={AppTheme.colors.textPrimary}>Carregando perguntas...</Text>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View flex={1} bg={AppTheme.colors.background} p={4} justifyContent="center">
      <VStack space={4}>
        <Text fontSize={AppTheme.fontSizes.md} color={AppTheme.colors.textPrimary}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;

          return (
            <Pressable
              key={index}
              onPress={() => !isConfirmed && setSelectedAnswer(index)}
              bg={isSelected ? AppTheme.colors.primary : AppTheme.colors.backgroundLight}
              borderRadius="md"
              borderWidth={1}
              borderColor={AppTheme.colors.border}
              p={3}
              mb={2}
            >
              <Text color={isSelected ? AppTheme.colors.textButton : AppTheme.colors.textPrimary}>
                {answer}
              </Text>
            </Pressable>
          );
        })}

        {!isConfirmed ? (
          <Button onPress={handleConfirmAnswer} bg={AppTheme.colors.success}>
            Confirmar Resposta
          </Button>
        ) : (
          <Button onPress={handleNextQuestion} bg={AppTheme.colors.primary}>
            {currentQuestionIndex < questions.length - 1
              ? "Próxima"
              : "Finalizar"}
          </Button>
        )}
      </VStack>
    </View>
  );
};
