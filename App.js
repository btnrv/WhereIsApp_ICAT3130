import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import ItemListScreen from './src/screens/ItemListScreen';
import ShowItemScreen from './src/screens/ShowItemScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="ItemList" component={ItemListScreen} />
        <Stack.Screen name="ShowItem" component={ShowItemScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
