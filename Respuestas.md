# Trabajo Práctico N° 3 - Permisos móviles: Android, iOS y Expo

Tecnicatura Superior en Desarrollo de Software Multiplataforma - Instituto Politécnico Formosa
Taller Complementario - React Native II

Alumno/a: Stella Bernard
Fecha de entrega: 23/10/2026

Respuestas de las Partes A a F.

---

## Parte A - ¿Qué es un permiso y por qué existe?

### A1. Conceptos

**a) ¿Qué es un permiso? ¿Qué papel cumplen la app, el sistema operativo y la persona usuaria?**

Un permiso es la autorización que la persona usuaria le da a una app para usar un recurso sensible del dispositivo, como la cámara, el micrófono, la ubicación, las fotos, los contactos o las notificaciones.

- La app declara qué recursos podría usar y, cuando los necesita, pide acceso.
- El sistema operativo muestra el diálogo oficial, guarda la decisión y hace que se cumpla.
- La persona usuaria acepta, rechaza o da un acceso parcial. Después puede cambiar de idea desde Ajustes.

**b) ¿Qué es la caja de arena (sandbox) y qué relación tiene con los permisos? ¿Qué puede hacer una app sin ningún permiso?**

Cada app vive en su propia caja de arena, que es un espacio aislado donde solo ve sus propios archivos. Para salir de esa caja y tocar algo sensible necesita un permiso, y ese permiso solo lo puede dar la persona usuaria.

Sin ningún permiso una app puede mostrar pantallas, guardar sus propios datos y conectarse a internet.

**c) Las cuatro razones por las que existen los permisos, con un ejemplo de cada una.**

1. Privacidad: la ubicación, las fotos o la voz no salen del dispositivo sin que la persona esté de acuerdo. Por ejemplo, una linterna no puede leer tus fotos.
2. Seguridad: si una app maliciosa se cuela, el daño queda limitado a lo que se le permitió. Por ejemplo, si la app no tiene permiso de contactos, no puede copiar la agenda.
3. Transparencia: el sistema muestra qué app usa qué recurso. Por ejemplo, el punto verde o naranja que indica que la cámara o el micrófono están en uso.
4. Control: la decisión no es para siempre y se puede revocar. Por ejemplo, entrar a Ajustes y sacarle la ubicación a una app que ya no usamos.

**d) La analogía del portero del edificio.**

- La visita es la app, que quiere subir a un departamento (por ejemplo, usar la cámara).
- El portero es el sistema operativo, que no deja pasar a nadie solo y llama al dueño.
- El dueño del departamento es la persona usuaria, que decide si la deja pasar o no.

Que "el portero se acuerda de la respuesta" quiere decir que el sistema guarda la decisión. La app no tiene que volver a preguntar cada vez, y si la respuesta fue que no, el sistema la sigue aplicando hasta que la persona la cambie en Ajustes.

### A2. Declarar y solicitar

| | Declarar (al compilar) | Solicitar (al ejecutar) |
|---|---|---|
| ¿Qué se hace? | Se le avisa al sistema qué recursos podría usar la app. Queda escrito dentro del paquete que se instala. | Cuando la persona usa la función, el código pide acceso y el sistema muestra el diálogo. |
| ¿Dónde / cómo en Android? | Una línea `<uses-permission>` en el `AndroidManifest.xml`. | Solo hace falta para los permisos de tiempo de ejecución. Se pide con un diálogo mientras se usa la app. |
| ¿Dónde / cómo en iOS? | Un texto de propósito (clave `NS...UsageDescription`) en el `Info.plist`. | Se pide para cada recurso protegido, y el diálogo muestra el texto de propósito. |
| ¿Dónde / cómo en Expo? | En `app.json` (plugins de cada módulo, `android.permissions`, `ios.infoPlist`). Con `prebuild` o EAS Build se generan los archivos nativos. | Con `request...PermissionsAsync()` o con el hook del módulo, por ejemplo `useCameraPermissions()`. |
| ¿Qué pasa si se omite? | En Android, el permiso se deniega en el acto sin mostrar diálogo. En iOS, el acceso falla o la app se cierra, y App Store Connect rechaza la build. | La app no obtiene el acceso. Si no se pide, el recurso no se puede usar. |

### A3. Verdadero o falso

a) **Falso.** El diálogo lo dibuja el sistema operativo, no la app. La app solo elige cuándo pedirlo y qué hacer con la respuesta.

b) **Verdadero.** En Expo los archivos nativos se regeneran en cada `prebuild`, así que la fuente de verdad es `app.json` (o `app.config.ts`).

