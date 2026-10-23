import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Boton, Campo, Pantalla, Tarjeta, Texto } from '../../components/ui';
import { CATEGORIAS } from '../../constants/permisos';
import { tema } from '../../constants/tema';
import { textoUbicacion } from '../../lib/formato';
import { useStore } from '../../lib/store';

export default function NuevoReporte() {
  const { borrador, editarBorrador, enviarBorrador } = useStore();
  const completo = borrador.titulo.trim().length > 0 && borrador.aula.trim().length > 0;

  function enviar() {
    const id = enviarBorrador();
    router.replace(`/reporte/${id}`);
  }

  return (
    <Pantalla pie={<Boton titulo="Enviar reporte" onPress={enviar} deshabilitado={!completo} />}>
      {/* Esta pantalla no pide ningun permiso al abrirse. Cada uno se pide al tocar su boton. */}
      <Campo
        etiqueta="Título"
        placeholder="Ej: Proyector sin imagen"
        value={borrador.titulo}
        onChangeText={(titulo) => editarBorrador({ titulo })}
      />
      <Campo
        etiqueta="Descripción"
        placeholder="Contanos qué pasa"
        multiline
        value={borrador.descripcion}
        onChangeText={(descripcion) => editarBorrador({ descripcion })}
      />

      <Text style={estilos.etiqueta}>Categoría</Text>
      <View style={estilos.categorias}>
        {CATEGORIAS.map((c) => {
          const activa = borrador.categoria === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => editarBorrador({ categoria: c.id })}
              style={[estilos.chip, activa && estilos.chipActivo]}
            >
              <Ionicons name={c.icono} size={18} color={activa ? '#FFFFFF' : tema.primario} />
              <Text style={[estilos.chipTexto, activa && { color: '#FFFFFF' }]}>{c.nombre}</Text>
            </Pressable>
          );
        })}
      </View>

      <Campo
        etiqueta="Aula"
        placeholder="Ej: Aula 12"
        value={borrador.aula}
        onChangeText={(aula) => editarBorrador({ aula })}
      />
      <Boton
        titulo="Escanear QR del aula"
        icono="qr-code-outline"
        variante="secundario"
        onPress={() => router.push('/reporte/escanear')}
      />

      <Tarjeta>
        <Boton
          titulo={borrador.foto ? 'Cambiar foto' : 'Adjuntar foto'}
          icono="camera-outline"
          variante="secundario"
          onPress={() => router.push('/reporte/foto')}
        />
        {borrador.foto ? <Image source={{ uri: borrador.foto }} style={estilos.foto} /> : null}
      </Tarjeta>

      <Tarjeta>
        <Boton
          titulo="Marcar ubicación"
          icono="location-outline"
          variante="secundario"
          onPress={() => router.push('/reporte/ubicacion')}
        />
        <Texto suave>{textoUbicacion(borrador.ubicacion)}</Texto>
      </Tarjeta>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  etiqueta: { fontSize: 13, fontWeight: '600', color: tema.textoSuave },
  categorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: tema.primarioSuave,
  },
  chipActivo: { backgroundColor: tema.primario },
  chipTexto: { color: tema.primario, fontWeight: '600' },
  foto: { width: '100%', height: 180, borderRadius: 12 },
});
