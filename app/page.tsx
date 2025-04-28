"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Code, BarChart2, Zap, ArrowRight, FileCode, Database, LineChart, AlertTriangle } from "lucide-react"

// Background images for carousel
const backgroundImages = [
  "/astro.jpg",
  "/blue.jpg",
  "/desk.jpg",
]

// Features data
const features = [
  {
    icon: <Shield className="h-8 w-8 text-yellow-400" />,
    title: "Defect Prediction",
    description:
      "Identify potential software defects before they impact your users using advanced machine learning algorithms.",
  },
  {
    icon: <Code className="h-8 w-8 text-yellow-400" />,
    title: "Code Quality Analysis",
    description: "Analyze 20+ software metrics to assess code quality and identify areas for improvement.",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-yellow-400" />,
    title: "Performance Metrics",
    description: "Track model performance with detailed metrics including accuracy, precision, recall, and F1 score.",
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-400" />,
    title: "Real-time Results",
    description: "Get instant defect predictions and detailed reports to help you improve your software quality.",
  },
]

// How it works steps
const steps = [
  {
    icon: <FileCode className="h-8 w-8 text-purple-700" />,
    title: "Input Metrics",
    description: "Enter software metrics like lines of code, complexity, and Halstead metrics.",
  },
  {
    icon: <Database className="h-8 w-8 text-purple-700" />,
    title: "Process Data",
    description: "Our machine learning model analyzes the metrics to identify potential defects.",
  },
  {
    icon: <LineChart className="h-8 w-8 text-purple-700" />,
    title: "Analyze Results",
    description: "Review the defect prediction results and detailed analysis.",
  },
  {
    icon: <AlertTriangle className="h-8 w-8 text-purple-700" />,
    title: "Take Action",
    description: "Address identified issues to improve software quality and reliability.",
  },
]

// Team members data with subtle size differences
const teamMembers = [
  {
    name: "Siddhi Chaudhri",
    role: "UI/UX Designer",
    image: "sidd.jpg",
    bgColor: "bg-orange-200",
    size: "w-52 h-52", // Slightly larger
  },
  {
    name: "Om Sonawane",
    role: "Full Stack Developer",
    image: "omii.png",
    bgColor: "bg-gray-200",
    size: "w-56 h-56", // Largest (center)
  },
  {
    name: "Neha Sonawane",
    role: "UI/UX Designer",
    image: "neha.jpeg",
    bgColor: "bg-gray-400",
    size: "w-52 h-52", // Medium size
  },
  {
    name: "Rajeshwar Swami",
    role: "Research Analyst",
    image: "raj.jpeg",
    bgColor: "bg-blue-900",
    size: "w-52 h-52", // Slightly larger
  },
 
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Change background image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background image carousel */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: index === currentImageIndex ? 1 : 0,
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
    
         
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Predict Software <span className="text-yellow-300">Defects</span> Before They Happen
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
                Our machine learning-powered platform analyzes software metrics to identify potential defects before
                they impact your users.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 text-lg font-bold py-6 px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 transition-all duration-300 text-lg font-bold py-6 px-8"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-16 text-white text-center"
            >
              <p className="text-lg mb-4">Trusted by developers worldwide</p>
              <div className="flex justify-center space-x-8">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-yellow-300">87%</div>
                  <div>Accuracy</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-yellow-300">300+</div>
                  <div>Projects Analyzed</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-yellow-300">20+</div>
                  <div>Metrics Tracked</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Our software defect detection platform offers a comprehensive set of features to help you improve code
              quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Our platform uses machine learning to analyze software metrics and predict potential defects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all duration-300 h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-purple-900 font-bold">
                    {index + 1}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-2 bg-yellow-400/50 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 text-lg font-bold"
              >
                Try It Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section (Replacing Testimonials) */}
      <section id="about" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The brilliant minds behind our software defect detection technology
            </p>
          </div>

         {/* Clean team layout with subtle size differences */}
<div className="flex flex-wrap justify-center items-center gap-6 mb-16">
  {teamMembers.map((member, index) => {
    // Center member gets special treatment
    const isCenter = index === 1;
    // First image index
    const isFirst = index === 0;
    // First image index
    const isSecond = index === 2;
    // Last image index
    const isLast = index === teamMembers.length - 1;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className={`flex flex-col items-center ${isCenter ? "order-0 md:-mt-4" : ""}`}
      >
        <div className="relative mb-6 group">
          <div className="absolute inset-0 rounded-full bg-pink-200/30 blur-md transform group-hover:scale-110 transition-transform duration-300"></div>
          <div
            className={`relative ${member.size} rounded-full overflow-hidden border-4 border-white/20 ${member.bgColor} transition-transform duration-300 hover:scale-105`}
          >
            <img
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              className={`w-full h-full object-cover 
                ${isFirst ? 'object-[40%_10%]' : ''} // First image: slightly left
                ${isCenter ? 'object-[60%_0%]' : ''} // Second image: slightly left
                ${isSecond ? 'object-[60%_20%]' : ''} // Third image: slightly left
                ${isLast ? 'object-[50%_10%]' : ''}  // Last image: slightly down
              `}
            />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">{member.name}</h3>
        <p className="text-yellow-300">{member.role}</p>
      </motion.div>
    );
  })}
</div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-4xl mx-auto">
            <p className="text-white/90 text-center text-lg leading-relaxed">
              Our team combines expertise in machine learning, software engineering, and data science to create
              cutting-edge defect detection solutions. With decades of combined experience in software quality assurance
              and AI, we're passionate about helping developers build more reliable software.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Improve Your Software Quality?</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-10">
              Join thousands of developers who use our platform to detect and prevent software defects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-purple-900 hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 text-lg font-bold py-6 px-8"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 transition-all duration-300 text-lg font-bold py-6 px-8"
                >
                  Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