c) **Falso.** Los cambios en el `Info.plist` no viajan por actualizaciones OTA. Agregar un permiso nuevo exige una build nueva.

d) **Falso.** Si el permiso no está en el manifiesto, Android lo deniega en el acto, sin mostrar ningún diálogo.

e) **Falso.** `expo-permissions` ya no existe. Ahora cada módulo maneja sus propios permisos (por ejemplo `expo-camera` o `expo-location`).

f) **Verdadero.** Las notificaciones se piden directamente, sin texto de propósito en el `Info.plist`.

g) **Verdadero.** Con acceso limitado a fotos el `status` es `'granted'` y el matiz está en `accessPrivileges: 'limited'`.

h) **Verdadero.** Desinstalar y reinstalar la app es la forma confiable de volver a "sin decidir" en las dos plataformas.

### A4. Los estados de un permiso

**a) Diagrama de estados y diferencia central.**

Android:

```
Sin decidir --(permitir)--> Concedido
Sin decidir --(rechazar)--> Denegado (canAskAgain: true)
Denegado --(se vuelve a pedir y permite)--> Concedido
Denegado --(se vuelve a pedir y rechaza)--> Bloqueado (canAskAgain: false)
Bloqueado --(solo desde Ajustes)--> Concedido
```

iOS:

```
Sin decidir --(permitir)--> Concedido (o parcial: limited / aproximada)
Sin decidir --(rechazar)--> Bloqueado (canAskAgain: false)
Bloqueado --(solo desde Ajustes)--> Concedido
```

La diferencia central es que Android da dos oportunidades (un rechazo lleva a "denegado" y el segundo lleva a "bloqueado"), mientras que iOS da una sola: el primer rechazo ya deja el permiso bloqueado.

**b) Qué devuelve Expo en cada estado.**

| Estado | `status` | `canAskAgain` | ¿Puede aparecer el diálogo? |
|---|---|---|---|
| Sin decidir | `undetermined` | `true` | Sí |
| Concedido | `granted` | `true` | No hace falta, ya se tiene acceso |
| Denegado (se puede volver a pedir) | `denied` | `true` | Sí |
| Bloqueado | `denied` | `false` | No, solo se puede cambiar desde Ajustes |

---

## Parte B - Android: tipos de permisos y manifiesto

### B1. Clasificá los permisos

| Permiso | Tipo | ¿Cómo se obtiene? |
|---|---|---|
| `INTERNET` | De instalación | Se concede sola al instalar, sin diálogo. |
| `CAMERA` | De tiempo de ejecución | Se pide con un diálogo mientras se usa la app. |
| `VIBRATE` | De instalación | Se concede sola al instalar. |
| `SYSTEM_ALERT_WINDOW` | Especial | La persona la activa en una pantalla de Ajustes. |
| `POST_NOTIFICATIONS` | De tiempo de ejecución | Se pide con un diálogo (desde Android 13). |
| `ACCESS_NETWORK_STATE` | De instalación | Se concede sola al instalar. |
| `READ_CONTACTS` | De tiempo de ejecución | Se pide con un diálogo. |
| `SCHEDULE_EXACT_ALARM` | Especial | La persona la activa en Ajustes. |
| `RECORD_AUDIO` | De tiempo de ejecución | Se pide con un diálogo. |
| `MANAGE_EXTERNAL_STORAGE` | Especial | La persona la activa en Ajustes. |

### B2. Grupos y nombres

