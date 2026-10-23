import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS } from '../constants/permisos';
import { colorEstado, tema } from '../constants/tema';
import type { Reporte } from '../lib/tipos';
import { Etiqueta, Tarjeta } from './ui';

export function TarjetaReporte({ reporte, onPress }: { reporte: Reporte; onPress: () => void }) {
  const cat = CATEGORIAS.find((c) => c.id === reporte.categoria);
  const color = colorEstado[reporte.estado];
  return (
    <Tarjeta onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={estilos.icono}>
        <Ionicons name={cat?.icono ?? 'build-outline'} size={22} color={tema.primario} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={estilos.titulo} numberOfLines={1}>
          {reporte.titulo}
        </Text>
        <Text style={estilos.detalle} numberOfLines={1}>
          {reporte.aula || 'Sin aula'} · {cat?.nombre}
        </Text>
      </View>
      <Etiqueta texto={reporte.estado} fondo={color.fondo} color={color.texto} />
    </Tarjeta>
  );
}

const estilos = StyleSheet.create({
  icono: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: tema.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontSize: 16, fontWeight: '600', color: tema.texto },
  detalle: { fontSize: 13, color: tema.textoSuave },
});
