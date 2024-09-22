import React, { useState, useEffect } from "react";
import { View, Box, VStack, Text, Button, Radio, Icon, HStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
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
    <View flex={1} bg={AppTheme.colors.background} p={4}>
      <Box p={4} borderRadius="lg" shadow={2} bg={AppTheme.colors.background}>
        <VStack space={4}>
          <Text
            fontSize={AppTheme.fontSizes.lg}
            bold
            color={AppTheme.colors.textPrimary}
          >
            {`Pergunta ${currentQuestionIndex + 1} de ${questions.length}`}
          </Text>

          <Text
            fontSize={AppTheme.fontSizes.md}
            color={AppTheme.colors.textPrimary}
          >
            {currentQuestion.question}
          </Text>

          <Radio.Group
            name="quizRadioGroup"
            value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
            onChange={(nextValue) => setSelectedAnswer(parseInt(nextValue))}
            isDisabled={isConfirmed}
          >
            {currentQuestion.answers.map((answer, index) => {
              const isCorrect = index === currentQuestion.correctAnswer;
              const isSelected = selectedAnswer === index;

              let bgColor = AppTheme.colors.background;
              if (isConfirmed) {
                bgColor = isCorrect
                  ? "green.200"
                  : isSelected
                  ? "red.200"
                  : AppTheme.colors.background;
              }

              return (
                <Radio
                  key={index}
                  value={index.toString()}
                  my={1}
                  _disabled={{ bg: bgColor }}
                >
                  <HStack space={2} alignItems="center">
                    <Text color={AppTheme.colors.textPrimary}>{answer}</Text>
                    {isConfirmed && isSelected && (
                      <Icon
                        as={Ionicons}
                        name={isCorrect ? "checkmark-circle" : "close-circle"}
                        color={isCorrect ? "green.500" : "red.500"}
                      />
                    )}
                  </HStack>
                </Radio>
              );
            })}
          </Radio.Group>

          {!isConfirmed ? (
            <Button
              onPress={handleConfirmAnswer}
              leftIcon={
                <Icon as={Ionicons} name="checkmark-circle-outline" size="md" />
              }
              bg={AppTheme.colors.primary}
            >
              Confirmar Resposta
            </Button>
          ) : (
            <Button
              onPress={handleNextQuestion}
              leftIcon={
                <Icon
                  as={Ionicons}
                  name={
                    currentQuestionIndex < questions.length - 1
                      ? "arrow-forward"
                      : "checkmark-circle"
                  }
                  size="md"
                />
              }
              bg={AppTheme.colors.primary}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Próxima Pergunta"
                : "Finalizar Quiz"}
            </Button>
          )}

          <Text color={AppTheme.colors.textSecondary}>
            Pontuação atual: {correctAnswersCount}
          </Text>
        </VStack>
      </Box>
    </View>
  );
};