**a)** Un grupo de permisos junta permisos relacionados. La persona no ve los nombres técnicos sino el grupo. Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` juntos, la persona ve un solo diálogo, el de "Ubicación".

**b)** Todos los nombres completos llevan el prefijo `android.permission.`. El nombre completo del permiso de cámara es `android.permission.CAMERA`.

**c)** Los permisos de firma (signature) solo los obtienen las apps firmadas con el mismo certificado que el sistema o que otra app determinada. No se usan en apps comunes porque una app común no está firmada con ese certificado, así que no los puede conseguir.

### B3. Leé el manifiesto

**a)** Se concede sola al instalar `INTERNET`. El resto hay que pedirlo en tiempo de ejecución: `CAMERA`, `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`, `POST_NOTIFICATIONS` (desde Android 13) y `READ_EXTERNAL_STORAGE` (en las versiones hasta la API 32). `RECORD_AUDIO` está marcado para quitarse, así que no queda en el manifiesto final.

**b)** `android:maxSdkVersion="32"` significa que ese permiso solo vale hasta la API 32 (Android 12L). Desde Android 13 no se aplica. En su lugar se usan los permisos por tipo de archivo: `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO` y `READ_MEDIA_AUDIO`.

**c)** `tools:node="remove"` le dice al compilador que saque ese permiso del manifiesto final, aunque alguna librería lo agregue. En `app.json` se genera así:

```json
{
  "expo": {
    "android": {
      "blockedPermissions": ["android.permission.RECORD_AUDIO"]
    }
  }
}
```

**d)** Va en la propiedad `android.permissions` de `app.json`:

```json
{
  "expo": {
    "android": {
      "permissions": ["android.permission.SCHEDULE_EXACT_ALARM"]
    }
  }
}
```

**e)** No conviene editarlo a mano porque en Expo el archivo se regenera en cada `prebuild` y se pierden los cambios. Hay que configurarlo desde `app.json`. `blockedPermissions` no funciona en Expo Go, solo tiene efecto en una build propia.

### B4. Así pregunta Android

**a)** No, en Android no se puede poner texto propio dentro del diálogo, lo arma el sistema. La explicación hay que darla antes de pedir, en una pantalla propia de la app.

**b)** "Mientras la app está en uso" da un acceso que se mantiene, pero solo con la app en primer plano. "Solo esta vez" vale mientras se usa la app y poco después de salir el sistema lo revoca, así que la próxima vez se vuelve a preguntar. La opción "Solo esta vez" existe para ubicación, cámara y micrófono (Android 11 o superior).

**c)** Desde Android 11, si la persona toca "No permitir" dos veces, Android deja de mostrar el diálogo. El `status` queda en `denied` y `canAskAgain` toma el valor `false`.

**d)** La ubicación aproximada anda bien para algo como "farmacias de tu zona" o el clima del barrio. No sirve para algo como "llegar caminando a la puerta" o la navegación giro a giro.

**e)** Si la persona revoca un permiso desde Ajustes mientras la app está abierta, Android termina el proceso de la app. Al volver, la app arranca de cero.

### B5. Android, versión por versión

| Cambio | Versión (API) | Qué implica para el código |
|---|---|---|
| Nacen los permisos en tiempo de ejecución | Android 6.0 (API 23) | Hay que contemplar que un permiso puede no estar y pedirlo con un diálogo. |
| La ubicación en segundo plano pasa a ser un permiso aparte | Android 10 (API 29) | Aparece `ACCESS_BACKGROUND_LOCATION`. Se pide después del de primer plano. |
| Dos rechazos equivalen a "no volver a preguntar" | Android 11 (API 30) | `canAskAgain` pasa a `false` tras el segundo rechazo, así que hay que ofrecer ir a Ajustes. |
| Ubicación precisa o aproximada | Android 12 (API 31) | Hay que leer `accuracy` (`fine` o `coarse`) y hacer que la app funcione con las dos. |
| Las notificaciones pasan a ser un permiso (`POST_NOTIFICATIONS`) | Android 13 (API 33) | Hay que crear el canal y pedir el permiso en un momento con sentido. |
| Acceso parcial a fotos y videos ("Seleccionar fotos") | Android 14 (API 34) | `accessPrivileges` puede valer `limited`, y la app tiene que trabajar con la selección. |
| Permiso de red local (`ACCESS_LOCAL_NETWORK`) | Android 17 (API 37) | Es un permiso de tiempo de ejecución del grupo "Dispositivos cercanos". Aplica a apps con target API 37. |

**¿Qué es el `targetSdkVersion`?** Es la versión de Android para la que la app declara estar preparada. Muchos cambios de comportamiento se aplican según ese valor. Expo SDK 57 apunta a la API 36, y Google Play exige API 36 para apps nuevas y actualizaciones desde el 31 de agosto de 2026.

---

## Parte C - iOS: textos de propósito y acceso parcial

### C1. Claves del Info.plist

| Recurso | Clave en Info.plist |
|---|---|
| Cámara | `NSCameraUsageDescription` |
| Micrófono | `NSMicrophoneUsageDescription` |
| Ubicación en uso | `NSLocationWhenInUseUsageDescription` |
| Ubicación siempre | `NSLocationAlwaysAndWhenInUseUsageDescription` |
| Fotos (leer) | `NSPhotoLibraryUsageDescription` |
| Fotos (solo guardar) | `NSPhotoLibraryAddUsageDescription` |
| Contactos | `NSContactsUsageDescription` |
| Face ID | `NSFaceIDUsageDescription` |
| Rastreo entre apps (ATT) | `NSUserTrackingUsageDescription` |
| Notificaciones | No lleva clave. Se piden directamente. |

### C2. Sin texto, no hay permiso

**a)** Si falta el texto de propósito y la app intenta usar la cámara, la app se cierra (crash). Al subir la build a App Store Connect, la build es rechazada con el error `ITMS-90683: Missing purpose string in Info.plist`.

**b)** iOS muestra el diálogo una sola vez. Si la persona dice que no, la decisión queda guardada y solo se puede cambiar desde Ajustes. A la app le queda tener un camino alternativo para esa función.

**c)** El título del diálogo lo arma el sistema con el nombre de la app y no se puede cambiar. El texto de propósito lo escribimos nosotros. En Expo ese texto se configura en el plugin de cada módulo o en `ios.infoPlist` dentro de `app.json`.

**d)** Pasa porque la librería incluye código que usa una API protegida, y Apple lo detecta aunque nuestra app nunca la llame. Como falta el texto de propósito, rechaza la build. Se resuelve agregando el texto de propósito correspondiente (por ejemplo en `ios.infoPlist`) y volviendo a compilar.

### C3. Probador de textos de propósito

| Texto propuesto | ¿Aprobado? | Versión mejorada |
|---|---|---|
| "Necesitamos tu ubicación." | No. Dice qué se pide pero no para qué. | "Usamos tu ubicación para mostrarte los puntos de reciclaje de tu barrio." |
| "Para mejorar tu experiencia." | No. Es vago y no explica nada concreto. | "Usamos tu ubicación para ordenar los resultados según qué tan cerca están." |
| "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." | Sí. Sigue el molde y dice el beneficio. | No hace falta cambiarlo. |
| "La app no funciona sin ubicación." | No. No explica el beneficio y suena a presión. | "Usamos tu ubicación para mostrarte los reportes cargados cerca de donde estás." |
| "Ubicación requerida por el sistema." | No. No es verdad ni explica el uso real. | "Usamos tu ubicación para marcar dónde está el problema que reportás." |

### C4. Acceso parcial y gradual

| Caso | iOS | En Expo |
|---|---|---|
| Fotos limitadas ("Seleccionar fotos") | iOS 14 | `accessPrivileges: 'limited'` |
| Ubicación aproximada (interruptor "Precisa") | iOS 14 | `ios.accuracy: 'reduced'` |
| "Permitir una vez" (ubicación) | iOS 13 | No tiene un valor propio. Cuando se deja de usar la app, el estado vuelve a `undetermined`. |
| Ubicación escalonada: de "al usar la app" a "Siempre" | iOS 13 | Primero `requestForegroundPermissionsAsync()` y después `requestBackgroundPermissionsAsync()`. |
| Notificaciones provisionales | iOS 12 | `requestPermissionsAsync` con `allowProvisional: true`. |
| Rastreo entre apps (App Tracking Transparency) | iOS 14.5 | Módulo `expo-tracking-transparency` (`useTrackingPermissions`). |

Expo SDK 57 requiere iOS 16.4 o superior. La consecuencia práctica es que todos esos casos de la tabla ya aplican a cualquier persona que use la app, porque todas las versiones son anteriores a la mínima. No hay que pensar en versiones donde no existan, y hay que diseñar siempre para el caso parcial.

### C5. Android vs iOS, lado a lado

| | Android | iOS |
|---|---|---|
| ¿Dónde se declara? | `<uses-permission>` en el manifiesto | Texto de propósito en el `Info.plist` |
| Texto en el diálogo | Lo arma el sistema | El título lo arma el sistema y el texto lo escribimos nosotros |
| Oportunidades para preguntar | Dos rechazos y se bloquea (Android 11 o superior) | Una sola |
| "Solo esta vez" / "Permitir una vez" | "Solo esta vez": ubicación, cámara y micrófono | "Permitir una vez": solo ubicación |
| Notificaciones | Permiso de tiempo de ejecución desde Android 13 | Siempre se piden (o se usan las provisionales) |
| Ubicación en segundo plano | Se concede desde Ajustes (Android 11 o superior) | Segundo pedido para pasar a "Siempre" |
| Si falta la declaración | Se deniega sin mostrar diálogo | Falla o se cierra la app, y la tienda rechaza la build |

---

## Parte D - Expo: una API, dos plataformas

### D1. Módulos y funciones

| Necesidad | Módulo | Hook / función de permiso |
|---|---|---|
| Escanear un QR con la cámara | `expo-camera` | `useCameraPermissions` |
| Grabar video con sonido | `expo-camera` | `useCameraPermissions` y `useMicrophonePermissions` |
| Mostrar farmacias cercanas | `expo-location` | `useForegroundPermissions` |
| Seguir un envío con la app en segundo plano | `expo-location` | `useForegroundPermissions` primero y después `useBackgroundPermissions` |
| Mostrar un recordatorio | `expo-notifications` | `getPermissionsAsync` / `requestPermissionsAsync` |
| Grabar una nota de voz | `expo-audio` | `requestRecordingPermissionsAsync` |
| Galería propia dentro de la app | `expo-media-library` | `usePermissions` |
| Publicidad personalizada entre apps (iOS) | `expo-tracking-transparency` | `useTrackingPermissions` |

Si un tutorial usa `import * as Permissions from 'expo-permissions'`, quiere decir que está desactualizado, porque ese paquete ya no existe.

### D2. Consultar, pedir y el hook

**a)** `get...PermissionsAsync()` solo consulta el estado actual y nunca muestra un diálogo. `request...PermissionsAsync()` es la que puede mostrar el diálogo del sistema.

**b)** El hook devuelve tres elementos:

1. `permiso`: el estado actual (la respuesta con `status`, `granted`, `canAskAgain`, etc.).
2. `pedirPermiso`: la función que pide el permiso y puede mostrar el diálogo.
3. `consultarPermiso`: la función que vuelve a consultar el estado sin pedirlo.

En el primer render `permiso` vale `null`, porque el hook todavía está consultando. Mientras tanto la pantalla tiene que mostrar un indicador de carga.

**c)** Si `canAskAgain` es `false`, llamar a `request...()` vuelve enseguida sin mostrar nada, con el mismo resultado. Si se lo llama en un bucle (por ejemplo en cada render), la pantalla nunca avanza, queda "pidiendo" para siempre y se gasta procesamiento sin necesidad.

### D3. Leé la respuesta

| Respuesta | Qué hace la app |
|---|---|
| `null` | Muestra un indicador de carga, el hook todavía está consultando. |
| `{ status: 'granted', granted: true }` | Usa la función normalmente. |
| `{ status: 'undetermined', canAskAgain: true }` | Explica el beneficio y ofrece un botón "Continuar" que pida el permiso. |
| `{ status: 'denied', canAskAgain: true }` | Muestra una alternativa y la opción de volver a intentar. |
| `{ status: 'denied', canAskAgain: false }` | Explica cómo habilitarlo y ofrece "Abrir Ajustes" con `Linking.openSettings()`. |
| `{ status: 'granted', accessPrivileges: 'limited' }` | Trabaja con la selección que hizo la persona y ofrece ampliarla, sin insistir. |
| `{ status: 'granted', android: { accuracy: 'coarse' } }` | Funciona con ubicación aproximada: muestra resultados por zona y no distancias exactas. |

Los dos campos que deciden casi todo son `granted` (responde "¿lo puedo usar?") y `canAskAgain` (responde "¿lo pido o mando a Ajustes?").

### D4. Simulación del ciclo completo

Android 14, app recién instalada, `expo-location`:

| # | Acción | `status` | `canAskAgain` | ¿Diálogo? |
|---|---|---|---|---|
| 1 | `getForegroundPermissionsAsync()` | `undetermined` | `true` | No |
| 2 | `requestForegroundPermissionsAsync()` y "No permitir" | `denied` | `true` | Sí |
| 3 | `requestForegroundPermissionsAsync()` y "No permitir" | `denied` | `false` | Sí |
| 4 | `requestForegroundPermissionsAsync()` | `denied` | `false` | No, vuelve enseguida |
| 5 | `Linking.openSettings()`, se habilita "Mientras la app está en uso" y la app consulta al volver | `granted` | `true` | No |
| 6 | Igual que el 5, pero la app no vuelve a consultar | Sigue mostrando "bloqueado" aunque el permiso ya esté concedido (estado desactualizado) | | |

En el paso 6 el sistema ya tiene el permiso concedido, pero la app guardó el estado viejo y nunca lo actualizó, así que la pantalla sigue diciendo "bloqueado".

En iOS, repitiendo los pasos 1 a 4:

1. `undetermined`, `canAskAgain: true`, sin diálogo.
2. Con "No permitir" ya queda `denied` y `canAskAgain: false`. El resultado cambia en este paso, porque en iOS el primer rechazo ya bloquea el permiso.
3. No aparece diálogo, vuelve enseguida con `denied` y `canAskAgain: false`.
4. Igual que el 3.

En iOS, si la persona elige "Permitir una vez" y después cierra y reabre la app, el permiso vuelve a `undetermined` y se vuelve a preguntar.

### D5. Configurar app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para leer códigos QR.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para mostrarte los puntos de reciclaje más cercanos."
        }
      ]
    ],
    "android": {
      "blockedPermissions": ["android.permission.SYSTEM_ALERT_WINDOW"]
    }
  }
}
```

