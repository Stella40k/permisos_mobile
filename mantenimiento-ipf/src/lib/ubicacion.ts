import * as Location from 'expo-location';

export type Posicion = { latitud: number; longitud: number; aproximada: boolean };

// Se llama DESPUES de que el permiso ya esta concedido. Si algo falla devuelve null.
export async function obtenerUbicacion(): Promise<Posicion | null> {
  try {
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const aproximada =
      permiso.android?.accuracy === 'coarse' || (permiso.ios as any)?.accuracy === 'reduced';

    return { latitud: pos.coords.latitude, longitud: pos.coords.longitude, aproximada };
  } catch {
    return null;
  }
}
