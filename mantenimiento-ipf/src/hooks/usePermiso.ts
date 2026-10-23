import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import type { Recurso } from '../constants/permisos';
import { ADAPTADORES, aEstado, type Estado } from '../lib/permisos';
import { useRevisarAlVolver } from './useRevisarAlVolver';

export function usePermiso(recurso: Recurso) {
  const [estado, setEstado] = useState<Estado>('cargando');
  const [parcial, setParcial] = useState<string | null>(null);

  const revisar = useCallback(async () => {
    const r = await ADAPTADORES[recurso].consultar();
    setEstado(aEstado(r));
    setParcial(r.parcial);
  }, [recurso]);

  // Puede mostrar el dialogo del sistema. Devuelve el estado final.
  const pedir = useCallback(async (): Promise<Estado> => {
    const r = await ADAPTADORES[recurso].pedir();
    const nuevo = aEstado(r);
    setEstado(nuevo);
    setParcial(r.parcial);
    return nuevo;
  }, [recurso]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  // Consulta al entrar a la pantalla y cada vez que vuelve a tener foco.
  useFocusEffect(
    useCallback(() => {
      revisar();
    }, [revisar]),
  );

  // Consulta al volver de Ajustes.
  useRevisarAlVolver(revisar);

  return { estado, parcial, pedir, abrirAjustes, revisar };
}