`expo-camera` agrega `RECORD_AUDIO` en Android aunque la app no grabe sonido porque la opción `recordAudioAndroid` viene en `true` por defecto, ya que la cámara también puede grabar video con audio. Si la app no graba video con sonido, hay que apagarla.

### D6. Expo Go no es tu app

**a)** Porque Expo Go es una app ya compilada, con su propio `Info.plist` y su propio manifiesto. Los textos de propósito y la lista de permisos de nuestro `app.json` no se aplican, y los diálogos que se ven son los de Expo Go.

**b)** En Expo Go se puede probar la lógica: los estados, los botones, ir a Ajustes, las alternativas y las notificaciones locales. Hay cosas que necesitan una development build: las notificaciones push en Android (desde SDK 53), la ubicación en segundo plano, ver los textos de propósito propios y comprobar el manifiesto real (por ejemplo `blockedPermissions`).

**c)** Para ver los archivos nativos generados:

```bash
npx expo prebuild
```

Para compilar una development build en Android:

```bash
npx expo run:android
```

También se puede usar `eas build --profile development --platform android`.

**d)** Para volver un permiso a "sin decidir" sin reinstalar:

```bash
# Android
adb shell pm revoke <paquete> android.permission.CAMERA

# Simulador de iOS
xcrun simctl privacy booted reset camera <bundle id>
```

