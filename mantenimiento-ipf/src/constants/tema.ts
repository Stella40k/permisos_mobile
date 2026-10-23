// Colores, espacios y radios de toda la app.
// Si despues rediseñas con Stitch, empezá cambiando este archivo.
export const tema = {
  primario: '#2563EB',
  primarioSuave: '#DBEAFE',
  texto: '#0F172A',
  textoSuave: '#64748B',
  fondo: '#F4F6FB',
  tarjeta: '#FFFFFF',
  borde: '#E2E8F0',
  exito: '#16A34A',
  exitoSuave: '#DCFCE7',
  aviso: '#D97706',
  avisoSuave: '#FEF3C7',
  peligro: '#DC2626',
  peligroSuave: '#FEE2E2',
  radio: 14,
  espacio: 16,
};

export const colorEstado = {
  pendiente: { fondo: tema.avisoSuave, texto: tema.aviso },
  'en curso': { fondo: tema.primarioSuave, texto: tema.primario },
  resuelto: { fondo: tema.exitoSuave, texto: tema.exito },
} as const;
