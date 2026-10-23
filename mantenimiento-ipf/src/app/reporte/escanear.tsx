import { CameraView, type BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { EntradaAula } from '../../components/EntradaAula';
import { PantallaBloqueada, PantallaPrevia } from '../../components/PantallaPrevia';
import { Boton, Pantalla } from '../../components/ui';
import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { useStore } from '../../lib/store';

export default function Escanear() {
  const { estado, pedir, abrirAjustes } = usePermiso('camara');
  const { editarBorrador } = useStore();
  const [manual, setManual] = useState(false);
  const yaLeyo = useRef(false);

  function guardar(aula: string) {
    editarBorrador({ aula });
    router.back();
  }

  function alEscanear({ data }: BarcodeScanningResult) {
    if (yaLeyo.current) return;
    yaLeyo.current = true;
    guardar(data.trim());
  }

  // 1. Cargando
  if (estado === 'cargando') {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={tema.primario} />
      </View>
    );
  }

  // 2. Concedido
  if (estado === 'concedido') {
    if (manual) {
      return (
        <Pantalla>
          <EntradaAula onGuardar={guardar} />
          <Boton titulo="Volver a la cámara" variante="texto" onPress={() => setManual(false)} />
        </Pantalla>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={alEscanear}
        />
        <View style={estilos.overlay} pointerEvents="box-none">
          <View style={estilos.marco} />
          <Text style={estilos.ayuda}>Apuntá al QR de la puerta del aula</Text>
          <Boton titulo="Escribir a mano" variante="secundario" onPress={() => setManual(true)} />
        </View>
      </View>
    );
  }

  // 3. Preguntable  /  4. Bloqueado (siempre con la alternativa de escribir a mano)
  return (
    <Pantalla>
      {estado === 'preguntable' ? (
        <PantallaPrevia recurso="camara" onContinuar={() => pedir()} />
      ) : (
        <PantallaBloqueada recurso="camara" onAjustes={abrirAjustes} />
      )}
      <EntradaAula onGuardar={guardar} />
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: tema.fondo },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  marco: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ayuda: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
