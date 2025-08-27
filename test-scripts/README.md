# Scripts de Prueba para Límites de Quizzes

Este directorio contiene 4 scripts SQL para probar diferentes escenarios de límites en la capa gratuita del generador de quizzes.

## 📋 Instrucciones de Uso

### 1. Usuario de Prueba Configurado

Los scripts ya están configurados con el usuario de prueba:

- **User ID**: `b336618a-6313-4420-846e-3606d90548a4`
- **Listos para ejecutar** directamente en Supabase

### 2. Limpiar datos anteriores (opcional)

Si necesitas limpiar datos de prueba anteriores:

```sql
DELETE FROM quizzes WHERE created_by = 'b336618a-6313-4420-846e-3606d90548a4';
```

## 🧪 Escenarios de Prueba

### Script 1: `test-data-1-half-without-files.sql`

- **Escenario**: Quizzes sin archivos a la mitad
- **Datos**: 10 quizzes sin archivos, 0 con archivos
- **Límites resultantes**:
  - Sin archivos: 10/20 (50% usado)
  - Con archivos: 0/5 (0% usado)

### Script 2: `test-data-2-without-files-full.sql`

- **Escenario**: Límite sin archivos lleno, con archivos vacío
- **Datos**: 20 quizzes sin archivos, 0 con archivos
- **Límites resultantes**:
  - Sin archivos: 20/20 (100% usado - LLENO)
  - Con archivos: 0/5 (0% usado)

### Script 3: `test-data-3-with-files-full.sql`

- **Escenario**: Límite con archivos lleno, sin archivos casi lleno
- **Datos**: 18 quizzes sin archivos, 5 con archivos
- **Límites resultantes**:
  - Sin archivos: 18/20 (90% usado)
  - Con archivos: 5/5 (100% usado - LLENO)

### Script 4: `test-data-4-both-full.sql`

- **Escenario**: Ambos límites llenos
- **Datos**: 20 quizzes sin archivos, 5 con archivos
- **Límites resultantes**:
  - Sin archivos: 20/20 (100% usado - LLENO)
  - Con archivos: 5/5 (100% usado - LLENO)

## 🔍 Verificación de Resultados

Después de ejecutar cada script, puedes verificar los resultados con:

```sql
-- Verificar conteos por tipo
SELECT
  COUNT(*) as total_quizzes,
  COUNT(CASE WHEN has_files = true THEN 1 END) as with_files,
  COUNT(CASE WHEN has_files = false OR has_files IS NULL THEN 1 END) as without_files
FROM quizzes
WHERE user_id = 'b336618a-6313-4420-846e-3606d90548a4'
  AND created_at >= date_trunc('month', CURRENT_DATE);

-- Ver detalles de los quizzes
SELECT title, has_files, created_at
FROM quizzes
WHERE user_id = 'b336618a-6313-4420-846e-3606d90548a4'
  AND created_at >= date_trunc('month', CURRENT_DATE)
ORDER BY created_at DESC;
```

## 🧪 Probar el Endpoint

Una vez ejecutados los scripts, puedes probar el endpoint `/api/quiz-limits` para verificar que los límites se calculan correctamente:

```bash
# Hacer request al endpoint (necesitas estar autenticado)
curl -X GET http://localhost:3000/api/quiz-limits \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Resultados Esperados

| Script   | Sin Archivos | Con Archivos | Estado UI                             |
| -------- | ------------ | ------------ | ------------------------------------- |
| Script 1 | 10/20        | 0/5          | Límites normales                      |
| Script 2 | 20/20        | 0/5          | Botón deshabilitado para sin archivos |
| Script 3 | 18/20        | 5/5          | Carga de archivos bloqueada           |
| Script 4 | 20/20        | 5/5          | Ambos bloqueados                      |

## ⚠️ Notas Importantes

1. **Fechas**: Los scripts usan fechas del mes actual para que los límites se apliquen correctamente
2. **has_files**: Campo crucial que determina si el quiz usó archivos o no
3. **Limpieza**: Recuerda limpiar los datos de prueba después de las pruebas
4. **Autenticación**: Necesitas estar autenticado para acceder al endpoint de límites
