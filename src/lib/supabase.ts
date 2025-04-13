import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
const supabaseUrl = 'https://urdxyrilfefgpekvrgui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZHh5cmlsZmVmZ3Bla3ZyZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1Njg3MDcsImV4cCI6MjA2MDE0NDcwN30.7NyZj7DptJSV_eo2Xn7lkHlz7h2bAvNAoVeXLH5u_1c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 