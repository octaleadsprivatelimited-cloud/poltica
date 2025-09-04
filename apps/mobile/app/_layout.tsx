import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { supabase } from '@sarpanch-campaign/lib';

export default function RootLayout() {
  useEffect(() => {
    // Initialize any global setup here
    console.log('Mobile app initialized');
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="checkin" options={{ title: 'Check In' }} />
        <Stack.Screen name="expense" options={{ title: 'Add Expense' }} />
        <Stack.Screen name="event" options={{ title: 'Event Details' }} />
      </Stack>
    </>
  );
}
