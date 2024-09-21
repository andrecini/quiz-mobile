import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, Radio, Icon, HStack } from 'native-base';
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
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false); // Controle de confirmação
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

  const handleConfirmAnswer = () => {
    setIsConfirmed(true);

    if (selectedAnswer !== null && selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null); // Reseta a seleção
      setIsConfirmed(false); // Permite nova resposta na próxima pergunta
    } else {
      // Final do quiz - navega para a tela de resultados
      const score = Math.round((correctAnswersCount / questions.length) * 100);
      navigation.navigate('ResultScreen', { score }); // Passa a pontuação para a ResultScreen
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
          isDisabled={isConfirmed} // Desabilita após a confirmação
        >
          {currentQuestion.answers.map((answer, index) => {
            const isCorrect = index === currentQuestion.correctAnswer;
            const isSelected = selectedAnswer === index;

            let bgColor = 'white';
            if (isConfirmed) {
              bgColor = isCorrect ? 'green.200' : isSelected ? 'red.200' : 'white';
            }

            return (
              <Radio key={index} value={index.toString()} my={1} _disabled={{ bg: bgColor }}>
                <HStack space={2} alignItems="center">
                  <Text>{answer}</Text>
                  {isConfirmed && isSelected && (
                    <Icon as={Ionicons} name={isCorrect ? 'checkmark-circle' : 'close-circle'} color={isCorrect ? 'green.500' : 'red.500'} />
                  )}
                </HStack>
              </Radio>
            );
          })}
        </Radio.Group>

        {!isConfirmed ? (
          <Button onPress={handleConfirmAnswer} leftIcon={<Icon as={Ionicons} name="checkmark-circle-outline" size="md" />}>
            Confirmar Resposta
          </Button>
        ) : (
          <Button
            onPress={handleNextQuestion}
            leftIcon={<Icon as={Ionicons} name={currentQuestionIndex < questions.length - 1 ? "arrow-forward" : "checkmark-circle"} size="md" />}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
          </Button>
        )}

        <Text>Pontuação atual: {correctAnswersCount}</Text>
      </VStack>
    </Box>
  );
};
