// import React, { useEffect, useState } from 'react';
// import { FlatList } from 'react-native';
// import { Box, Text, Button, HStack, VStack, Icon, Alert } from 'native-base';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { getAllRows, runQuery } from '../database/Database';

// interface ThemeListProps {
//   onEdit: (theme: { id: number; name: string }) => void;
// }

// export const ThemeList: React.FC<ThemeListProps> = ({ onEdit }) => {
//   const [themes, setThemes] = useState<{ id: number; name: string }[]>([]);
//   const [message, setMessage] = useState<string>('');

//   const fetchThemes = async () => {
//     try {
//       const result = await getAllRows('SELECT * FROM themes');
//       setThemes(result as { id: number; name: string }[]);
//     } catch (error) {
//       console.error('Error fetching themes:', error);
//       setMessage('Error fetching themes');
//     }
//   };

//   useEffect(() => {
//     fetchThemes();
//   }, []);

//   const handleDeleteTheme = async (id: number) => {
//     try {
//       await runQuery('DELETE FROM themes WHERE id = ?', [id]);
//       fetchThemes(); // Atualiza a lista de temas após a exclusão
//     } catch (error) {
//       console.error('Error deleting theme:', error);
//       setMessage('Error deleting theme');
//     }
//   };

//   const renderItem = ({ item }: { item: { id: number; name: string } }) => (
//     <Box
//       borderBottomWidth={1}
//       borderColor="coolGray.200"
//       py={2}
//       px={4}
//       _dark={{ borderColor: 'gray.600' }}
//     >
//       <HStack justifyContent="space-between" alignItems="center">
//         <Text fontSize="md" bold>
//           {item.name}
//         </Text>
//         <HStack space={3}>
//           <Button
//             size="sm"
//             variant="solid"
//             colorScheme="info"
//             leftIcon={<Icon as={Ionicons} name="pencil" size="sm" />}
//             onPress={() => onEdit(item)}
//           >
//             Edit
//           </Button>
//           <Button
//             size="sm"
//             variant="outline"
//             colorScheme="danger"
//             leftIcon={<Icon as={Ionicons} name="trash" size="sm" />}
//             onPress={() => handleDeleteTheme(item.id)}
//           >
//             Delete
//           </Button>
//         </HStack>
//       </HStack>
//     </Box>
//   );

//   return (
//     <VStack space={4} py={4}>
//       {message && (
//         <Alert w="100%" status="error">
//           <Text color="error.600">{message}</Text>
//         </Alert>
//       )}
//       <FlatList
//         data={themes}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//       />
//     </VStack>
//   );
// };
