import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import uuid from 'react-native-uuid';
import { supabase } from '../lib/supabase';

export const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      
      // Generate UUID for the user
      const userId = uuid.v4();
      
      // Register user with Supabase Auth
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user record in users table
      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            created_at: new Date().toISOString(),
          },
        ]);

      if (dbError) throw dbError;

      Alert.alert('Success', 'Registration successful!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
}); 