import React, { useState } from 'react';
import { Box, VStack, Heading, ScrollView } from 'native-base'; // Importe ScrollView
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
  };

  const handleEditQuestion = (question: Question) => {
    setQuestionToEdit(question); 
  };

  return (
    <Box flex={1} safeArea>
      {/* Envolva o conteúdo em um ScrollView para permitir o scroll */}
      <ScrollView>
        <VStack space={4} p={5}>
          <Heading>
            Gerenciar Perguntas
          </Heading>

          {/* Formulário de perguntas */}
          <QuestionForm
            questionToEdit={questionToEdit}
            onQuestionAdded={handleQuestionAdded}
          />

          {/* Lista de perguntas */}
          <QuestionList
            key={refreshList.toString()}
            onEdit={handleEditQuestion}
          />
        </VStack>
      </ScrollView>
    </Box>
  );
};
