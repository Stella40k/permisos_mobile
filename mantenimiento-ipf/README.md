# Parte G - Sistema "Mantenimiento IPF"

Aplicación móvil desarrollada con React Native, Expo (SDK 57) y TypeScript para la gestión de reportes de mantenimiento edilicio en el Instituto Politécnico Formosa (IPF), implementando las mejores prácticas de gestión de permisos en Android e iOS.

---

## 📱 Descripción del Proyecto

"Mantenimiento IPF" permite a la comunidad académica reportar desperfectos edilicios (electricidad, agua, mobiliario, equipos) en aulas y sectores del instituto.

La aplicación pone en práctica el **Principio de Mínimo Privilegio**, el **Consentimiento Informado**, la **No Fricción/Respeto a la Decisión del Usuario** y la compatibilidad multiplataforma rigurosa según las directrices de Google Play y Apple App Store.

---

## 🏗️ Estructura del Proyecto (`src/`)

```
src/
  app/
    _layout.tsx             # Stack principal con rutas y modal de previa
    ajustes-app.tsx         # Configuración y solicitud contextual de notificaciones
    (tabs)/
      _layout.tsx           # Navegación por pestañas con badge dinámico de avisos
      index.tsx             # Lista de reportes, contadores por estado y nuevo reporte
      avisos.tsx            # Bandeja interna de avisos (funciona aun sin notificaciones)
      permisos.tsx          # Panel de diagnóstico y estado real de permisos
    permisos/
      [recurso].tsx         # Pantalla previa al diálogo del sistema en modal
    reporte/
      nuevo.tsx             # Formulario de nuevo reporte (sin solicitar permisos al entrar)
      escanear.tsx          # Escáner QR del aula con los 4 estados
      foto.tsx              # Cámara contextual y selector de galería sin permisos
      ubicacion.tsx         # GPS en primer plano / ubicación aproximada / sector manual
      [id].tsx              # Detalle del reporte y simulación de resolución
  components/
    ui.tsx                  # Componentes reutilizables (Pantalla, Botón, Tarjeta, etc.)
    PantallaPrevia.tsx      # Previa con botón "Continuar" y estado bloqueado con Ajustes
    EntradaAula.tsx         # Alternativa manual para ingresar aula
    TarjetaReporte.tsx      # Tarjeta resumen de cada reporte
  constants/
    tema.ts                 # Tokens de diseño (colores, espaciados, radios)
    permisos.ts             # Textos explicativos, beneficios, alternativas y rutas a Ajustes
  hooks/
    usePermiso.ts           # Hook unificado que integra consulta, petición y foco
    useRevisarAlVolver.ts   # Listener de AppState para revalidar al volver de Ajustes
  lib/
    tipos.ts                # Modelos de datos TypeScript (Reporte, Aviso, Ubicacion)
    formato.ts              # Formateadores de fecha y ubicación respetuosa
    store.tsx               # Estado global en memoria (StoreProvider, useStore)
    permisos.ts             # Adaptadores por recurso y canal Android
    previa.ts               # Control asíncrono de apertura/cierre de pantalla previa
    ubicacion.ts            # Obtención de coordenadas y detección de aproximada
    notificaciones.ts       # Handler de notificaciones locales y scheduler
```

---

## 🔒 Configuración de `app.json` y Mínimo Privilegio

Dentro de `app.json` se configuraron los plugins oficiales con permisos acotados y se bloquearon permisos innecesarios:

```json
{
  "expo": {
    "name": "mantenimiento-ipf",
    "slug": "mantenimiento-ipf",
    "scheme": "mantenimientoipf",
    "plugins": [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Usamos tu cámara para leer el QR del aula y sacar la foto del desperfecto.",
          "microphonePermission": false,
          "recordAudioAndroid": false
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Usamos tu ubicación para marcar en qué lugar del instituto está el problema que reportás.",
          "locationAlwaysAndWhenInUsePermission": false,
          "locationAlwaysPermission": false,
          "isIosBackgroundLocationEnabled": false,
          "isAndroidBackgroundLocationEnabled": false
        }
      ],
      [
        "expo-image-picker",
        {
          "cameraPermission": "Usamos tu cámara para sacar la foto del desperfecto.",
          "photosPermission": false,
          "microphonePermission": false
        }
      ],
      "expo-notifications"
    ],
    "android": {
      "blockedPermissions": [
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ]
    }
  }
}
```

### Justificación de `blockedPermissions`:
1. `RECORD_AUDIO`: La app solo lee códigos QR y toma fotos estáticas. No graba audio ni video, por lo que el micrófono se desactiva explícitamente.
2. `SYSTEM_ALERT_WINDOW`: Permiso de superposición innecesario y riesgoso.
3. `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`: Obsoletos y excesivos. La app utiliza el Photo Picker del sistema que no requiere acceso al almacenamiento completo.
4. `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO`: Al usar el selector del sistema (`launchImageLibraryAsync`), el SO devuelve únicamente el URI del archivo elegido sin conceder acceso a la galería completa.
5. `ACCESS_BACKGROUND_LOCATION`: El reporte es un acto presencial en primer plano. No existe ninguna funcionalidad que justifique rastrear al usuario en segundo plano.

---

## 📋 Cumplimiento de Requisitos del TP

