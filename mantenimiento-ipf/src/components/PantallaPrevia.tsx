// Pantalla previa al dialogo del sistema y aviso de permiso bloqueado.
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';
import { RECURSOS, type Recurso } from '../constants/permisos';
import { tema } from '../constants/tema';
import { Boton, Texto, Titulo } from './ui';

export function PantallaPrevia({
  recurso,
  onContinuar,
  cargando,
}: {
  recurso: Recurso;
  onContinuar: () => void;
  cargando?: boolean;
}) {
  const r = RECURSOS[recurso];
  return (
    <View style={estilos.caja}>
      <View style={estilos.icono}>
        <Ionicons name={r.icono} size={40} color={tema.primario} />
      </View>
      <Titulo style={estilos.centrado}>{r.titulo}</Titulo>
      <Texto style={estilos.centrado}>{r.beneficio}</Texto>
      {/* Un solo boton, sin "Ahora no" ni "Cerrar" (pauta 5.1.1(iv) de Apple). */}
      <Boton titulo="Continuar" onPress={onContinuar} cargando={cargando} />
      <Texto suave style={estilos.centrado}>
        Podés cambiarlo cuando quieras en Ajustes.
      </Texto>
    </View>
  );
}

export function PantallaBloqueada({
  recurso,
  onAjustes,
}: {
  recurso: Recurso;
  onAjustes: () => void;
}) {
  const r = RECURSOS[recurso];
  const camino = Platform.OS === 'ios' ? r.ajustesIos : r.ajustesAndroid;
  return (
    <View style={estilos.caja}>
      <View style={[estilos.icono, { backgroundColor: tema.peligroSuave }]}>
        <Ionicons name="lock-closed-outline" size={36} color={tema.peligro} />
      </View>
      <Titulo style={estilos.centrado}>{r.nombre} bloqueada</Titulo>
      <Texto style={estilos.centrado}>
        El permiso está bloqueado, así que el sistema ya no muestra el diálogo. Para habilitarlo
        andá a:
      </Texto>
      <Texto style={[estilos.centrado, { fontWeight: '600' }]}>{camino}</Texto>
      <Texto suave style={estilos.centrado}>{r.alternativa}</Texto>
      <Boton titulo="Abrir Ajustes" icono="settings-outline" onPress={onAjustes} />
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { alignItems: 'stretch', gap: 14, padding: tema.espacio },
  icono: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tema.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centrado: { textAlign: 'center' },
});
