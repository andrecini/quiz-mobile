import React, { useState } from 'react';
import { Box, VStack, Heading, Divider, ScrollView } from 'native-base';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';
import { Theme } from '../styles/Theme';

interface Question {
  id: number;
  question: string;
  correctAnswer: number;
  answers: string[];
  themeId: number;
}

export const AddQuestionScreen: React.FC = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  const handleQuestionAdded = () => {
    setRefreshList(!refreshList);
  };

  const handleEditQuestion = (question: Question) => {
    setQuestionToEdit(question);
  };

  return (
    <Box flex={1} safeArea bg={Theme.colors.backgroundLight} px={4} py={6}>
      <ScrollView>
        <Heading color={Theme.colors.primary} fontSize="2xl" mb={4}>
          Controle de Perguntas
        </Heading>

        <Divider bg={Theme.colors.primaryLight} thickness="2" />

        <Box bg={Theme.colors.background} borderRadius="lg" shadow={2} p={4}>
          <QuestionForm
            questionToEdit={questionToEdit}
            onQuestionAdded={handleQuestionAdded}
          />
        </Box>

        <Divider bg={Theme.colors.primaryLight} thickness="2" />

        <Box bg={Theme.colors.background} borderRadius="lg" shadow={2} p={4}>
          <QuestionList
            key={refreshList.toString()}
            onEdit={handleEditQuestion}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};
