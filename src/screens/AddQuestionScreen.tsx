import React, { useState } from 'react';
import { Box, VStack, Heading, FlatList } from 'native-base';
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
    setQuestionToEdit(null);
  };

  const handleEditQuestion = (question: Question) => {
    setQuestionToEdit(question);
  };

  const renderHeader = () => (
    <VStack space={3} p={3}>
      <Heading color={Theme.colors.textPrimary}>Gerenciar Perguntas</Heading>

      <QuestionForm
        questionToEdit={questionToEdit}
        onQuestionAdded={handleQuestionAdded}
      />
    </VStack>
  );

  const renderFooter = () => (
    <VStack space={2} p={3}>
      <QuestionList
        key={refreshList.toString()}
        onEdit={handleEditQuestion}
      />
    </VStack>
  );

  return (
    <FlatList
      data={[]} 
      keyExtractor={(item, index) => index.toString()} 
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      renderItem={null} 
      style={{ backgroundColor: Theme.colors.background }}
    />
  );
};
