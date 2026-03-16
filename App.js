import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/store/AppContext';

import NotesScreen from './src/screens/NotesScreen';
import TasksScreen from './src/screens/TasksScreen';
import LabelsScreen from './src/screens/LabelsScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Notes': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Tasks': iconName = focused ? 'checkbox' : 'checkbox-outline'; break;
            case 'Recipes': iconName = focused ? 'restaurant' : 'restaurant-outline'; break;
            case 'Labels': iconName = focused ? 'pricetag' : 'pricetag-outline'; break;
            case 'Reminders': iconName = focused ? 'notifications' : 'notifications-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Labels" component={LabelsScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_left' }} />
            <Stack.Screen name="NoteEditor" component={NoteEditorScreen} options={{ animation: 'slide_from_bottom' }} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ animation: 'slide_from_right' }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="dark" />
      </AppProvider>
    </SafeAreaProvider>
  );
}
