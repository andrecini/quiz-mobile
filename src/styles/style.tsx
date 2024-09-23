import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#E8F0F2', // Fundo claro com toque azul
  },
  title: {
    fontSize: 26,
    fontWeight: '600', // Deixei o peso um pouco mais leve para diferenciação
    marginBottom: 25,
    color: '#2C3E50', // Azul escuro para os títulos
  },
  input: {
    borderWidth: 1,
    borderColor: '#BBBBBB', // Bordas em cinza claro
    padding: 12,
    marginVertical: 12,
    borderRadius: 8, // Cantos mais arredondados para um visual moderno
    backgroundColor: '#F7F9FB', // Fundo claro nos inputs
  },
  pickerButton: {
    padding: 14,
    backgroundColor: '#FF5733', // Laranja vibrante para botões
    borderRadius: 10,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,30,0.5)', // Sombra mais escura para modal
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16, // Bordas ainda mais arredondadas para modal
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 24,
    fontWeight: '600',
    color: '#2C3E50',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD', 
    width: '100%',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 12,
  },
  resultText: {
    fontSize: 20,
    marginVertical: 12,
    color: '#4E5D6C', // Cinza suave para os textos de resultados
  },
  breakdownTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#2C3E50',
  },
  questionContainer: {
    marginVertical: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 12,
    backgroundColor: '#F7F9FB',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  answerText: {
    fontSize: 16,
    color: '#3498db', // Azul para as respostas
    marginVertical: 8,
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#27ae60', // Verde para respostas corretas
    marginVertical: 8,
  },
  message: {
    fontSize: 16,
    color: '#EB5757', // Vermelho vibrante para mensagens de erro
    marginTop: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2C3E50',
  },
});