---

## Parte E - Recetas: leer y corregir código

### E1. Encontrá los errores (cámara)

Errores que encontré:

1. En el primer render `permiso` vale `null`, y `permiso.status` rompe la app. Falta el estado de carga.
2. Se compara un texto (`status === 'granted'`) cuando alcanza con usar `permiso.granted`.
3. No se contempla el caso bloqueado (`canAskAgain: false`). En ese caso el botón no hace nada y hay que mandar a Ajustes.
4. El botón dice "Permitir", y el permiso lo da el sistema, no el botón. Tiene que decir "Continuar".
5. `onPress={pedirPermiso}` le pasa el evento a la función. Es mejor llamarla con una función flecha.
6. Falta la alternativa si se deniega la cámara (escribir el código a mano).

Versión corregida con los cuatro estados (cargando, concedido, preguntable, bloqueado):

```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ActivityIndicator, Button, Linking, Text, View } from 'react-native';

export default function Escanear() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  // 1. Cargando
  if (permiso === null) {
    return <ActivityIndicator />;
  }

  // 2. Concedido
  if (permiso.granted) {
    return <CameraView style={{ flex: 1 }} facing="back" />;
  }

  // 3. Preguntable
  if (permiso.canAskAgain) {
    return (
      <View>
        <Text>Usamos la cámara para leer el QR del aula.</Text>
        <Text>Lo podés cambiar cuando quieras en Ajustes.</Text>
        <Button title="Continuar" onPress={() => pedirPermiso()} />
      </View>
    );
  }

  // 4. Bloqueado
  return (
    <View>
      <Text>
        La cámara está bloqueada. Habilitala desde Ajustes para escanear el
        QR, o escribí el código del aula a mano.
      </Text>
      <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
    </View>
  );
}
```

