// Estado de la app en memoria (sin base de datos, para mantenerlo simple).
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Aviso, Borrador, EstadoReporte, Reporte } from './tipos';

const BORRADOR_VACIO: Borrador = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: 'electricidad',
};

const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const REPORTES_INICIALES: Reporte[] = [
  {
    id: 'demo1',
    titulo: 'Luz quemada en el pasillo',
    descripcion: 'Dos tubos no encienden desde el lunes.',
    aula: 'Aula 12',
    categoria: 'electricidad',
    estado: 'en curso',
    ubicacion: { tipo: 'sector', sector: 'Pasillo' },
    creado: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'demo2',
    titulo: 'Canilla que pierde',
    descripcion: 'Gotea sin parar en el baño del primer piso.',
    aula: 'Baños PB',
    categoria: 'agua',
    estado: 'pendiente',
    creado: Date.now() - 1000 * 60 * 60 * 3,
  },
];

type Contexto = {
  reportes: Reporte[];
  borrador: Borrador;
  avisos: Aviso[];
  avisarResolucion: boolean;
  editarBorrador: (cambios: Partial<Borrador>) => void;
  enviarBorrador: () => string;
  limpiarBorrador: () => void;
  cambiarEstado: (id: string, estado: EstadoReporte) => void;
  agregarAviso: (titulo: string, texto: string) => void;
  marcarAvisosLeidos: () => void;
  setAvisarResolucion: (valor: boolean) => void;
};

const StoreContext = createContext<Contexto | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>(REPORTES_INICIALES);
  const [borrador, setBorrador] = useState<Borrador>(BORRADOR_VACIO);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [avisarResolucion, setAvisarResolucion] = useState(false);

  const editarBorrador = useCallback((cambios: Partial<Borrador>) => {
    setBorrador((actual) => ({ ...actual, ...cambios }));
  }, []);

  const enviarBorrador = useCallback(() => {
    const id = nuevoId();
    setReportes((lista) => [
      { ...borrador, id, estado: 'pendiente', creado: Date.now() },
      ...lista,
    ]);
    setBorrador(BORRADOR_VACIO);
    return id;
  }, [borrador]);

  const limpiarBorrador = useCallback(() => setBorrador(BORRADOR_VACIO), []);

  const cambiarEstado = useCallback((id: string, estado: EstadoReporte) => {
    setReportes((lista) => lista.map((r) => (r.id === id ? { ...r, estado } : r)));
  }, []);

  const agregarAviso = useCallback((titulo: string, texto: string) => {
    setAvisos((lista) => [
      { id: nuevoId(), titulo, texto, fecha: Date.now(), leido: false },
      ...lista,
    ]);
  }, []);

  const marcarAvisosLeidos = useCallback(() => {
    setAvisos((lista) => (lista.some((a) => !a.leido) ? lista.map((a) => ({ ...a, leido: true })) : lista));
  }, []);

  const valor = useMemo(
    () => ({
      reportes,
      borrador,
      avisos,
      avisarResolucion,
      editarBorrador,
      enviarBorrador,
      limpiarBorrador,
      cambiarEstado,
      agregarAviso,
      marcarAvisosLeidos,
      setAvisarResolucion,
    }),
    [reportes, borrador, avisos, avisarResolucion, editarBorrador, enviarBorrador, limpiarBorrador, cambiarEstado, agregarAviso, marcarAvisosLeidos],
  );

  return <StoreContext.Provider value={valor}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider');
  return ctx;
}
