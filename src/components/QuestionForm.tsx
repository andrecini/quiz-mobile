import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Input, Button, Text, Select, Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { runQuery, getAllRows } from '../database/Database'; 

interface QuestionFormProps {
  questionToEdit?: { id: number; question: string; correctAnswer: number; answers: string[]; themeId: number };
  onQuestionAdded: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ questionToEdit, onQuestionAdded }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [questionText, setQuestionText] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        console.log("Fetching themes...");
        const result = await getAllRows('SELECT * FROM themes');
        setThemes(result as { id: number; name: string }[]);
        console.log("Themes fetched:", result);
      } catch (error) {
        console.error('Erro ao buscar temas', error);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    if (questionToEdit) {
      setIsEditing(true);
      setQuestionText(questionToEdit.question);
      setAnswers(questionToEdit.answers);
      setCorrectAnswer(questionToEdit.correctAnswer);
      setSelectedTheme(questionToEdit.themeId);
    } else {
      setIsEditing(false);
      setQuestionText('');
      setAnswers(['', '', '', '']);
      setCorrectAnswer(0);
      setSelectedTheme(undefined);
    }
  }, [questionToEdit]);

  const handleSaveQuestion = async () => {
    if (!questionText.trim() || answers.some((a) => a === '') || selectedTheme === undefined) {
      setMessage('Por favor, preencha todos os campos');
      return;
    }

    try {
      if (isEditing && questionToEdit) {
        console.log('Updating existing question...');
        await runQuery('UPDATE questions SET question = ?, correctAnswer = ?, themeId = ? WHERE id = ?', [
          questionText,
          correctAnswer,
          selectedTheme, 
          questionToEdit.id,
        ]);

        await runQuery('DELETE FROM answers WHERE questionId = ?', [questionToEdit.id]);

        for (let i = 0; i < answers.length; i++) {
          await runQuery('INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)', [
            questionToEdit.id,
            answers[i],
            i === correctAnswer ? 1 : 0,
          ]);
        }

        setMessage('Pergunta atualizada com sucesso!');
      } else {
        console.log('Inserting new question...');
        const result = await runQuery(
          'INSERT INTO questions (themeId, question, correctAnswer) VALUES (?, ?, ?)',
          [selectedTheme, questionText, correctAnswer]
        );
        const questionId = result.lastInsertRowId;

        console.log('Question inserted with ID:', questionId);

        for (let i = 0; i < answers.length; i++) {
          await runQuery('INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)', [
            questionId,
            answers[i],
            i === correctAnswer ? 1 : 0,
          ]);
        }

        setMessage('Pergunta salva com sucesso!');
      }

      // Limpa os campos após salvar e volta ao modo de adição
      setQuestionText('');
      setAnswers(['', '', '', '']);
      setCorrectAnswer(0);
      setSelectedTheme(undefined);
      setIsEditing(false);
      onQuestionAdded();
    } catch (error) {
      console.error('Error during query execution:', error);
      setMessage('Erro ao salvar a pergunta - ' + error);
    }
  };

  const handleCancel = () => {
    // Limpa os campos e sai do modo de edição
    setQuestionText('');
    setAnswers(['', '', '', '']);
    setCorrectAnswer(0);
    setSelectedTheme(undefined);
    setIsEditing(false);
    setMessage('');
  };

  console.log("Selected Theme:", selectedTheme);

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white">
      <VStack space={4}>
        <HStack space={1} alignItems="center">
          <Icon as={Ionicons} name="help-circle-sharp" size="lg" color="black" />
          <Text fontSize="lg" bold>
            {isEditing ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
          </Text>
        </HStack>

        {/* Select para o tema */}
        <Select
          selectedValue={selectedTheme !== undefined ? selectedTheme.toString() : ''}
          minWidth="200"
          placeholder="Escolha um tema"
          onValueChange={(itemValue) => setSelectedTheme(parseInt(itemValue))}
          _selectedItem={{
            bg: 'teal.600',
            _text: { color: 'white' },
            endIcon: <Icon as={Ionicons} name="checkmark-sharp" size="lg" color="white" />,
          }}
        >
          {themes.map((theme) => (
            <Select.Item key={theme.id} label={theme.name} value={theme.id.toString()} />
          ))}
        </Select>

        {/* Input para a pergunta */}
        <Input
          placeholder="Digite a pergunta"
          value={questionText}
          onChangeText={setQuestionText}
          InputLeftElement={
            <Icon
              as={Ionicons}
              name="help-circle"
              size="md"
              ml={2}
              color="blue.500"
            />
          }
        />

        {/* Inputs para as respostas */}
        {answers.map((ans, index) => (
          <Input
            key={index}
            placeholder={`Resposta ${index + 1}`}
            value={ans}
            onChangeText={(text) => {
              const newAnswers = [...answers];
              newAnswers[index] = text;
              setAnswers(newAnswers);
            }}
            InputLeftElement={
              <Icon
                as={Ionicons}
                name={index === correctAnswer ? "checkmark-circle-sharp" : "close-circle-outline"}
                size="md"
                ml={2}
                color={index === correctAnswer ? "green.700" : "red.700"}
              />
            }
          />
        ))}

        {/* Select para a resposta correta */}
        <Select
          selectedValue={correctAnswer.toString()}
          placeholder="Selecione a resposta correta"
          onValueChange={(value) => setCorrectAnswer(parseInt(value))}
          _selectedItem={{
            bg: 'teal.600',
            _text: { color: 'white' },
            endIcon: <Icon as={Ionicons} name="checkmark-sharp" size="lg" color="white" />,
          }}
        >
          {answers.map((_, index) => (
            <Select.Item key={index} label={`Resposta ${index + 1}`} value={index.toString()} />
          ))}
        </Select>

        {/* Botões de ação */}
        <HStack space={2}>
          <Button flex={1} onPress={handleSaveQuestion} leftIcon={<Icon as={Ionicons} name="save" size="md" />}>
            {isEditing ? 'Atualizar Pergunta' : 'Salvar Pergunta'}
          </Button>

          {isEditing && (
            <Button
              flex={1}
              variant="outline"
              colorScheme="secondary"
              onPress={handleCancel}
              leftIcon={<Icon as={Ionicons} name="close-circle" size="md" />}
            >
              <Text fontWeight={700} color="secondary.500">
                Cancelar
              </Text>
            </Button>
          )}
        </HStack>

        {message && (
          <Text color={message.includes('Erro') ? 'red.500' : 'green.500'}>
            {message}
          </Text>
        )}
      </VStack>
    </Box>
  );
};
