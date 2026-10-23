import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Boton, Pantalla, Tarjeta, Texto } from '../../components/ui';
import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { abrirPrevia } from '../../lib/previa';
import { useStore } from '../../lib/store';

export default function Foto() {
  const camara = usePermiso('camara');
  const { borrador, editarBorrador } = useStore();
  const [aviso, setAviso] = useState<string | null>(null);

  async function sacarFoto() {
    setAviso(null);
    // Sacar una foto SI necesita permiso de camara. Se pide recien al tocar el boton.
    const ok = camara.estado === 'concedido' || (await abrirPrevia('camara'));
    if (!ok) {
      setAviso('Sin permiso de cámara no podemos sacar la foto. Podés elegirla de la galería.');
      return;
    }
    const r = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!r.canceled) editarBorrador({ foto: r.assets[0].uri });
  }

  async function elegirDeGaleria() {
    setAviso(null);
    // Selector del sistema: no necesita ningun permiso de galeria.
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!r.canceled) editarBorrador({ foto: r.assets[0].uri });
  }

  return (
    <Pantalla pie={borrador.foto ? <Boton titulo="Listo" onPress={() => router.back()} /> : undefined}>
      {borrador.foto ? (
        <Image source={{ uri: borrador.foto }} style={estilos.foto} />
      ) : (
        <Tarjeta>
          <Texto suave>Todavía no adjuntaste ninguna foto.</Texto>
        </Tarjeta>
      )}
      <Boton titulo="Sacar foto" icono="camera-outline" onPress={sacarFoto} />
      <Boton titulo="Elegir de la galería" icono="images-outline" variante="secundario" onPress={elegirDeGaleria} />
      {aviso ? <Texto suave>{aviso}</Texto> : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  foto: { width: '100%', height: 260, borderRadius: tema.radio, backgroundColor: tema.borde },
});
