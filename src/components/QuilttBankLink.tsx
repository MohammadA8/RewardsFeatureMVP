import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { supabase } from '../lib/supabase';

// Declare the Quiltt global type
declare global {
  interface Window {
    Quiltt: {
      connect: (options: {
        providers: string[];
        onSuccess: (userId: string) => void;
        onExit: () => void;
        onError: (error: Error) => void;
      }) => Promise<any>;
    };
  }
}

interface QuilttBankLinkProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface WebViewMessage {
  type: 'success' | 'exit' | 'error';
  userId?: string;
  error?: string;
}

export const QuilttBankLink: React.FC<QuilttBankLinkProps> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (quilttUserId: string) => {
    try {
      // Get the current user from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update the user's profile with Quiltt ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ quiltt_user_id: quilttUserId })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Call success callback if provided
      onSuccess?.();
    } catch (error) {
      console.error('Error updating user profile:', error);
      onError?.(error as Error);
      Alert.alert('Error', 'Failed to update user profile with bank information');
    }
  };

  const handleError = (error: Error) => {
    console.error('Quiltt connection error:', error);
    onError?.(error);
    Alert.alert('Error', 'Failed to connect bank account');
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.quiltt.io/v1/quiltt.js"></script>
      </head>
      <body>
        <div id="quiltt-button"></div>
        <script>
          Quiltt.initialize({
            clientId: '${process.env.EXPO_PUBLIC_QUILTT_CLIENT_ID}'
          });

          Quiltt.Button.render({
            element: '#quiltt-button',
            providers: ['finicity', 'mx'],
            onSuccess: function(userId) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'success',
                userId: userId
              }));
            },
            onExit: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'exit'
              }));
            },
            onError: function(error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                error: error.message
              }));
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html }}
        style={styles.webview}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data) as WebViewMessage;
          switch (data.type) {
            case 'success':
              if (data.userId) {
                handleSuccess(data.userId);
              }
              break;
            case 'exit':
              setIsLoading(false);
              break;
            case 'error':
              if (data.error) {
                handleError(new Error(data.error));
              }
              break;
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
}); 