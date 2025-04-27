"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Background images for carousel
const backgroundImages = [
  "/im.png",
  "/im1.png",
  "/im3.png",
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Change background image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
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
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/70 to-purple-600/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Software Defect <span className="text-yellow-300">Detection</span>
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
            Predict and prevent software defects using advanced machine learning
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
        >
          <Link href="/login" className="w-full">
            <Button
              size="lg"
              className="w-full bg-white text-purple-700 hover:bg-yellow-300 hover:text-purple-800 transition-all duration-300 text-lg font-bold py-6"
            >
              Login
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button
              size="lg"
              className="w-full bg-purple-700 text-white hover:bg-purple-800 transition-all duration-300 text-lg font-bold py-6"
            >
              Register
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 text-white text-center"
        >
          <p className="text-lg mb-4">Powered by advanced machine learning algorithms</p>
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
  )
}
