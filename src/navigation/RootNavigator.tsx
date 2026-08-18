import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import StudyScreen from '../screens/StudyScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Kelimelerim' }}
        />
        <Stack.Screen
          name="Study"
          component={StudyScreen}
          options={{ title: 'Bugünkü Tekrar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
