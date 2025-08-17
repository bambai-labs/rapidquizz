import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email(),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Crear FormData para la acción de servidor
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Llamar a la acción de servidor de Supabase

      // Si llegamos aquí, el login fue exitoso

      // Redirigir al home
      router.push("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      let errorMessage =
        "Credenciales inválidas. Verifica tu email y contraseña.";

      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage =
            "Credenciales inválidas. Verifica tu email y contraseña.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email no confirmado. Revisa tu bandeja de entrada.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Intenta de nuevo más tarde.";
        } else {
          errorMessage = error.message;
        }
      }

      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showPassword,
    onSubmit,
    setShowPassword,
  };
};