### E2. El orden importa (ubicación)

**a)** Lo que está mal es que se pide primero el permiso de segundo plano y recién después el de primer plano. En iOS el sistema primero pregunta "al usar la app", así que el pedido no sale como se espera. En Android 11 o superior el pedido de segundo plano no muestra un diálogo, abre Ajustes sin contexto, y si no se tiene el de primer plano no se obtiene. Además, la función devuelve `false` si no se da el de segundo plano, aunque el de primer plano sí se haya concedido.

**b)** Versión correcta:

```ts
import * as Location from 'expo-location';

export async function activarSeguimiento() {
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```

**c)**

```ts
import * as Location from 'expo-location';

export async function obtenerUbicacion() {
  try {
    const permiso = await Location.requestForegroundPermissionsAsync();
    if (!permiso.granted) return null;

    const pos = await Location.getCurrentPositionAsync({});

    const aproximada =
      permiso.android?.accuracy === 'coarse' ||
      permiso.ios?.accuracy === 'reduced';

    return {
      latitud: pos.coords.latitude,
      longitud: pos.coords.longitude,
      aproximada,
    };
  } catch {
    return null;
  }
}
```

**d)** No, para "farmacias cercanas" alcanza con el primer plano. Si se pide segundo plano, Google Play exige una declaración especial, con un aviso visible dentro de la app y un video que muestre el uso.

