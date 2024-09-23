import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, Feather, AntDesign } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { Theme } from "../styles/Theme";
import { styles } from "../styles/style";
import { VStack } from "native-base";
import { LogBox } from 'react-native';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

LogBox.ignoreLogs(['SSRProvider is not necessary']);

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Theme.colors.backgroundLight, justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: Theme.colors.primary,
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 30,
            textAlign: "center",
          },
        ]}
      >
        Aplicativo de Quiz - EC10
      </Text>

      <VStack
        space={6}
        style={{ alignItems: "center", justifyContent: "center", width: '100%' }}
      >
        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.successLight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              borderRadius: 14,
              width: '85%',
            },
          ]}
          onPress={() => navigation.navigate("AddThemeScreen")}
        >
          <Text style={{ color: Theme.colors.textButton, fontSize: 18 }}>Temas do Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.errorLight,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              borderRadius: 14,
              width: '85%',
            },
          ]}
          onPress={() => navigation.navigate("AddQuestionScreen")}
        >
          <Text style={{ color: Theme.colors.textButton, fontSize: 18 }}>Perguntas do Quiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            {
              backgroundColor: Theme.colors.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              borderRadius: 14,
              width: '85%',
            },
          ]}
          onPress={() => navigation.navigate("PlayQuizScreen")}
        >
          <Text style={{ color: Theme.colors.textButton, fontSize: 18 }}>Iniciar Quiz</Text>
        </TouchableOpacity>
      </VStack>
    </View>
  );
};
