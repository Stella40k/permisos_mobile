import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto } from '../../components/ui';
import { SECTORES } from '../../constants/permisos';
import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { abrirPrevia } from '../../lib/previa';
import { useStore } from '../../lib/store';
import { obtenerUbicacion, type Posicion } from '../../lib/ubicacion';

export default function Ubicacion() {
  const permiso = usePermiso('ubicacion');
  const { editarBorrador } = useStore();
  const [pos, setPos] = useState<Posicion | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  async function usarMiUbicacion() {
    setAviso(null);
    const ok = permiso.estado === 'concedido' || (await abrirPrevia('ubicacion'));
    if (!ok) {
      setAviso('Sin permiso de ubicación no hay problema: elegí el sector a mano.');
      return;
    }
    setBuscando(true);
    const p = await obtenerUbicacion();
    setBuscando(false);
    if (p) setPos(p);
    else setAviso('No pudimos obtener tu ubicación. Elegí el sector a mano.');
  }

  function confirmarGps() {
    if (!pos) return;
    editarBorrador({ ubicacion: { tipo: 'gps', ...pos } });
    router.back();
  }

  function elegirSector(sector: string) {
    editarBorrador({ ubicacion: { tipo: 'sector', sector } });
    router.back();
  }

  return (
    <Pantalla>
      <Tarjeta>
        <Text style={estilos.subtitulo}>Ubicación actual</Text>
        {pos ? (
          <>
            <Text style={estilos.dato}>
              {pos.aproximada
                ? 'Ubicación aproximada'
                : `${pos.latitud.toFixed(5)}, ${pos.longitud.toFixed(5)}`}
            </Text>
            {pos.aproximada ? (
              <Texto suave>Elegiste compartir solo una zona, no el punto exacto.</Texto>
            ) : null}
            <Boton titulo="Usar esta ubicación" onPress={confirmarGps} />
          </>
        ) : (
          <Boton
            titulo="Usar mi ubicación"
            icono="location-outline"
            onPress={usarMiUbicacion}
            cargando={buscando}
          />
        )}
        {permiso.parcial ? <Etiqueta texto={permiso.parcial} /> : null}
        {aviso ? <Texto suave>{aviso}</Texto> : null}
      </Tarjeta>

      <Tarjeta>
        <Text style={estilos.subtitulo}>O elegí el sector a mano</Text>
        <View style={estilos.sectores}>
          {SECTORES.map((s) => (
            <Pressable key={s} onPress={() => elegirSector(s)} style={estilos.chip}>
              <Text style={estilos.chipTexto}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  subtitulo: { fontSize: 13, fontWeight: '700', color: tema.textoSuave, textTransform: 'uppercase' },
  dato: { fontSize: 20, fontWeight: '700', color: tema.texto },
  sectores: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: tema.primarioSuave,
  },
  chipTexto: { color: tema.primario, fontWeight: '600', fontSize: 15 },
});
