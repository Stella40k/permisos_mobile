import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Tarjeta, Vacio } from '../../components/ui';
import { tema } from '../../constants/tema';
import { fechaCorta } from '../../lib/formato';
import { useStore } from '../../lib/store';

export default function Avisos() {
  const { avisos, marcarAvisosLeidos } = useStore();

  // Al salir de la pestaña, los avisos quedan como leidos.
  useFocusEffect(
    useCallback(() => {
      return () => marcarAvisosLeidos();
    }, [marcarAvisosLeidos]),
  );

  return (
    <FlatList
      data={avisos}
      keyExtractor={(a) => a.id}
      contentContainerStyle={estilos.lista}
      ListEmptyComponent={
        <Vacio
          icono="notifications-off-outline"
          titulo="Sin avisos por ahora"
          texto="Cuando resuelvan uno de tus reportes, el aviso aparece acá, aunque no uses notificaciones."
        />
      }
      renderItem={({ item }) => (
        <Tarjeta style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={[estilos.punto, item.leido && { backgroundColor: tema.borde }]} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={estilos.titulo}>{item.titulo}</Text>
            <Text style={estilos.texto}>{item.texto}</Text>
            <Text style={estilos.fecha}>{fechaCorta(item.fecha)}</Text>
          </View>
        </Tarjeta>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  lista: { padding: tema.espacio, gap: 12 },
  punto: { width: 10, height: 10, borderRadius: 5, backgroundColor: tema.primario, marginTop: 6 },
  titulo: { fontSize: 16, fontWeight: '600', color: tema.texto },
  texto: { fontSize: 14, color: tema.texto },
  fecha: { fontSize: 12, color: tema.textoSuave },
});
