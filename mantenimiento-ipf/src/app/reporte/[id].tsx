import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto, Titulo, Vacio } from '../../components/ui';
import { CATEGORIAS } from '../../constants/permisos';
import { colorEstado, tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { fechaCorta, textoUbicacion } from '../../lib/formato';
import { programarAviso } from '../../lib/notificaciones';
import { useStore } from '../../lib/store';

export default function DetalleReporte() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { reportes, cambiarEstado, agregarAviso, avisarResolucion } = useStore();
  const notif = usePermiso('notificaciones');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const reporte = reportes.find((r) => r.id === id);

  // Validar el id: si no existe, mostramos un mensaje en lugar de romper.
  if (!reporte) {
    return (
      <Pantalla>
        <Vacio
          icono="alert-circle-outline"
          titulo="No encontramos este reporte"
          texto="Puede que se haya borrado o que el enlace esté mal."
        />
        <Boton titulo="Volver al inicio" onPress={() => router.replace('/')} />
      </Pantalla>
    );
  }

  const cat = CATEGORIAS.find((c) => c.id === reporte.categoria);
  const color = colorEstado[reporte.estado];

  async function simularResolucion() {
    if (!reporte) return;
    cambiarEstado(reporte.id, 'resuelto');
    // El aviso siempre queda en la bandeja de la app (alternativa a las notificaciones).
    agregarAviso('Reporte resuelto', `Ya resolvimos: ${reporte.titulo}`);

    if (avisarResolucion && notif.estado === 'concedido') {
      await programarAviso('Reporte resuelto', `Ya resolvimos: ${reporte.titulo}`, 10);
      setMensaje('Listo. En 10 segundos te llega una notificación.');
    } else {
      setMensaje('Listo. El aviso quedó en la pestaña Avisos.');
    }
  }

  return (
    <Pantalla
      pie={
        <Boton
          titulo="Simular resolución"
          icono="checkmark-circle-outline"
          onPress={simularResolucion}
          deshabilitado={reporte.estado === 'resuelto'}
        />
      }
    >
      <Etiqueta texto={reporte.estado} fondo={color.fondo} color={color.texto} />
      <Titulo>{reporte.titulo}</Titulo>
      {reporte.descripcion ? <Texto>{reporte.descripcion}</Texto> : null}

      {reporte.foto ? <Image source={{ uri: reporte.foto }} style={estilos.foto} /> : null}

      <Tarjeta>
        <Fila rotulo="Aula" valor={reporte.aula || 'Sin aula'} />
        <Fila rotulo="Categoría" valor={cat?.nombre ?? '-'} />
        <Fila rotulo="Ubicación" valor={textoUbicacion(reporte.ubicacion)} />
        <Fila rotulo="Creado" valor={fechaCorta(reporte.creado)} />
      </Tarjeta>

      {mensaje ? <Texto suave>{mensaje}</Texto> : null}
    </Pantalla>
  );
}

function Fila({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <Text style={estilos.fila}>
      <Text style={{ color: tema.textoSuave }}>{rotulo}: </Text>
      {valor}
    </Text>
  );
}

const estilos = StyleSheet.create({
  foto: { width: '100%', height: 220, borderRadius: tema.radio, backgroundColor: tema.borde },
  fila: { fontSize: 15, color: tema.texto, fontWeight: '600' },
});
