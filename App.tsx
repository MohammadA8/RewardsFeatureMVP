import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/lib/auth';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { EmailConfirmationScreen } from './src/screens/EmailConfirmationScreen';
import { QuilttProvider } from '@quiltt/react-native';
import { ConnectorScreen } from '@/screens/ConnectorScreen';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  const sessionToken = 'eyJhbGciOiJIUzUxMiJ9.eyJuYmYiOjE3NDUwODA4MTQsImlhdCI6MTc0NTA4MDgxNCwianRpIjoiYWVhYjdiNTEtM2E1NC00NDgwLWIwNTgtOWNkMTVkYzM3ZjYwIiwiaXNzIjoiYXV0aC5xdWlsdHQuaW8iLCJhdWQiOiJhcGkucXVpbHR0LmlvIiwiZXhwIjoxNzQ1MTY3MjE0LCJ2ZXIiOjYsInN1YiI6InBfMTJ6Z04xM3FRQ0hpTXZXZmp6R2g0RSIsImNpZCI6ImFwaV8xMnpkMTlRQ2x5UW9tVzRFMEZTelg1Iiwib2lkIjoib3JnXzEyemQxOUdKY2hGaDlmaEFQSGVTZk4iLCJlaWQiOiJlbnZfMTJ6ZDE5R1VYclhrZjYzUlFuYTdocCJ9.-gQvYS1So5RT_7jdW7MV5vCyjB5OA4nZA4V_I2cgjP8VUcM30dNNX7xnAwRl-QRhSIPEuhQSG6rpslVv0J6i2Q'

  return (
    <QuilttProvider token={sessionToken}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Connector"
          component={ConnectorScreen}
        />
      </Stack.Navigator>
    </QuilttProvider>
  )
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
} 