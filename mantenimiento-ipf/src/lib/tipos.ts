export type Categoria = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';
export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export type Ubicacion =
  | { tipo: 'gps'; latitud: number; longitud: number; aproximada: boolean }
  | { tipo: 'sector'; sector: string };

export type Reporte = {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: Categoria;
  estado: EstadoReporte;
  foto?: string;
  ubicacion?: Ubicacion;
  creado: number;
};

export type Borrador = Omit<Reporte, 'id' | 'estado' | 'creado'>;

export type Aviso = {
  id: string;
  titulo: string;
  texto: string;
  fecha: number;
  leido: boolean;
};
