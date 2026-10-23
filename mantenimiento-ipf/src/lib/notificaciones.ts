import * as Notifications from 'expo-notifications';

// Que hacer cuando llega una notificacion con la app abierta.
export function configurarNotificaciones() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function programarAviso(titulo: string, cuerpo: string, segundos = 10) {
  return Notifications.scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      channelId: 'reportes',
    },
  });
}
