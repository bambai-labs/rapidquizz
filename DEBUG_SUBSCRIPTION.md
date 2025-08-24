# 🐛 Debug del Hook useSubscription

## Problema Identificado

El hook `useSubscription` no estaba actualizando automáticamente cuando se modificaban los datos en la tabla `subscriptions`. Solo se actualizaba al cambiar de pestaña.

## Soluciones Implementadas

### 1. Hook mejorado (`hooks/use-subscription.ts`)

**Cambios realizados:**

- ✅ Separación de efectos para datos iniciales y Realtime
- ✅ Mejores dependencias en `useCallback` para evitar re-creaciones infinitas
- ✅ Canal único con timestamp para evitar conflictos
- ✅ Logging detallado para debugging
- ✅ Manejo mejorado de reconexión automática

### 2. Funciones de base de datos (`lib/subscription-database.ts`)

**Mejoras:**

- ✅ Logging detallado en actualizaciones
- ✅ Uso correcto del cliente administrativo
- ✅ Verificación de errores mejorada

### 3. Herramientas de debugging

#### Componente de Debug (`components/debug/subscription-debug.tsx`)

```tsx
import { SubscriptionDebug } from '@/components/debug/subscription-debug'

// Úsalo en cualquier página para ver el estado en tiempo real
;<SubscriptionDebug />
```

#### API de testing (`/api/test-subscription`)

```bash
# Test simple
curl -X POST http://localhost:3000/api/test-subscription \\
  -H "Content-Type: application/json" \\
  -d '{"paddleUserId": "ctm_01234567890", "testType": "simple"}'

# Test de Realtime (cambia estado varias veces)
curl -X POST http://localhost:3000/api/test-subscription \\
  -H "Content-Type: application/json" \\
  -d '{"paddleUserId": "ctm_01234567890", "testType": "realtime"}'
```

## Verificación del funcionamiento

### 1. Verifica Realtime en Supabase

La tabla `subscriptions` debe tener Realtime habilitado. Ya verificamos que está en la publicación `supabase_realtime`.

### 2. Verifica las políticas RLS

```sql
-- Las siguientes políticas deben existir:
SELECT * FROM pg_policies WHERE tablename = 'subscriptions';
```

### 3. Prueba con el componente de debug

1. Agrega `<SubscriptionDebug />` a tu dashboard
2. Verifica que muestre "Conectado" en el estado Realtime
3. Usa la API de testing para cambiar el estado
4. Verifica que se actualice automáticamente en el componente

### 4. Verifica los logs

Abre la consola del navegador y busca logs como:

```
🔌 Configurando canal Realtime para usuario: [user-id]
🔌 Estado de conexión realtime: SUBSCRIBED
✅ Canal Realtime suscrito exitosamente
🔄 Cambio en suscripción en tiempo real: [payload]
```

## Problemas comunes y soluciones

### 1. "Canal no se conecta"

- Verifica que el usuario esté autenticado
- Revisa las políticas RLS de la tabla
- Verifica que Realtime esté habilitado en Supabase

### 2. "Cambios no se reflejan"

- Usa el endpoint `/api/test-subscription` para verificar
- Revisa los logs de la consola
- Verifica que los webhooks estén funcionando

### 3. "Re-conexiones constantes"

- Verifica la configuración de red
- Revisa si hay múltiples instancias del hook ejecutándose

## Uso en producción

1. **Elimina los archivos de debug antes de deploy:**
   - `components/debug/subscription-debug.tsx`
   - `app/api/test-subscription/route.ts`
   - `lib/test-subscription-update.ts`
   - Este archivo `DEBUG_SUBSCRIPTION.md`

2. **Reduce el logging en producción:**
   Puedes envolver los `console.log` en una condición:
   ```ts
   if (process.env.NODE_ENV === 'development') {
     console.log('🔄 Debug info...')
   }
   ```

## Monitoreo continuo

Para verificar que todo funciona correctamente en producción:

1. Usa herramientas como Supabase Dashboard para ver conexiones Realtime
2. Monitorea los logs de webhook para errores
3. Implementa alertas si las actualizaciones fallan

El hook debería ahora actualizar automáticamente cuando:

- Los webhooks de Paddle actualicen la base de datos
- Se hagan cambios directos en la tabla `subscriptions`
- Se cambien los estados de suscripción programáticamente
