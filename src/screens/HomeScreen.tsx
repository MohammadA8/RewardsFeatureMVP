import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../lib/auth';
import { QuilttProvider } from '@quiltt/react-native';

export const HomeScreen = ({ navigation }: any) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sessionToken = 'eyJhbGciOiJIUzUxMiJ9.eyJuYmYiOjE3NDUwODA4MTQsImlhdCI6MTc0NTA4MDgxNCwianRpIjoiYWVhYjdiNTEtM2E1NC00NDgwLWIwNTgtOWNkMTVkYzM3ZjYwIiwiaXNzIjoiYXV0aC5xdWlsdHQuaW8iLCJhdWQiOiJhcGkucXVpbHR0LmlvIiwiZXhwIjoxNzQ1MTY3MjE0LCJ2ZXIiOjYsInN1YiI6InBfMTJ6Z04xM3FRQ0hpTXZXZmp6R2g0RSIsImNpZCI6ImFwaV8xMnpkMTlRQ2x5UW9tVzRFMEZTelg1Iiwib2lkIjoib3JnXzEyemQxOUdKY2hGaDlmaEFQSGVTZk4iLCJlaWQiOiJlbnZfMTJ6ZDE5R1VYclhrZjYzUlFuYTdocCJ9.-gQvYS1So5RT_7jdW7MV5vCyjB5OA4nZA4V_I2cgjP8VUcM30dNNX7xnAwRl-QRhSIPEuhQSG6rpslVv0J6i2Q'

  return (
    <QuilttProvider token={sessionToken}>
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Connector')}
        >
          <Text style={styles.buttonText}>Link My Bank Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
    </QuilttProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 