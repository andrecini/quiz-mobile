import React from "react";
import { View, Box, VStack, Text, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../routes/Routes";
import { Theme as AppTheme } from "../styles/Theme";

type ResultScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ResultScreen"
>;

interface ResultScreenProps {
  route: {
    params: {
      score: number;
      correctAnswersCount: number;
      incorrectAnswersCount: number;
    };
  };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ route }) => {
  const { score, correctAnswersCount, incorrectAnswersCount } = route.params;
  const navigation = useNavigation<ResultScreenNavigationProp>();

  const chartData = [
    {
      name: "Acertos",
      value: correctAnswersCount,
      color: "#820AD1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Erros",
      value: incorrectAnswersCount,
      color: "#F3F4F6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const screenWidth = Dimensions.get("window").width;

  return (
    <View flex={1} bg={AppTheme.colors.background} p={4}>
      <Box
        p={4}
        borderRadius="lg"
        shadow={2}
        bg={AppTheme.colors.background}
        flex={1}
        justifyContent="center"
      >
        <VStack space={4} alignItems="center">
          <Text fontSize="2xl" bold color={AppTheme.colors.textPrimary}>
            Resultado do Quiz
          </Text>

          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: AppTheme.colors.background,
              backgroundGradientFrom: AppTheme.colors.background,
              backgroundGradientTo: AppTheme.colors.background,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              strokeWidth: 2,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
            absolute
          />

          <Text fontSize="lg" color={AppTheme.colors.textPrimary}>
            {`Você acertou ${score}% das perguntas.`}
          </Text>

          <Button
            onPress={() => navigation.navigate("HomeScreen")}
            bg={AppTheme.colors.primary}
          >
            Voltar para a Tela Inicial
          </Button>
        </VStack>
      </Box>
    </View>
  );
};
