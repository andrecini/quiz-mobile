import React from 'react';
import { Box, VStack, Text, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { StackNavigationProp } from '@react-navigation/stack'; // Importar a tipagem correta para navegação
import { RootStackParamList } from '../routes/Routes'; // Ajuste o caminho conforme sua estrutura

// Defina o tipo de navegação especificamente para ResultScreen
type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ResultScreen'>;

interface ResultScreenProps {
  route: {
    params: {
      score: number; // Porcentagem de acertos
    };
  };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ route }) => {
  const { score } = route.params;

  // Use o tipo correto de navegação
  const navigation = useNavigation<ResultScreenNavigationProp>();

  // Dados para o gráfico de donut
  const chartData = [
    {
      name: 'Acertos',
      score,
      color: 'rgba(0, 128, 0, 1)', // Cor verde para acertos
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Erros',
      score: 100 - score,
      color: 'rgba(255, 0, 0, 1)', // Cor vermelha para erros
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  const screenWidth = Dimensions.get('window').width;

  return (
    <Box p={4} borderRadius="lg" shadow={2} bg="white" flex={1} justifyContent="center">
      <VStack space={4} alignItems="center">
        <Text fontSize="2xl" bold>Resultado do Quiz</Text>

        {/* Gráfico de donut para exibir a porcentagem de acertos */}
        <PieChart
          data={chartData}
          width={screenWidth - 40} // Define a largura do gráfico
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            strokeWidth: 2, // Tamanho do arco do gráfico
          }}
          accessor="score"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute // Exibe os valores como números absolutos no centro
        />

        <Text fontSize="lg">{`Você acertou ${score}% das perguntas!`}</Text>

        {/* Botão para voltar à tela inicial */}
        <Button onPress={() => navigation.navigate('HomeScreen')}>
          Voltar para a Tela Inicial
        </Button>
      </VStack>
    </Box>
  );
};
