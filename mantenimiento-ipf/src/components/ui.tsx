// Piezas visuales reutilizables. Todo el aspecto de la app sale de aca y de constants/tema.ts.
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { tema } from '../constants/tema';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

export function Pantalla({
  children,
  pie,
  scroll = true,
}: {
  children: ReactNode;
  pie?: ReactNode;
  scroll?: boolean;
}) {
  return (
    <View style={estilos.pantalla}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={estilos.contenido}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={estilos.contenido}>{children}</View>
      )}
      {pie ? <View style={estilos.pie}>{pie}</View> : null}
    </View>
  );
}

export function Titulo({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[estilos.titulo, style]}>{children}</Text>;
}

export function Texto({
  children,
  suave,
  style,
}: {
  children: ReactNode;
  suave?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[estilos.texto, suave && { color: tema.textoSuave }, style]}>{children}</Text>;
}

export function Tarjeta({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [estilos.tarjeta, style, pressed && { opacity: 0.85 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[estilos.tarjeta, style]}>{children}</View>;
}

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  icono,
  deshabilitado,
  cargando,
}: {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'texto' | 'peligro';
  icono?: NombreIcono;
  deshabilitado?: boolean;
  cargando?: boolean;
}) {
  const colorTexto =
    variante === 'primario' || variante === 'peligro' ? '#FFFFFF' : tema.primario;
  const fondo =
    variante === 'primario'
      ? tema.primario
      : variante === 'peligro'
        ? tema.peligro
        : variante === 'secundario'
          ? tema.primarioSuave
          : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado || cargando}
      style={({ pressed }) => [
        estilos.boton,
        { backgroundColor: fondo },
        (deshabilitado || cargando) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <>
          {icono ? <Ionicons name={icono} size={20} color={colorTexto} /> : null}
          <Text style={[estilos.botonTexto, { color: colorTexto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Etiqueta({
  texto,
  fondo = tema.primarioSuave,
  color = tema.primario,
}: {
  texto: string;
  fondo?: string;
  color?: string;
}) {
  return (
    <View style={[estilos.etiqueta, { backgroundColor: fondo }]}>
      <Text style={[estilos.etiquetaTexto, { color }]}>{texto}</Text>
    </View>
  );
}

export function Campo({ etiqueta, ...props }: { etiqueta: string } & TextInputProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={estilos.etiquetaCampo}>{etiqueta}</Text>
      <TextInput
        placeholderTextColor={tema.textoSuave}
        {...props}
        style={[estilos.input, props.multiline && { height: 96, textAlignVertical: 'top' }, props.style]}
      />
    </View>
  );
}

export function Vacio({
  icono,
  titulo,
  texto,
}: {
  icono: NombreIcono;
  titulo: string;
  texto: string;
}) {
  return (
    <View style={estilos.vacio}>
      <View style={estilos.vacioIcono}>
        <Ionicons name={icono} size={32} color={tema.primario} />
      </View>
      <Text style={estilos.vacioTitulo}>{titulo}</Text>
      <Text style={[estilos.texto, { color: tema.textoSuave, textAlign: 'center' }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: tema.fondo },
  contenido: { padding: tema.espacio, gap: 14, flexGrow: 1 },
  pie: {
    padding: tema.espacio,
    gap: 10,
    backgroundColor: tema.tarjeta,
    borderTopWidth: 1,
    borderTopColor: tema.borde,
  },
  titulo: { fontSize: 22, fontWeight: '700', color: tema.texto },
  texto: { fontSize: 15, lineHeight: 22, color: tema.texto },
  tarjeta: {
    backgroundColor: tema.tarjeta,
    borderRadius: tema.radio,
    padding: tema.espacio,
    borderWidth: 1,
    borderColor: tema.borde,
    gap: 8,
  },
  boton: {
    minHeight: 50,
    borderRadius: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botonTexto: { fontSize: 16, fontWeight: '600' },
  etiqueta: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  etiquetaTexto: { fontSize: 12, fontWeight: '700' },
  etiquetaCampo: { fontSize: 13, fontWeight: '600', color: tema.textoSuave },
  input: {
    backgroundColor: tema.tarjeta,
    borderWidth: 1,
    borderColor: tema.borde,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: tema.texto,
  },
  vacio: { alignItems: 'center', gap: 8, paddingVertical: 48, paddingHorizontal: 24 },
  vacioIcono: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tema.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacioTitulo: { fontSize: 18, fontWeight: '700', color: tema.texto },
});
