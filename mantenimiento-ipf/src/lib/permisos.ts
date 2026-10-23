// Adaptadores: una forma unica de consultar y pedir cada permiso.
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Recurso } from '../constants/permisos';

export type Estado = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type Normalizado = {
  granted: boolean;
  canAskAgain: boolean;
  parcial: string | null; // matiz: "Ubicación aproximada", "Provisional", etc.
};

export function aEstado(r: { granted: boolean; canAskAgain: boolean }): Estado {
  if (r.granted) return 'concedido';
  if (r.canAskAgain) return 'preguntable';
  return 'bloqueado';
}

function deUbicacion(r: Location.LocationPermissionResponse): Normalizado {
  const aproximada = r.android?.accuracy === 'coarse' || (r.ios as any)?.accuracy === 'reduced';
  return {
    granted: r.granted,
    canAskAgain: r.canAskAgain,
    parcial: r.granted && aproximada ? 'Ubicación aproximada' : null,
  };
}

function deNotificaciones(r: Notifications.NotificationPermissionsStatus): Normalizado {
  const provisional = r.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return {
    granted: r.granted || provisional,
    canAskAgain: r.canAskAgain,
    parcial: provisional ? 'Provisional (sin sonido)' : null,
  };
}

export async function crearCanalAndroid() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('reportes', {
    name: 'Reportes',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export const ADAPTADORES: Record<
  Recurso,
  { consultar: () => Promise<Normalizado>; pedir: () => Promise<Normalizado> }
> = {
  camara: {
    consultar: async () => {
      const r = await Camera.getCameraPermissionsAsync();
      return { granted: r.granted, canAskAgain: r.canAskAgain, parcial: null };
    },
    pedir: async () => {
      const r = await Camera.requestCameraPermissionsAsync();
      return { granted: r.granted, canAskAgain: r.canAskAgain, parcial: null };
    },
  },
  ubicacion: {
    // Solo primer plano: "farmacias cercanas" no necesita segundo plano.
    consultar: async () => deUbicacion(await Location.getForegroundPermissionsAsync()),
    pedir: async () => deUbicacion(await Location.requestForegroundPermissionsAsync()),
  },
  notificaciones: {
    consultar: async () => deNotificaciones(await Notifications.getPermissionsAsync()),
    pedir: async () => {
      // En Android el dialogo no aparece si no existe al menos un canal.
      await crearCanalAndroid();
      return deNotificaciones(await Notifications.requestPermissionsAsync());
    },
  },
};
