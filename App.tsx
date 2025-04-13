import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegisterScreen } from './src/screens/RegisterScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <RegisterScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 