# Configuración de Supabase en Next.js

Este proyecto ya tiene Supabase integrado. Sigue estos pasos para completar la configuración:

## 1. Crear un proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

## 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 3. Configurar la base de datos

Ejecuta estos comandos SQL en el editor SQL de Supabase:

```sql
-- Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de quizzes
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de preguntas
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para quizzes
CREATE POLICY "Users can view all quizzes" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "Users can create own quizzes" ON quizzes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quizzes" ON quizzes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quizzes" ON quizzes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para questions
CREATE POLICY "Users can view questions for accessible quizzes" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND (quizzes.user_id = auth.uid() OR quizzes.user_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can create questions for own quizzes" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions for own quizzes" ON questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions for own quizzes" ON questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.user_id = auth.uid()
    )
  );

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Configurar autenticación

1. Ve a Authentication > Settings en tu dashboard de Supabase
2. Configura los proveedores que quieras usar (Google, GitHub, etc.)
3. En "Site URL" pon: `http://localhost:3000`
4. En "Redirect URLs" agrega: `http://localhost:3000/auth/callback`

## 5. Usar Supabase en tu aplicación

### Hook personalizado
```tsx
import { useSupabase } from '@/hooks/use-supabase'

function MyComponent() {
  const { user, loading, supabase } = useSupabase()
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <div>
      {user ? (
        <p>Hola, {user.email}</p>
      ) : (
        <p>No has iniciado sesión</p>
      )}
    </div>
  )
}
```

### Operaciones de base de datos
```tsx
import { createClient } from '@/lib/supabase'

const supabase = createClient()

// Insertar un quiz
const { data, error } = await supabase
  .from('quizzes')
  .insert({
    title: 'Mi Quiz',
    description: 'Descripción del quiz',
    user_id: user.id
  })

// Obtener quizzes
const { data: quizzes, error } = await supabase
  .from('quizzes')
  .select('*')
  .order('created_at', { ascending: false })
```

## 6. Componentes disponibles

- `SupabaseAuth`: Componente de autenticación completo
- `LogoutButton`: Botón para cerrar sesión
- `useSupabase`: Hook para manejar el estado de autenticación

## 7. Estructura de archivos

```
lib/
  supabase.ts          # Configuración de Supabase
hooks/
  use-supabase.ts      # Hook personalizado
components/auth/
  supabase-auth.tsx    # Componente de autenticación
  logout-button.tsx    # Botón de logout
app/auth/
  callback/route.ts    # Ruta de callback
  login/page.tsx       # Página de login
types/
  supabase.ts          # Tipos TypeScript
middleware.ts          # Middleware de autenticación
```

## 8. Próximos pasos

1. Configura las variables de entorno
2. Ejecuta los comandos SQL en Supabase
3. Configura los proveedores de autenticación
4. Prueba la autenticación en tu aplicación
5. Personaliza los componentes según tus necesidades

