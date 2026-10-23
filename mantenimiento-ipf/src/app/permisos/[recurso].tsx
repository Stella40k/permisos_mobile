// Pantalla previa al dialogo del sistema (modal).
// Un solo boton "Continuar". Si el permiso esta bloqueado, el boton pasa a "Abrir Ajustes".
import { Stack, router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PantallaBloqueada, PantallaPrevia } from '../../components/PantallaPrevia';
import { Boton, Texto } from '../../components/ui';
import { RECURSOS, type Recurso } from '../../constants/permisos';
import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import { cerrarPrevia } from '../../lib/previa';

export default function PermisoPrevio() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  if (!recurso || !(recurso in RECURSOS)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 12, backgroundColor: tema.fondo }}>
        <Texto>Ese permiso no existe.</Texto>
        <Boton titulo="Volver" onPress={() => router.back()} />
      </View>
    );
  }
  return <Previa recurso={recurso as Recurso} />;
}

function Previa({ recurso }: { recurso: Recurso }) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const navigation = useNavigation();
  const [pidiendo, setPidiendo] = useState(false);
  const cerrado = useRef(false);

  const cerrar = useCallback((concedido: boolean) => {
    if (cerrado.current) return;
    cerrado.current = true;
    cerrarPrevia(concedido);
    router.back();
  }, []);

  // Si ya esta concedido (por ejemplo al volver de Ajustes), se cierra sola.
  useEffect(() => {
    if (estado === 'concedido') cerrar(true);
  }, [estado, cerrar]);

  // Si la persona sale sin decidir (boton atras de Android), la pantalla que llamo recibe "false".
  useEffect(() => navigation.addListener('beforeRemove', () => cerrarPrevia(false)), [navigation]);

  async function continuar() {
    setPidiendo(true);
    const resultado = await pedir(); // aca aparece el dialogo del sistema
    setPidiendo(false);
    cerrar(resultado === 'concedido');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: tema.fondo }}>
      {/* En estado normal no se puede cerrar con gesto; si esta bloqueado, si. */}
      <Stack.Screen options={{ gestureEnabled: estado === 'bloqueado' }} />
      {estado === 'cargando' || estado === 'concedido' ? (
        <ActivityIndicator color={tema.primario} />
      ) : null}
      {estado === 'preguntable' ? (
        <PantallaPrevia recurso={recurso} onContinuar={continuar} cargando={pidiendo} />
      ) : null}
      {estado === 'bloqueado' ? <PantallaBloqueada recurso={recurso} onAjustes={abrirAjustes} /> : null}
    </View>
  );
}
