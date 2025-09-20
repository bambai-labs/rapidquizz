'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  Gavel,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react'

export default function TermsOfServicePage() {
  const lastUpdated = 'January 15, 2025'

  const sections = [
    {
      id: 'acceptance',
      title: 'Aceptación de los Términos',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Al acceder y utilizar RapidQuizz, nuestra plataforma de generación
            de cuestionarios con IA, aceptas estar sujeto a estos Términos y
            Condiciones. Si no estás de acuerdo con alguno de estos términos, no
            debes usar nuestro servicio.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> Estos términos constituyen un acuerdo
              legal vinculante entre tú y RapidQuizz. Te recomendamos leerlos
              cuidadosamente.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'service-description',
      title: 'Descripción del Servicio',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz es una aplicación web que utiliza inteligencia artificial
            para generar cuestionarios personalizados. Nuestro servicio incluye:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Generación automática de cuestionarios</strong>{' '}
                utilizando IA avanzada
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Personalización de contenido</strong> según tus
                necesidades específicas
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Almacenamiento seguro</strong> de tus cuestionarios y
                datos
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Gestión de cuenta</strong> y historial de cuestionarios
                generados
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'user-accounts',
      title: 'Cuentas de Usuario',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para utilizar RapidQuizz, debes crear una cuenta y proporcionarnos
            información precisa y completa.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Responsabilidades del Usuario
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mantener la confidencialidad de tu contraseña</li>
                <li>• Proporcionar información veraz y actualizada</li>
                <li>
                  • Notificar inmediatamente cualquier uso no autorizado de tu
                  cuenta
                </li>
                <li>
                  • Ser responsable de todas las actividades realizadas bajo tu
                  cuenta
                </li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Restricciones de Edad
              </h4>
              <p className="text-sm text-muted-foreground">
                Debes tener al menos 13 años para usar RapidQuizz. Si eres menor
                de 18 años, necesitas el consentimiento de tus padres o tutores
                legales.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Uso Aceptable',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Al usar RapidQuizz, te comprometes a utilizar el servicio de manera
            responsable y legal.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-green-700">
                ✅ Usos Permitidos
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Crear cuestionarios para uso educativo</li>
                <li>• Generar contenido para entrenamientos corporativos</li>
                <li>• Desarrollar evaluaciones profesionales</li>
                <li>• Uso personal y académico</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-red-700">
                ❌ Usos Prohibidos
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Generar contenido ilegal o dañino</li>
                <li>• Crear cuestionarios con contenido ofensivo</li>
                <li>• Intentar hackear o comprometer el sistema</li>
                <li>• Revender o redistribuir el servicio</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> El incumplimiento de estas reglas
              puede resultar en la suspensión o terminación de tu cuenta sin
              previo aviso.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'subscription-payment',
      title: 'Suscripciones y Pagos',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz ofrece diferentes planes de suscripción para acceder a
            nuestras funcionalidades premium.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Procesamiento de Pagos
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • Los pagos se procesan de forma segura a través de Paddle
                </li>
                <li>
                  • Aceptamos las principales tarjetas de crédito y débito
                </li>
                <li>
                  • Los precios se muestran en la moneda local cuando sea
                  posible
                </li>
                <li>• Las suscripciones se renuevan automáticamente</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Política de Reembolsos
              </h4>
              <p className="text-sm text-muted-foreground">
                Ofrecemos reembolsos completos dentro de los primeros 14 días
                después de la compra. Para solicitar un reembolso, contacta
                nuestro soporte.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Cancelación</h4>
              <p className="text-sm text-muted-foreground">
                Puedes cancelar tu suscripción en cualquier momento desde tu
                panel de cuenta. La cancelación será efectiva al final del
                período de facturación actual.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Propiedad Intelectual',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Propiedad de RapidQuizz</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• La plataforma y su tecnología</li>
                <li>• Algoritmos de inteligencia artificial</li>
                <li>• Diseño e interfaz de usuario</li>
                <li>• Marca y logotipos</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Tu Propiedad</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Cuestionarios que generes</li>
                <li>• Contenido original que proporciones</li>
                <li>• Datos y respuestas de tus cuestionarios</li>
                <li>• Configuraciones personalizadas</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Licencia de Uso:</strong> Te otorgamos una licencia
              limitada, no exclusiva y revocable para usar RapidQuizz según
              estos términos. No puedes copiar, modificar o distribuir nuestra
              tecnología.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy-data',
      title: 'Privacidad y Protección de Datos',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            La protección de tu privacidad es fundamental para RapidQuizz.
            Nuestro manejo de datos personales se rige por nuestra Política de
            Privacidad.
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Documentos relacionados:
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    <a
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      Política de Privacidad de RapidQuizz
                    </a>{' '}
                    - Detalles sobre protección de datos personales
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Compromiso:</strong> Cumplimos con GDPR, CCPA y otras
                  regulaciones de protección de datos aplicables.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'service-availability',
      title: 'Disponibilidad del Servicio',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nos esforzamos por mantener RapidQuizz disponible 24/7, pero pueden
            ocurrir interrupciones por mantenimiento, actualizaciones o
            circunstancias imprevistas.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Mantenimiento Programado
              </h4>
              <p className="text-sm text-muted-foreground">
                Te notificaremos con al menos 24 horas de anticipación sobre
                cualquier mantenimiento programado que pueda afectar el
                servicio.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Interrupciones No Programadas
              </h4>
              <p className="text-sm text-muted-foreground">
                En caso de interrupciones imprevistas, trabajaremos para
                restaurar el servicio lo más rápido posible y te mantendremos
                informado del progreso.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'limitation-liability',
      title: 'Limitación de Responsabilidad',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Limitaciones Importantes
            </h4>
            <p className="text-sm text-yellow-700 leading-relaxed">
              RapidQuizz se proporciona "tal como es" sin garantías de ningún
              tipo. No seremos responsables por daños indirectos, incidentales o
              consecuentes.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">
              Exclusiones de Responsabilidad:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Pérdida de datos debido a factores externos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Interrupciones del servicio por causas de fuerza mayor
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Uso inadecuado del contenido generado por IA</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Problemas derivados del uso de terceros</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'termination',
      title: 'Terminación del Servicio',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                Terminación por tu parte
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Puedes cancelar tu cuenta en cualquier momento</li>
                <li>
                  • La cancelación es efectiva al final del período pagado
                </li>
                <li>• Puedes exportar tus datos antes de cancelar</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                Terminación por nuestra parte
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Por violación de estos términos</li>
                <li>• Por uso fraudulento o abusivo</li>
                <li>• Por falta de pago (después de aviso)</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Importante:</strong> Tras la terminación, tendrás 30 días
              para exportar tus datos antes de que sean eliminados
              permanentemente de nuestros servidores.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'legal-jurisdiction',
      title: 'Ley Aplicable y Jurisdicción',
      icon: <Gavel className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estos términos se rigen por las leyes de [PAÍS/ESTADO] sin
            considerar conflictos de leyes.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Resolución de Disputas
              </h4>
              <p className="text-sm text-muted-foreground">
                Cualquier disputa relacionada con estos términos será resuelta
                mediante arbitraje vinculante o en los tribunales competentes de
                [JURISDICCIÓN].
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Separabilidad</h4>
              <p className="text-sm text-muted-foreground">
                Si alguna disposición de estos términos se considera inválida,
                las demás disposiciones permanecerán en pleno vigor y efecto.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'changes-terms',
      title: 'Modificaciones a los Términos',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz se reserva el derecho de modificar estos términos en
            cualquier momento para reflejar cambios en nuestros servicios o la
            legislación aplicable.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Proceso de actualización:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Publicaremos los cambios en esta página</span>
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
                  El uso continuado implica aceptación de los nuevos términos
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'contact-support',
      title: 'Contacto y Soporte',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si tienes preguntas sobre estos términos o necesitas soporte
            técnico, no dudes en contactarnos:
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
                    Email general:{' '}
                    <a
                      href="mailto:support@rapidquizz.com"
                      className="text-primary hover:underline"
                    >
                      support@rapidquizz.com
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Gavel className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Temas legales:{' '}
                    <a
                      href="mailto:legal@rapidquizz.com"
                      className="text-primary hover:underline"
                    >
                      legal@rapidquizz.com
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
                  responder todas las consultas relacionadas con términos
                  legales en un máximo de 48 horas.
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
            <Gavel className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">
              Términos y Condiciones de RapidQuizz
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Estos términos establecen las reglas y regulaciones para el uso de
            RapidQuizz, nuestra plataforma de generación de cuestionarios con
            inteligencia artificial.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Última actualización: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Executive summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="w-6 h-6 text-primary" />
                Resumen de Términos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <User className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Uso Responsable</h3>
                  <p className="text-sm text-muted-foreground">
                    Utiliza RapidQuizz de forma ética y legal
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Pagos Seguros</h3>
                  <p className="text-sm text-muted-foreground">
                    Procesamiento seguro vía Paddle
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Tus Derechos</h3>
                  <p className="text-sm text-muted-foreground">
                    Proteges tu contenido y datos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms sections */}
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

        {/* Terms footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Separator className="mb-8" />
          <div className="bg-muted/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              ¿Tienes preguntas legales?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Si tienes alguna pregunta sobre estos
              términos o el uso de RapidQuizz, no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:legal@rapidquizz.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contactar por email
              </a>
              <span className="text-sm text-muted-foreground">
                o usa el formulario en la configuración de tu cuenta
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
