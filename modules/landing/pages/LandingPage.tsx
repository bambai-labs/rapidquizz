import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { motion } from "framer-motion";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            QuizCraft
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Create engaging, interactive quizzes with stunning animations and
            instant feedback. Perfect for educators who want to make learning
            fun and memorable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <GoogleAuthButton />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 text-left"
          >
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">AI-Powered Generation</h3>
              <p className="text-sm text-muted-foreground">
                Generate quizzes instantly based on your subject and topics
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">Interactive Experience</h3>
              <p className="text-sm text-muted-foreground">
                Engaging animations and real-time feedback
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Detailed analytics and performance insights
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
