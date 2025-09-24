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
      title: 'Acceptance of Terms',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing and using RapidQuizz, our AI-powered quiz generation
            platform, you agree to be bound by these Terms and Conditions. If
            you do not agree with any of these terms, you should not use our
            service.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> These terms constitute a legally
              binding agreement between you and RapidQuizz. We recommend reading
              them carefully.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'service-description',
      title: 'Service Description',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz is a web application that uses artificial intelligence to
            generate personalized quizzes. Our service includes:
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Automatic quiz generation</strong> using advanced AI
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Content personalization</strong> according to your
                specific needs
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Secure storage</strong> of your quizzes and data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>Account management</strong> and history of generated
                quizzes
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            To use RapidQuizz, you must create an account and provide us with
            accurate and complete information.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                User Responsibilities
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Maintain the confidentiality of your password</li>
                <li>• Provide truthful and up-to-date information</li>
                <li>
                  • Immediately notify any unauthorized use of your account
                </li>
                <li>
                  • Be responsible for all activities performed under your
                  account
                </li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Age Restrictions</h4>
              <p className="text-sm text-muted-foreground">
                You must be at least 13 years old to use RapidQuizz. If you are
                under 18, you need consent from your parents or legal guardians.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By using RapidQuizz, you agree to use the service responsibly and
            legally.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-green-700">
                ✅ Permitted Uses
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Create quizzes for educational use</li>
                <li>• Generate content for corporate training</li>
                <li>• Develop professional assessments</li>
                <li>• Personal and academic use</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-red-700">
                ❌ Prohibited Uses
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Generate illegal or harmful content</li>
                <li>• Create quizzes with offensive content</li>
                <li>• Attempt to hack or compromise the system</li>
                <li>• Resell or redistribute the service</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Violation of these rules may result in
              suspension or termination of your account without prior notice.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'subscription-payment',
      title: 'Subscriptions and Payments',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz offers different subscription plans to access our premium
            features.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Processing
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Payments are processed securely through Paddle</li>
                <li>• We accept major credit and debit cards</li>
                <li>• Prices are displayed in local currency when possible</li>
                <li>• Subscriptions renew automatically</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Refund Policy</h4>
              <p className="text-sm text-muted-foreground">
                We offer full refunds within the first 14 days after purchase.
                To request a refund, contact our support.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Cancellation</h4>
              <p className="text-sm text-muted-foreground">
                You can cancel your subscription at any time from your account
                dashboard. Cancellation will be effective at the end of the
                current billing period.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">RapidQuizz Property</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• The platform and its technology</li>
                <li>• Artificial intelligence algorithms</li>
                <li>• Design and user interface</li>
                <li>• Brand and logos</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Your Property</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Quizzes you generate</li>
                <li>• Original content you provide</li>
                <li>• Data and responses from your quizzes</li>
                <li>• Personal settings</li>
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Usage License:</strong> We grant you a limited,
              non-exclusive, and revocable license to use RapidQuizz according
              to these terms. You may not copy, modify, or distribute our
              technology.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy-data',
      title: 'Privacy and Data Protection',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Protecting your privacy is fundamental to RapidQuizz. Our handling
            of personal data is governed by our Privacy Policy.
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Related documents:
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    <a
                      href="/privacy"
                      className="text-primary hover:underline font-medium"
                    >
                      RapidQuizz Privacy Policy
                    </a>{' '}
                    - Details about personal data protection
                  </span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Commitment:</strong> We comply with GDPR, CCPA, and
                  other applicable data protection regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'service-availability',
      title: 'Service Availability',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            We strive to keep RapidQuizz available 24/7, but interruptions may
            occur due to maintenance, updates, or unforeseen circumstances.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Scheduled Maintenance
              </h4>
              <p className="text-sm text-muted-foreground">
                We will notify you at least 24 hours in advance of any scheduled
                maintenance that may affect the service.
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">
                Unscheduled Interruptions
              </h4>
              <p className="text-sm text-muted-foreground">
                In case of unexpected interruptions, we will work to restore the
                service as quickly as possible and keep you informed of
                progress.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Important Limitations
            </h4>
            <p className="text-sm text-yellow-700 leading-relaxed">
              RapidQuizz is provided "as is" without warranties of any kind. We
              will not be liable for indirect, incidental, or consequential
              damages.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Liability Exclusions:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Data loss due to external factors</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Service interruptions due to force majeure</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Improper use of AI-generated content</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>Issues arising from third-party use</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'termination',
      title: 'Service Termination',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Termination by you</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You can cancel your account at any time</li>
                <li>
                  • Cancellation is effective at the end of the paid period
                </li>
                <li>• You can export your data before canceling</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Termination by us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• For violation of these terms</li>
                <li>• For fraudulent or abusive use</li>
                <li>• For non-payment (after notice)</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Important:</strong> After termination, you will have 30
              days to export your data before it is permanently deleted from our
              servers.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'legal-jurisdiction',
      title: 'Applicable Law and Jurisdiction',
      icon: <Gavel className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            These terms are governed by the laws of [COUNTRY/STATE] without
            regard to conflict of laws principles.
          </p>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Dispute Resolution</h4>
              <p className="text-sm text-muted-foreground">
                Any dispute related to these terms will be resolved through
                binding arbitration or in the competent courts of
                [JURISDICTION].
              </p>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Severability</h4>
              <p className="text-sm text-muted-foreground">
                If any provision of these terms is deemed invalid, the remaining
                provisions will remain in full force and effect.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'changes-terms',
      title: 'Changes to Terms',
      icon: <Calendar className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            RapidQuizz reserves the right to modify these terms at any time to
            reflect changes in our services or applicable legislation.
          </p>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Update process:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                <span>We will publish changes on this page</span>
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
                <span>Continued use implies acceptance of the new terms</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'contact-support',
      title: 'Contact and Support',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about these terms or need technical support,
            don't hesitate to contact us:
          </p>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-lg p-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Contact information:</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>
                    General email:{' '}
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
                    Legal matters:{' '}
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
                  <span>Contact form available in your account settings</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground">
                  <strong>Response time:</strong> We commit to responding to all
                  legal terms-related inquiries within a maximum of 48 hours.
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
              RapidQuizz Terms and Conditions
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            These terms establish the rules and regulations for the use of
            RapidQuizz, our artificial intelligence-powered quiz generation
            platform.
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
                <CheckCircle className="w-6 h-6 text-primary" />
                Terms Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <User className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Responsible Use</h3>
                  <p className="text-sm text-muted-foreground">
                    Use RapidQuizz ethically and legally
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure processing via Paddle
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Shield className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Your Rights</h3>
                  <p className="text-sm text-muted-foreground">
                    You protect your content and data
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
              Do you have legal questions?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We're here to help you. If you have any questions about these
              terms or the use of RapidQuizz, don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:legal@rapidquizz.com"
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