### E3. Notificaciones mudas

**a)** La causa más probable es que no hay ningún canal de notificaciones creado. Expo no muestra el diálogo hasta que exista al menos un canal. Antes de pedir el permiso hay que crear el canal, por ejemplo con `Notifications.setNotificationChannelAsync('reportes', {...})`.

**b)** En Android 12 o anterior las notificaciones vienen habilitadas, y el pedido responde sin mostrar diálogo.

**c)** La opción es `allowProvisional: true`, que da notificaciones silenciosas sin diálogo previo. En código se detecta mirando el estado de iOS de la respuesta, que vale `IosAuthorizationStatus.PROVISIONAL`.

**d)** Conviene pedirlo después de una acción con sentido. Buen momento: cuando la persona toca "Avisame cuando mi turno esté confirmado". Mal momento: apenas se abre la app por primera vez, sin que haya hecho nada.

### E4. Fotos sin pedir permiso

| Necesidad | Herramienta | Permiso |
|---|---|---|
| Elegir una foto de perfil | `ImagePicker.launchImageLibraryAsync` | Ninguno |
| Sacar una foto en el momento | `ImagePicker.launchCameraAsync` o `expo-camera` | Cámara |
| Editor que muestra toda la galería | `expo-media-library` | Fotos (completo o limitado) |
| Adjuntar la foto de un comprobante | `ImagePicker.launchImageLibraryAsync` | Ninguno |

Google Play restringe `READ_MEDIA_IMAGES` y `READ_MEDIA_VIDEO` porque son datos muy sensibles y para la mayoría de los casos alcanza con el selector del sistema. Solo las permite a las apps cuya función principal necesita acceso amplio (galerías, editores). Rige desde el 28 de mayo de 2025, y el resto de las apps debe usar el selector.

"El mejor permiso" es el que no tenés que pedir.

### E5. Volver de Ajustes

```ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useRevisarAlVolver(revisar: () => void) {
  const anterior = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior.current.match(/inactive|background/);
      if (estabaAfuera && nuevo === 'active') revisar();
      anterior.current = nuevo;
    });
    return () => sub.remove();
  }, [revisar]);
}
```

**a)** Porque el sistema no le avisa a la app cuando el permiso cambia en Ajustes. La app queda en segundo plano con el estado viejo guardado en memoria, y hay que volver a consultar al volver.

**b)** La función `consultarPermiso`, que es el tercer elemento que devuelve `useCameraPermissions()`. Vuelve a consultar el estado sin pedirlo.

**c)** Porque el permiso puede cambiar en cualquier momento desde Ajustes, y Android además puede reiniciar el proceso de la app. Un estado guardado "para siempre" quedaría desactualizado. Es mejor consultar al sistema cada vez.

---

## Parte F - Buenas prácticas y tiendas

### F1. Pedir en contexto

| App y permiso | ¿Cuándo pedirlo? | Alternativa si lo deniegan |
|---|---|---|
| Delivery, ubicación | Cuando la persona toca "Usar mi ubicación" para ver los locales cercanos o elegir la dirección de entrega. | Escribir la dirección a mano o buscar por barrio. |
| Billetera virtual, cámara | Cuando toca "Escanear QR" para pagar. | Ingresar el código o el alias a mano. |
| Red social, contactos | Cuando toca "Buscar amigos". | Compartir un enlace de invitación con el menú del sistema. |
| Mensajería, micrófono | Cuando mantiene apretado el botón de audio o inicia una llamada por primera vez. | Escribir el mensaje en lugar de dictarlo. |
| Turnos médicos, notificaciones | Después de sacar un turno, con una opción como "Avisame un día antes". | Una bandeja de avisos dentro de la app. |
| Editor de fotos, galería completa | Cuando toca "Abrir galería" dentro del editor. | Usar el selector del sistema o trabajar con la selección limitada. |

Pedir cuatro permisos apenas se abre la app "entrena el No permitir automático" porque la persona todavía no sabe para qué sirve cada uno. Ve cuatro diálogos seguidos, sin contexto, y termina tocando "No permitir" de memoria. Además, en iOS un rechazo queda guardado y ya no se puede volver a preguntar.

