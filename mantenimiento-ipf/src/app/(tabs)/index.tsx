import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Boton, Vacio } from '../../components/ui';
import { TarjetaReporte } from '../../components/TarjetaReporte';
import { colorEstado, tema } from '../../constants/tema';
import { useStore } from '../../lib/store';
import type { EstadoReporte } from '../../lib/tipos';

const ESTADOS: EstadoReporte[] = ['pendiente', 'en curso', 'resuelto'];

export default function Inicio() {
  const { reportes, limpiarBorrador } = useStore();

  return (
    <View style={estilos.pantalla}>
      <FlatList
        data={reportes}
        keyExtractor={(r) => r.id}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <View style={estilos.resumen}>
            {ESTADOS.map((e) => (
              <View key={e} style={[estilos.resumenItem, { backgroundColor: colorEstado[e].fondo }]}>
                <Text style={[estilos.numero, { color: colorEstado[e].texto }]}>
                  {reportes.filter((r) => r.estado === e).length}
                </Text>
                <Text style={[estilos.rotulo, { color: colorEstado[e].texto }]}>{e}</Text>
              </View>
            ))}
          </View>
        }
        ListEmptyComponent={
          <Vacio
            icono="clipboard-outline"
            titulo="Todavía no hay reportes"
            texto="Cuando reportes un desperfecto lo vas a ver acá con su estado."
          />
        }
        renderItem={({ item }) => (
          <TarjetaReporte reporte={item} onPress={() => router.push(`/reporte/${item.id}`)} />
        )}
      />
      <View style={estilos.pie}>
        <Boton
          titulo="Nuevo reporte"
          icono="add-circle-outline"
          onPress={() => {
            limpiarBorrador();
            router.push('/reporte/nuevo');
          }}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: tema.fondo },
  lista: { padding: tema.espacio, gap: 12 },
  resumen: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  resumenItem: { flex: 1, borderRadius: tema.radio, padding: 12, alignItems: 'center' },
  numero: { fontSize: 24, fontWeight: '800' },
  rotulo: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  pie: { padding: tema.espacio, backgroundColor: tema.tarjeta, borderTopWidth: 1, borderTopColor: tema.borde },
});
