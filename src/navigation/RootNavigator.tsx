import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import StudyScreen from '../screens/StudyScreen';
import AddWordScreen from '../screens/AddWordScreen';
import WordListScreen from '../screens/WordListScreen';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, string> = {
  Study: '🧠',
  AddWord: '➕',
  WordList: '📚',
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>,
        })}
      >
        <Tab.Screen name="Study" component={StudyScreen} options={{ title: 'Öğren' }} />
        <Tab.Screen name="AddWord" component={AddWordScreen} options={{ title: 'Yeni Ekle' }} />
        <Tab.Screen name="WordList" component={WordListScreen} options={{ title: 'Kelimelerim' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
