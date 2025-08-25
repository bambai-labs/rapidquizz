'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import {
  Calendar,
  CreditCard,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  Shield,
} from 'lucide-react'

export default function PrivacyPolicyPage() {
  const lastUpdated = '15 de enero de 2025'

  const sections = [
    {
      id: 'informacion-recopilada',
      title: 'Información que recopilamos',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            En nuestra aplicación de generación de quizzes con inteligencia
            artificial, recopilamos únicamente la información esencial para
            proporcionarte nuestros servicios:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Correo electrónico:</strong> Necesario para crear tu
                cuenta, autenticación y comunicaciones importantes del servicio.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Nombre:</strong> Para personalizar tu experiencia y
                identificación en la plataforma.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Información de suscripción:</strong> Gestionada a través
                de Paddle para procesar pagos de manera segura.
              </span>
            </li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Compromiso de privacidad:</strong> No recopilamos
              información adicional innecesaria. Tu privacidad es nuestra
              prioridad.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'uso-informacion',
      title: 'Cómo utilizamos tu información',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos tu información personal únicamente para los siguientes
            propósitos legítimos:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Provisión del servicio:</strong> Para permitirte crear,
                guardar y gestionar tus quizzes generados con IA.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Autenticación y seguridad:</strong> Para verificar tu
                identidad y proteger tu cuenta.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Gestión de suscripciones:</strong> Para procesar pagos y
                gestionar tu plan de suscripción.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Comunicaciones esenciales:</strong> Para enviarte
                actualizaciones importantes sobre el servicio.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Mejora del servicio:</strong> Para optimizar la
                funcionalidad de generación de quizzes con IA.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'compartir-informacion',
      title: 'Compartir información con terceros',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Política de no compartir
            </h4>
            <p className="text-sm text-green-700 leading-relaxed">
              <strong>
                No vendemos, alquilamos o compartimos tu información personal
                con terceros
              </strong>{' '}
              para fines comerciales o de marketing.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Excepciones limitadas:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Proveedores de servicios esenciales:</strong> Supabase
                  (base de datos) y Paddle (procesamiento de pagos) que operan
                  bajo estrictos acuerdos de confidencialidad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Requerimientos legales:</strong> Solo cuando sea
                  obligatorio por ley o para proteger derechos legítimos.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'almacenamiento-seguridad',
      title: 'Almacenamiento y seguridad',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Infraestructura
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Base de datos segura en Supabase</li>
                <li>• Cifrado de datos en tránsito y reposo</li>
                <li>• Servidores certificados y monitoreados</li>
                <li>• Copias de seguridad automáticas</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Medidas de protección
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Autenticación segura</li>
                <li>• Acceso limitado por roles</li>
                <li>• Monitoreo de seguridad 24/7</li>
                <li>• Actualizaciones de seguridad regulares</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Aunque implementamos las mejores
              prácticas de seguridad, ningún sistema es 100% seguro. Te
              recomendamos usar contraseñas fuertes y únicas.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'derechos-usuario',
      title: 'Tus derechos como usuario',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            De acuerdo con las regulaciones de protección de datos, tienes los
            siguientes derechos:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                Derechos de acceso y control:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Acceso:</strong> Solicitar una copia de tus datos
                    personales
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Rectificación:</strong> Corregir datos inexactos o
                    incompletos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Eliminación:</strong> Solicitar la eliminación de
                    tus datos
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Derechos adicionales:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Portabilidad:</strong> Recibir tus datos en formato
                    estructurado
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Limitación:</strong> Restringir el procesamiento de
                    tus datos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Oposición:</strong> Oponerte al procesamiento de tus
                    datos
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Para ejercer cualquiera de estos derechos, contáctanos a través de
              la configuración de tu cuenta o enviando un email. Responderemos
              en un plazo máximo de 30 días.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'cookies-tecnologias',
      title: 'Cookies y tecnologías de seguimiento',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Utilizamos cookies y tecnologías similares para mejorar tu
            experiencia en nuestra plataforma:
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Cookies esenciales</h4>
              <p className="text-sm text-muted-foreground">
                Necesarias para el funcionamiento básico del sitio,
                autenticación y seguridad. No se pueden desactivar.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Cookies de funcionalidad
              </h4>
              <p className="text-sm text-muted-foreground">
                Permiten recordar tus preferencias y configuraciones para
                mejorar tu experiencia de usuario.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Cookies de análisis
              </h4>
              <p className="text-sm text-muted-foreground">
                Nos ayudan a entender cómo usas la aplicación para mejorar
                nuestros servicios. Puedes desactivarlas sin afectar la
                funcionalidad.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'menores-edad',
      title: 'Protección de menores',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">
              Restricción de edad
            </h4>
            <p className="text-sm text-red-700 leading-relaxed">
              Nuestro servicio está dirigido a usuarios mayores de 13 años. No
              recopilamos conscientemente información personal de menores de 13
              años.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Si descubrimos que hemos recopilado información de un menor de 13
            años sin el consentimiento parental verificable, tomaremos medidas
            inmediatas para eliminar dicha información de nuestros servidores.
          </p>
          <p className="text-sm text-muted-foreground">
            Si eres padre o tutor y tienes conocimiento de que tu hijo nos ha
            proporcionado información personal, por favor contáctanos
            inmediatamente.
          </p>
        </div>
      ),
    },
    {
      id: 'cambios-politica',
      title: 'Cambios en esta política',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nos reservamos el derecho de actualizar esta política de privacidad
            en cualquier momento para reflejar cambios en nuestros servicios o
            en la legislación aplicable.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Proceso de actualización:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Publicaremos cualquier cambio en esta página</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Actualizaremos la fecha de "última actualización"</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Para cambios significativos, te notificaremos por email
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Te recomendamos revisar esta política periódicamente
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'contacto',
      title: 'Contacto y consultas',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si tienes preguntas, inquietudes o solicitudes relacionadas con esta
            política de privacidad o el tratamiento de tus datos personales, no
            dudes en contactarnos:
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">
                Información de contacto:
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Email:{' '}
                    <a
                      href="mailto:privacy@quizapp.com"
                      className="text-primary hover:underline"
                    >
                      privacy@quizapp.com
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Formulario de contacto disponible en la configuración de tu
                    cuenta
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Tiempo de respuesta:</strong> Nos comprometemos a
                  responder todas las consultas relacionadas con privacidad en
                  un plazo máximo de 30 días hábiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Política de Privacidad</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            En nuestra aplicación de generación de quizzes con inteligencia
            artificial, tu privacidad es fundamental. Esta política explica cómo
            recopilamos, utilizamos y protegemos tu información personal.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Última actualización: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Resumen ejecutivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="w-6 h-6 text-primary" />
                Resumen de nuestra política
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <Database className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Datos mínimos</h3>
                  <p className="text-sm text-muted-foreground">
                    Solo recopilamos tu email y nombre
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Sin compartir</h3>
                  <p className="text-sm text-muted-foreground">
                    No vendemos ni compartimos tus datos
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Máxima seguridad</h3>
                  <p className="text-sm text-muted-foreground">
                    Cifrado y protección avanzada
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secciones de la política */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 2) }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {section.icon}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer de la política */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Separator className="mb-8" />
          <div className="bg-muted/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Si tienes cualquier duda sobre nuestra
              política de privacidad o el manejo de tus datos, no hesites en
              contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:privacy@quizapp.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contactar por email
              </a>
              <span className="text-sm text-muted-foreground">
                o utiliza el formulario en la configuración de tu cuenta
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
