import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Radio, Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAllRows } from '../database/Database';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Routes';

type QuizGameScreenProp = StackNavigationProp<RootStackParamList, 'QuizGameScreen'>;

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

  const [questions, setQuestions] = useState<{ id: number; question: string; correctAnswer: number; answers: string[] }[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
          answers: row.answers.split('|'),
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Erro ao buscar perguntas', error);
      }
    };

    fetchQuestions();
  }, [themeId, questionCount]);

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setCorrectAnswersCount((prev) => prev + 1);
      }
      setSelectedAnswer(null); // Reseta a seleção
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1); // Avança para a próxima pergunta
      } else {
        // Final do quiz - navega para a tela de resultados
        const score = Math.round((correctAnswersCount / questions.length) * 100);
        navigation.navigate('ResultScreen', { score }); // Passa a pontuação para a ResultScreen
      }
    }
  };

  if (questions.length === 0) {
    return <Text>Carregando perguntas...</Text>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white">
      <VStack space={4}>
        <Text fontSize="lg" bold>{`Pergunta ${currentQuestionIndex + 1} de ${questions.length}`}</Text>

        <Text fontSize="md">{currentQuestion.question}</Text>

        <Radio.Group
          name="quizRadioGroup"
          value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
          onChange={(nextValue) => setSelectedAnswer(parseInt(nextValue))}
        >
          {currentQuestion.answers.map((answer, index) => (
            <Radio key={index} value={index.toString()} my={1}>
              {answer}
            </Radio>
          ))}
        </Radio.Group>

        <Button
          onPress={handleNextQuestion}
          leftIcon={<Icon as={Ionicons} name={currentQuestionIndex < questions.length - 1 ? "arrow-forward" : "checkmark-circle"} size="md" />}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
        </Button>
      </VStack>
    </Box>
  );
};