### F2. La pantalla previa

**a)** Una buena pantalla previa al diálogo del sistema tiene:

1. El beneficio explicado en una frase (lo mismo que dice el texto de propósito).
2. Un solo botón, "Continuar", que lleva al diálogo del sistema.
3. Una aclaración de que la decisión se puede cambiar cuando quiera en Ajustes.

**b)** Porque el permiso lo da el sistema, no nuestro botón. El botón solo lleva al diálogo. Si dijera "Permitir", parecería que el permiso ya se dio.

**c)** La pauta 5.1.1(iv) pide que esa pantalla tenga un único botón que abra el diálogo y ninguna forma de salir antes. Botones como "Ahora no" o "Cerrar" son motivo de rechazo en la revisión de Apple.

**d)** Si el permiso ya está bloqueado, la pantalla explica cómo habilitarlo y el botón pasa a ser "Abrir Ajustes".

### F3. Mínimo privilegio

a) **Ubicación aproximada.** Para ver los puntos de reciclaje del barrio alcanza con saber la zona, no hace falta el punto exacto.

b) **Ubicación "siempre" (segundo plano).** Con el celular en el bolsillo la app no está en primer plano, así que "en uso" no alcanza. Hay que justificarlo en la declaración de Google Play.

c) **Selector del sistema.** No pide permiso y la app recibe solo la imagen que la persona eligió. No hace falta acceder a toda la galería para subir una foto del DNI.

d) **`expo-camera` sin micrófono.** Escanear un QR no graba sonido, así que no hace falta ese permiso.

### F4. Tiendas

**a)** Dos requisitos de Google Play:

- Declaración de permisos para los sensibles, como la ubicación en segundo plano (con aviso visible en la app y un video).
- Target API 36 obligatorio desde el 31/08/2026. También rige la sección de seguridad de los datos y la restricción de `READ_MEDIA_*`.

Dos requisitos de App Store:

- Textos de propósito claros y completos (pauta 5.1.1).
- No forzar ni manipular para conseguir el permiso (pauta 5.1.1(iv)). También piden las etiquetas de privacidad en App Store Connect.

**b)** El manifiesto de privacidad (`PrivacyInfo.xcprivacy`) es un archivo donde se declaran las APIs sensibles que usa la app y los datos que recolecta. En Expo se configura en `ios.privacyManifests` dentro de `app.json`.

**c)** Android 17 suma el permiso de red local (`ACCESS_LOCAL_NETWORK`) y un selector de contactos del sistema. Google Play va a exigir ese selector a muchas apps que hoy piden `READ_CONTACTS`, de forma obligatoria desde el 27/01/2027 para las apps con target API 37.

### F5. Errores comunes

**a) "This app has crashed because it attempted to access privacy-sensitive data without a usage description."**
Causa: falta el texto de propósito en el `Info.plist`. Solución: configurar el plugin del módulo o `ios.infoPlist` en `app.json` y volver a compilar.

**b) "En Expo Go anda, en la build no": en la development build la cámara se deniega sin mostrar ningún diálogo.**
Causa: Expo Go trae sus propios permisos, pero en nuestra build solo existe lo que declaramos en `app.json`. Si no está declarado el permiso de cámara, Android lo deniega sin diálogo. Solución: agregar el plugin de `expo-camera` (o el permiso) en `app.json` y compilar de nuevo.

**c) Después de habilitar la ubicación en Ajustes, la app sigue diciendo "bloqueado".**
Causa: la app no vuelve a consultar el permiso al volver de Ajustes. Solución: usar `AppState` para volver a consultar cuando la app pasa a `active` (con un hook como `useRevisarAlVolver`).

**d) La pantalla queda en "Pidiendo permiso..." para siempre porque el código llama a `request...()` en cada render.**
Causa: con `canAskAgain: false` el pedido vuelve enseguida sin mostrar nada, y al llamarlo en cada render se genera un bucle. Solución: pedir solo cuando la persona toca el botón, detectar `canAskAgain: false` y ofrecer ir a Ajustes.

**e) Una app de turnos no permite entrar a ninguna pantalla si se deniegan las notificaciones.**
Causa: se trata un permiso no esencial como si fuera obligatorio. Un permiso denegado es una decisión de la persona, no un error. Solución: dejar usar el resto de la app y ofrecer una alternativa, como una bandeja de avisos dentro de la app.