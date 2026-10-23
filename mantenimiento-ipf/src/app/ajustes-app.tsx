import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { Pantalla, Tarjeta, Texto } from '../components/ui';
import { tema } from '../constants/tema';
import { usePermiso } from '../hooks/usePermiso';
import { abrirPrevia } from '../lib/previa';
import { useStore } from '../lib/store';

export default function AjustesApp() {
  const notif = usePermiso('notificaciones');
  const { avisarResolucion, setAvisarResolucion } = useStore();
  const [nota, setNota] = useState<string | null>(null);

  // El interruptor solo cuenta como activo si ademas tenemos el permiso.
  const activo = avisarResolucion && notif.estado === 'concedido';

  async function alCambiar(valor: boolean) {
    setNota(null);
    if (!valor) {
      setAvisarResolucion(false);
      return;
    }
    // El permiso se pide recien aca, al activar el interruptor.
    const ok = notif.estado === 'concedido' || (await abrirPrevia('notificaciones'));
    setAvisarResolucion(ok);
    if (!ok) {
      setNota('Sin permiso no mandamos notificaciones, pero los avisos igual llegan a la pestaña Avisos.');
    }
  }

  return (
    <Pantalla>
      <Tarjeta>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: tema.texto }}>
              Avisarme cuando se resuelva mi reporte
            </Text>
            <Texto suave>Te mandamos una notificación cuando cambie el estado.</Texto>
          </View>
          <Switch
            value={activo}
            onValueChange={alCambiar}
            trackColor={{ true: tema.primario, false: tema.borde }}
          />
        </View>
      </Tarjeta>
      {nota ? <Texto suave>{nota}</Texto> : null}
      {notif.estado === 'bloqueado' && !activo ? (
        <Texto suave>Las notificaciones están bloqueadas. Podés habilitarlas desde la pestaña Permisos.</Texto>
      ) : null}
    </Pantalla>
  );
}
