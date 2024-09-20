import React, { useState } from 'react';
import { Box, VStack, Heading } from 'native-base';
import { QuestionForm } from '../components/QuestionForm';
import { QuestionList } from '../components/QuestionList';

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
    setQuestionToEdit(null); 
  };

  const handleEditQuestion = (question: Question) => {
    setQuestionToEdit(question); 
  };

  return (
    <Box flex={1} safeArea>
      <VStack space={4} p={5}>
        <Heading>
          Manage Questions
        </Heading>

        <QuestionForm questionToEdit={questionToEdit} onQuestionAdded={handleQuestionAdded} />

        <QuestionList key={refreshList.toString()} onEdit={handleEditQuestion} />
      </VStack>
    </Box>
  );
};