| Requisito | Archivo Principal | Implementación y Justificación |
|---|---|---|
| **G2.1 Hook unificado** | `src/hooks/usePermiso.ts` | Normaliza los estados en `'cargando'`, `'concedido'`, `'preguntable'` y `'bloqueado'`. Revalida con `useFocusEffect` y `useRevisarAlVolver`. |
| **G2.2 Escáner con 4 estados** | `src/app/reporte/escanear.tsx` | Maneja estado cargando, concedido (con cámara activa), explicativo (con botón Continuar) y bloqueado (con botón Ajustes), siempre con alternativa de aula manual. |
| **G2.3 Foto sin permiso de galería** | `src/app/reporte/foto.tsx` | `launchImageLibraryAsync` usa el Photo Picker del SO sin pedir permisos. La cámara sí solicita permiso de forma contextual al presionar "Sacar foto". |
| **G2.4 Ubicación respetuosa** | `src/app/reporte/ubicacion.tsx` | Solo solicita ubicación en primer plano. Respeta la precisión aproximada (Android 12+ / iOS 14+) mostrando "Ubicación aproximada" sin coordenadas exactas. Alternativa manual por sectores. |
| **G2.5 Notificaciones en contexto** | `src/app/ajustes-app.tsx` | No se piden al iniciar la app. Se solicitan recién al encender el switch "Avisarme cuando se resuelva". Crea canal de notificación en Android. |
| **G2.6 Pantallas previas** | `src/app/permisos/[recurso].tsx` | Cumple la pauta 5.1.1(iv) de Apple: un solo botón "Continuar" que invoca el diálogo del sistema. Si está bloqueado, ofrece "Abrir Ajustes". |
| **G2.7 La app nunca se bloquea** | Todas las pantallas | Ante cualquier rechazo o bloqueo de permisos existen alternativas funcionales: escribir aula a mano, elegir foto de galería, elegir sector a mano y bandeja interna de avisos. |
| **G2.8 No insistir** | Toda la navegación | La previa o el diálogo nunca se abren de forma automática en un render o loop; solo tras un toque explícito del usuario (`abrirPrevia`). |
| **G2.9 Panel de permisos** | `src/app/(tabs)/permisos.tsx` | Pantalla de diagnóstico que lista el estado real de cada recurso, matices parciales y accesos directos. |
| **G3 Mínimo privilegio** | `app.json` | Plugins limpios y lista explícita de `blockedPermissions`. |

> **Nota de diseño**: En el escáner (`/reporte/escanear`), la explicación previa está integrada directamente en la propia pantalla para una experiencia fluida. En el resto de las acciones (foto, ubicación, notificaciones y panel), la explicación previa se despliega como modal sobre la ruta `/permisos/[recurso]`, reutilizando los mismos componentes visuales (`PantallaPrevia` y `PantallaBloqueada`).

---

## 🎯 Respuestas Clave para la Defensa Oral

1. **¿Qué decide entre "Continuar" y "Abrir Ajustes"?**
   - La función `aEstado` en `src/lib/permisos.ts`. Evalúa `granted` y `canAskAgain`. Si `granted` es `false` pero `canAskAgain` es `true`, el estado es `'preguntable'` (botón "Continuar" que llama al diálogo del sistema). Si `canAskAgain` es `false`, el sistema operativo no volverá a mostrar el diálogo y el estado pasa a `'bloqueado'` (botón "Abrir Ajustes").

2. **¿Qué sucede al revocar un permiso con la app en segundo plano?**
   - En Android, revocar un permiso sensible en Ajustes suele matar el proceso de la app por seguridad del SO. Al volver a abrir la app, el estado arranca de cero y el hook re-consulta en el montaje inicial. Si el proceso no se destruye, el hook `useRevisarAlVolver` escucha eventos `AppState` (`active`) y sincroniza automáticamente el estado.

3. **¿Por qué elegir una foto no requiere permiso pero sacarla sí?**
   - El Photo Picker es un componente fuera de la caja de arena de la app provisto directamente por el sistema operativo. La persona elige un elemento y el SO solo comparte ese archivo seleccionado. Tomar una foto, en cambio, requiere acceso directo en tiempo real al sensor de hardware de la cámara, que es un recurso protegido.

4. **¿Cómo se comporta la ubicación aproximada?**
   - Tanto Android como iOS permiten al usuario otorgar precisión aproximada (zona de varios kilómetros cuadrados). El adaptador detecta esto (`r.android?.accuracy === 'coarse'` o iOS `reduced`) y la app formatea el texto como `"Ubicación aproximada"`, respetando la privacidad del usuario sin exponer coordenadas GPS exactas.

5. **¿Por qué los textos de propósito solo se ven en builds reales y no en Expo Go?**
   - Expo Go es un ejecutable nativo precompilado con su propio `AndroidManifest.xml` e `Info.plist`. Los textos declarados en `app.json` se compilan en los binarios nativos generados mediante `npx expo prebuild` o EAS Build.

---

## 🚀 Cómo Ejecutar el Proyecto

1. Iniciar el servidor de desarrollo:
   ```bash
   npx expo start
   ```
2. Para probar en Android o emulador con compilación nativa:
   ```bash
   npx expo prebuild --clean
   npx expo run:android
   ```
