// Abre la pantalla previa (/permisos/[recurso]) y espera el resultado.
// La pantalla previa llama a cerrarPrevia(true | false) cuando termina.
import { router } from 'expo-router';
import type { Recurso } from '../constants/permisos';

let resolver: ((concedido: boolean) => void) | null = null;

export function abrirPrevia(recurso: Recurso): Promise<boolean> {
  return new Promise((resolve) => {
    resolver = resolve;
    router.push(`/permisos/${recurso}`);
  });
}

export function cerrarPrevia(concedido: boolean) {
  resolver?.(concedido);
  resolver = null;
}
