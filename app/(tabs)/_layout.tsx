import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importação dos ícones

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF', // Cor da aba ativa
        headerShown: false,              // Remove o header superior se preferir
      }}
    >
      <Tabs.Screen
        name="index" // Refere-se ao arquivo index.tsx da pasta (tabs)
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="configuracoes" // Refere-se ao arquivo configuracoes.tsx da pasta (tabs)
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}