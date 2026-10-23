// Textos y datos de cada permiso que usa la app.
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type Recurso = 'camara' | 'ubicacion' | 'notificaciones';

type Icono = ComponentProps<typeof Ionicons>['name'];

export const RECURSOS: Record<
  Recurso,
  {
    nombre: string;
    icono: Icono;
    titulo: string;
    beneficio: string;
    alternativa: string;
    ajustesAndroid: string;
    ajustesIos: string;
  }
> = {
  camara: {
    nombre: 'Cámara',
    icono: 'camera-outline',
    titulo: 'Usamos la cámara',
    beneficio:
      'Usamos tu cámara para leer el QR de la puerta del aula y para sacar la foto del desperfecto.',
    alternativa: 'Podés escribir el aula a mano o elegir una foto de la galería.',
    ajustesAndroid: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Cámara.',
    ajustesIos: 'Ajustes > Mantenimiento IPF > Cámara.',
  },
  ubicacion: {
    nombre: 'Ubicación',
    icono: 'location-outline',
    titulo: 'Usamos tu ubicación',
    beneficio:
      'Usamos tu ubicación para marcar en qué lugar del instituto está el problema que reportás.',
    alternativa: 'Podés elegir el sector (patio, estacionamiento, pasillo) a mano.',
    ajustesAndroid: 'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Ubicación.',
    ajustesIos: 'Ajustes > Mantenimiento IPF > Ubicación.',
  },
  notificaciones: {
    nombre: 'Notificaciones',
    icono: 'notifications-outline',
    titulo: 'Te avisamos',
    beneficio:
      'Usamos las notificaciones para avisarte cuando se resuelva tu reporte.',
    alternativa: 'Los avisos igual aparecen en la pestaña Avisos de la app.',
    ajustesAndroid: 'Ajustes > Aplicaciones > Mantenimiento IPF > Notificaciones.',
    ajustesIos: 'Ajustes > Mantenimiento IPF > Notificaciones.',
  },
};

export const SECTORES = ['Patio', 'Estacionamiento', 'Pasillo', 'Entrada', 'Baños'];

export const CATEGORIAS = [
  { id: 'electricidad', nombre: 'Electricidad', icono: 'flash-outline' },
  { id: 'agua', nombre: 'Agua', icono: 'water-outline' },
  { id: 'mobiliario', nombre: 'Mobiliario', icono: 'bed-outline' },
  { id: 'equipos', nombre: 'Equipos', icono: 'desktop-outline' },
] as const;
