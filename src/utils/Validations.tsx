export const validateTheme = (theme: string): string | null => {
    if (!theme || theme.trim() === '') {
      return 'Theme name cannot be empty';
    }
    return null;
  };
  
  export const validateQuestion = (question: string, answers: string[], correctAnswer: number): string | null => {
    if (!question || question.trim() === '') {
      return 'Question cannot be empty';
    }
    if (answers.length !== 4 || answers.some(answer => answer.trim() === '')) {
      return 'All 4 answers must be filled';
    }
    if (correctAnswer < 0 || correctAnswer > 3) {
      return 'Correct answer must be between 0 and 3';
    }
    return null;
  };
  
  export const validateQuizSettings = (selectedTheme: string | null, questionCount: number, availableQuestions: number): string | null => {
    if (!selectedTheme) {
      return 'Please select a theme';
    }
    if (!questionCount || questionCount <= 0 || questionCount > availableQuestions) {
      return `Please select a number of questions between 1 and ${availableQuestions}`;
    }
    return null;
  };
  