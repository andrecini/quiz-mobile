import React, { useState } from 'react';
import { Box, VStack, Heading, ScrollView } from 'native-base';
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
    <Box flex={1} safeArea bg={Theme.colors.background}>
      <ScrollView>
        <VStack space={4} p={5}>
          <Heading color={Theme.colors.textPrimary}>
            Gerenciar Perguntas
          </Heading>

          <QuestionForm
            questionToEdit={questionToEdit}
            onQuestionAdded={handleQuestionAdded}
          />

          <QuestionList
            key={refreshList.toString()}
            onEdit={handleEditQuestion}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
};
