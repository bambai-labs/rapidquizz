import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerSchema = z
  .object({
    email: z.string().min(1, "El email es requerido").email(),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
  
    setIsLoading(true);
    try {
      // Simular registro - en un caso real, aquí harías la llamada a tu API
      const mockUser = {
        id: "1",
        name: data.email.split("@")[0], // Usar la parte del email como nombre
        email: data.email,
        image: undefined,
      };

      // Simular que el registro fue exitoso y hacer login automático
      login(mockUser);

      // Redirigir al home después del registro exitoso
      router.push("/home");
    } catch (error) {
      console.error("Error al registrarse:", error);
      form.setError("root", {
        type: "manual",
        message: "Error al crear la cuenta. Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showPassword,
    showConfirmPassword,
    onSubmit,
    setShowPassword,
    setShowConfirmPassword,
  };
};
