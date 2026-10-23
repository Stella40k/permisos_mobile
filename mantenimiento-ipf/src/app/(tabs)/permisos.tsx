import { Ionicons } from '@expo/vector-icons';
import { Platform, Text, View } from 'react-native';
import { Boton, Etiqueta, Pantalla, Tarjeta, Texto } from '../../components/ui';
import { RECURSOS, type Recurso } from '../../constants/permisos';
import { tema } from '../../constants/tema';
import { usePermiso } from '../../hooks/usePermiso';
import type { Estado } from '../../lib/permisos';
import { abrirPrevia } from '../../lib/previa';

const ETIQUETA: Record<Estado, { texto: string; fondo: string; color: string }> = {
  cargando: { texto: 'Consultando', fondo: tema.borde, color: tema.textoSuave },
  concedido: { texto: 'Concedido', fondo: tema.exitoSuave, color: tema.exito },
  preguntable: { texto: 'Se puede pedir', fondo: tema.avisoSuave, color: tema.aviso },
  bloqueado: { texto: 'Bloqueado', fondo: tema.peligroSuave, color: tema.peligro },
};

const ORDEN: Recurso[] = ['camara', 'ubicacion', 'notificaciones'];

export default function PanelPermisos() {
  // Tres recursos fijos: los hooks se llaman siempre en el mismo orden.
  const permisos = {
    camara: usePermiso('camara'),
    ubicacion: usePermiso('ubicacion'),
    notificaciones: usePermiso('notificaciones'),
  };

  return (
    <Pantalla>
      <Texto suave>
        Estado real de cada permiso en este dispositivo. Plataforma: {Platform.OS}. Se actualiza
        solo al volver de Ajustes.
      </Texto>

      {ORDEN.map((recurso) => {
        const r = RECURSOS[recurso];
        const p = permisos[recurso];
        const et = ETIQUETA[p.estado];
        return (
          <Tarjeta key={recurso}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={r.icono} size={24} color={tema.primario} />
              <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: tema.texto }}>{r.nombre}</Text>
              <Etiqueta texto={et.texto} fondo={et.fondo} color={et.color} />
            </View>
            {p.parcial ? <Etiqueta texto={p.parcial} fondo={tema.avisoSuave} color={tema.aviso} /> : null}
            <Texto suave>{r.alternativa}</Texto>
            {p.estado === 'preguntable' ? (
              <Boton titulo="Pedir permiso" onPress={() => abrirPrevia(recurso)} />
            ) : null}
            {p.estado === 'bloqueado' ? (
              <Boton titulo="Abrir Ajustes" icono="settings-outline" onPress={p.abrirAjustes} />
            ) : null}
            {p.estado === 'concedido' ? (
              <Boton titulo="Cambiar en Ajustes" variante="texto" onPress={p.abrirAjustes} />
            ) : null}
          </Tarjeta>
        );
      })}

      <Tarjeta>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="images-outline" size={24} color={tema.primario} />
          <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: tema.texto }}>Galería de fotos</Text>
          <Etiqueta texto="Sin permiso" fondo={tema.exitoSuave} color={tema.exito} />
        </View>
        <Texto suave>
          Para elegir una foto usamos el selector del sistema, que no necesita permiso de galería.
        </Texto>
      </Tarjeta>
    </Pantalla>
  );
}
