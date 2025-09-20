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
  const lastUpdated = 'January 15, 2025'

  const sections = [
    {
      id: 'information-collected',
      title: 'Information we collect',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            En RapidQuizz, nuestra aplicación de generación de cuestionarios con
            IA, solo recopilamos información esencial para proporcionarte
            nuestros servicios:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Email:</strong> Required to create your account,
                authentication, and important service communications.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Name:</strong> To personalize your experience and
                identification on the platform.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Subscription information:</strong> Managed through
                Paddle to securely process payments.
              </span>
            </li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Compromiso de privacidad de RapidQuizz:</strong> No
              recopilamos información adicional innecesaria. Tu privacidad es
              nuestra prioridad.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'information-usage',
      title: 'How we use your information',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use your personal information only for the following legitimate
            purposes:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Service provision:</strong> To allow you to create,
                save, and manage your AI-generated quizzes.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Authentication and security:</strong> To verify your
                identity and protect your account.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Subscription management:</strong> To process payments
                and manage your subscription plan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Essential communications:</strong> To send you important
                service updates.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Service improvement:</strong> To optimize the AI quiz
                generation functionality.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'information-sharing',
      title: 'Sharing information with third parties',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              No-sharing policy
            </h4>
            <p className="text-sm text-green-700 leading-relaxed">
              <strong>
                RapidQuizz no vende, alquila ni comparte tu información personal
                con terceros
              </strong>{' '}
              con fines comerciales o de marketing.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Limited exceptions:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Essential service providers:</strong> Supabase
                  (database) and Paddle (payment processing) operating under
                  strict confidentiality agreements.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>Legal requirements:</strong> Only when mandatory by
                  law or to protect legitimate rights.
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'storage-security',
      title: 'Storage and security',
      icon: <Database className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Infrastructure
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Secure database on Supabase</li>
                <li>• Data encryption in transit and at rest</li>
                <li>• Certified and monitored servers</li>
                <li>• Automatic backups</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Protection measures
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Secure authentication</li>
                <li>• Role-based access control</li>
                <li>• 24/7 security monitoring</li>
                <li>• Regular security updates</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Although we implement best security
              practices, no system is 100% secure. We recommend using strong and
              unique passwords.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'user-rights',
      title: 'Your rights as a user',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            According to data protection regulations, you have the following
            rights:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">
                Access and control rights:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Access:</strong> Request a copy of your personal
                    data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Rectification:</strong> Correct inaccurate or
                    incomplete data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Deletion:</strong> Request deletion of your data
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Additional rights:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Portability:</strong> Receive your data in
                    structured format
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Limitation:</strong> Restrict processing of your
                    data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Objection:</strong> Object to processing of your
                    data
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              To exercise any of these rights, contact us through your account
              settings or by sending an email. We will respond within a maximum
              of 30 days.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and tracking technologies',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies and similar technologies to improve your experience
            on our platform:
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Essential cookies</h4>
              <p className="text-sm text-muted-foreground">
                Necessary for basic site operation, authentication and security.
                Cannot be disabled.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Functionality cookies
              </h4>
              <p className="text-sm text-muted-foreground">
                Allow remembering your preferences and settings to improve your
                user experience.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Analytics cookies</h4>
              <p className="text-sm text-muted-foreground">
                Help us understand how you use the application to improve our
                services. You can disable them without affecting functionality.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'minors-protection',
      title: 'Protection of minors',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Age restriction</h4>
            <p className="text-sm text-red-700 leading-relaxed">
              RapidQuizz está destinado para usuarios mayores de 13 años. No
              recopilamos conscientemente información personal de niños menores
              de 13 años.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            If we discover that we have collected information from a child under
            13 without verifiable parental consent, we will take immediate
            measures to delete such information from our servers.
          </p>
          <p className="text-sm text-muted-foreground">
            If you are a parent or guardian and know that your child has
            provided us with personal information, please contact us
            immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'policy-changes',
      title: 'Changes to this policy',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to update this privacy policy at any time to
            reflect changes in our services or applicable legislation.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Update process:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>We will publish any changes on this page</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>We will update the "last updated" date</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  For significant changes, we will notify you by email
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>We recommend reviewing this policy periodically</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact and inquiries',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions, concerns, or requests related to this privacy
            policy or the processing of your personal data, don't hesitate to
            contact us:
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Contact information:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Email:{' '}
                    <a
                      href="mailto:privacy@rapidquizz.com"
                      className="text-primary hover:underline"
                    >
                      privacy@rapidquizz.com
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Contact form available in your account settings</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Response time:</strong> We commit to responding to all
                  privacy-related inquiries within a maximum of 30 business
                  days.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'terms-conditions',
      title: 'Términos y Condiciones',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta Política de Privacidad debe leerse junto con nuestros Términos
            y Condiciones, que establecen las reglas y regulaciones para el uso
            de RapidQuizz.
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Documentos relacionados:
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    <a
                      href="/terms"
                      className="text-primary hover:underline font-medium"
                    >
                      Términos y Condiciones de RapidQuizz
                    </a>{' '}
                    - Reglas de uso de nuestra plataforma
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    Política de Privacidad de RapidQuizz - Protección de tus
                    datos personales
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Importante:</strong> Al usar RapidQuizz, aceptas tanto
                  nuestra Política de Privacidad como nuestros Términos y
                  Condiciones.
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
            <h1 className="text-4xl font-bold">
              Política de Privacidad de RapidQuizz
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            En RapidQuizz, nuestra aplicación de generación de cuestionarios con
            IA, tu privacidad es fundamental. Esta política explica cómo
            recopilamos, usamos y protegemos tu información personal.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
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
                <Eye className="w-6 h-6 text-primary" />
                Policy summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <Database className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Minimal data</h3>
                  <p className="text-sm text-muted-foreground">
                    We only collect your email and name
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Lock className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">No sharing</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't sell or share your data
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Maximum security</h3>
                  <p className="text-sm text-muted-foreground">
                    Encryption and advanced protection
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Policy sections */}
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

        {/* Policy footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Separator className="mb-8" />
          <div className="bg-muted/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Have questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're here to help you. If you have any questions about our
              privacy policy or the handling of your data, don't hesitate to
              contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:privacy@rapidquizz.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact by email
              </a>
              <span className="text-sm text-muted-foreground">
                or use the form in your account settings
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
