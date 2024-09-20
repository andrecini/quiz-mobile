// QuestionForm.tsx

import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, Input, Button, Text, Select, Icon, Center } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { runQuery, getAllRows } from '../database/Database'; 

interface QuestionFormProps {
  questionToEdit?: { id: number; question: string; correctAnswer: number; answers: string[]; themeId: number };
  onQuestionAdded: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ questionToEdit, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchThemesAndInitialize = async () => {
      try {
        const result = await getAllRows('SELECT * FROM themes');
        setThemes(result as { id: number; name: string }[]);

        if (questionToEdit) {
          setQuestionText(questionToEdit.question);
          setAnswers(questionToEdit.answers);
          setCorrectAnswer(questionToEdit.correctAnswer);
          setSelectedTheme(questionToEdit.themeId);
        }
      } catch (error) {
        console.error('Error fetching themes', error);
      }
    };

    fetchThemesAndInitialize();
  }, [questionToEdit]);

  const handleSaveQuestion = async () => {
    if (!questionText.trim() || answers.some((a) => a === '') || selectedTheme === undefined) {
      setMessage('Por favor, preencha todos os campos');
      return;
    }

    try {
      if (questionToEdit) {
        // Atualiza pergunta existente
        await runQuery('UPDATE questions SET question = ?, correctAnswer = ?, themeId = ? WHERE id = ?', [
          questionText,
          correctAnswer,
          selectedTheme, 
          questionToEdit.id,
        ]);

        // Deleta respostas antigas e insere as novas
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
        // Insere nova pergunta
        const result = await runQuery(
          'INSERT INTO questions (themeId, question, correctAnswer) VALUES (?, ?, ?)',
          [selectedTheme, questionText, correctAnswer]
        );
        const questionId = result.lastInsertRowId;

        for (let i = 0; i < answers.length; i++) {
          await runQuery('INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)', [
            questionId,
            answers[i],
            i === correctAnswer ? 1 : 0,
          ]);
        }

        setMessage('Pergunta salva com sucesso!');
      }

      // Limpa os campos após salvar
      setQuestionText('');
      setAnswers(['', '', '', '']);
      setSelectedTheme(undefined); // Limpa o tema selecionado
      onQuestionAdded();
    } catch (error) {
      setMessage('Erro ao salvar a pergunta - ' + error);
    }
  };

  // Adiciona um log para visualizar o valor de selectedTheme
  console.log("Selected Theme Value:", selectedTheme);

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white">
      <VStack space={4}>
        <HStack space={1}>
        <Icon as={Ionicons} name="help-circle-sharp" size="lg" color="black" alignSelf='center' />
          <Text fontSize="lg" bold>
            {questionToEdit ? 'Editar Pergunta' : 'Adicionar Nova Pergunta'}
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
            _text: { color: 'white' }, // Texto do item selecionado em branco
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
              color="blue.500" // Ícone em azul
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
                color={index === correctAnswer ? "green.700" : "red.700"} // Ícone verde ou vermelho
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
            _text: { color: 'white' }, // Texto do item selecionado em branco
            endIcon: <Icon as={Ionicons} name="checkmark-sharp" size="lg" color="white" />,
          }}
        >
          {answers.map((_, index) => (
            <Select.Item key={index} label={`Resposta ${index + 1}`} value={index.toString()} />
          ))}
        </Select>

        {/* Botão para salvar a pergunta */}
        <Button onPress={handleSaveQuestion} leftIcon={<Icon as={Ionicons} name="save" size="md" />}>
          {questionToEdit ? 'Atualizar Pergunta' : 'Salvar Pergunta'}
        </Button>

        {message && (
          <Text color={message.includes('Erro') ? 'red.500' : 'green.500'}>{message}</Text>
        )}
      </VStack>
    </Box>
  );
};
