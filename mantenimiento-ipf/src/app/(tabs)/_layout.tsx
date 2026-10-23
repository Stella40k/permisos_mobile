import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { tema } from '../../constants/tema';
import { useStore } from '../../lib/store';

export default function TabsLayout() {
  const { avisos } = useStore();
  const sinLeer = avisos.filter((a) => !a.leido).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tema.primario,
        tabBarInactiveTintColor: tema.textoSuave,
        headerStyle: { backgroundColor: tema.tarjeta },
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: tema.fondo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/ajustes-app')} style={{ paddingHorizontal: 16 }}>
              <Ionicons name="settings-outline" size={22} color={tema.texto} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          tabBarBadge: sinLeer > 0 ? sinLeer : undefined,
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
