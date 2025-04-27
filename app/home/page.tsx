"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, BarChart2, Shield, Zap } from "lucide-react"

export default function HomePage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12 pt-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">Software Defect Detection</h1>
          <Button
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            Logout
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-purple-700" />
                </div>
                <CardTitle className="text-3xl group-hover:text-yellow-300 transition-colors">Detect Defects</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Input software metrics to predict potential defects
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white/90">
                <p className="mb-6">
                  Our model analyzes code metrics like complexity, lines of code, and more to identify potential issues
                  before they cause problems in production.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Analyze 20+ software metrics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Get instant defect predictions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Generate detailed reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/detect" className="w-full">
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold group-hover:scale-105 transition-transform">
                    Start Detection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 h-full overflow-hidden group">
              <CardHeader className="pb-2">
                <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center mb-4">
                  <BarChart2 className="h-8 w-8 text-yellow-400" />
                </div>
                <CardTitle className="text-3xl group-hover:text-yellow-300 transition-colors">Model Training</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  View model performance and training data
                </CardDescription>
              </CardHeader>
              <CardContent className="text-white/90">
                <p className="mb-6">
                  Explore the machine learning model's performance metrics and understand how it makes predictions based
                  on software attributes and historical data.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>View accuracy and precision metrics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Analyze feature importance</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Understand model performance</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/training" className="w-full">
                  <Button className="w-full bg-purple-900 hover:bg-purple-950 text-yellow-400 font-bold group-hover:scale-105 transition-transform">
                    View Training Data
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Zap className="mr-2 h-6 w-6 text-yellow-400" />
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">87%</div>
              <div className="text-white/80">Model Accuracy</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">20+</div>
              <div className="text-white/80">Metrics Analyzed</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="text-4xl font-bold text-yellow-300 mb-2">300+</div>
              <div className="text-white/80">Projects Processed</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
