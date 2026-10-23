import type { Ubicacion } from './tipos';

export function textoUbicacion(u?: Ubicacion): string {
  if (!u) return 'Sin ubicación';
  if (u.tipo === 'sector') return `Sector: ${u.sector}`;
  // Si es aproximada no mostramos coordenadas exactas.
  if (u.aproximada) return 'Ubicación aproximada';
  return `${u.latitud.toFixed(5)}, ${u.longitud.toFixed(5)}`;
}

export function fechaCorta(ms: number): string {
  const f = new Date(ms);
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${dos(f.getDate())}/${dos(f.getMonth() + 1)} ${dos(f.getHours())}:${dos(f.getMinutes())}`;
}
