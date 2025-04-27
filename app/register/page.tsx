"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { registerUser } from "@/lib/auth"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

// Background images for carousel
const backgroundImages = [
  "/im.png",
  "/im1.png",
  "/im3.png",
]

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    gender: "male",
    age: "",
    username: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Change background image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const validateStep = (step: number): boolean => {
    setError("")

    if (step === 1) {
      // Validate personal information
      if (!formData.fullName.trim()) {
        setError("Please enter your full name")
        return false
      }
      if (!formData.address.trim()) {
        setError("Please enter your address")
        return false
      }
      if (!formData.age.trim()) {
        setError("Please enter your age")
        return false
      }
      const age = Number.parseInt(formData.age)
      if (isNaN(age) || age <= 0 || age > 100) {
        setError("Please enter a valid age between 1 and 100")
        return false
      }
    } else if (step === 2) {
      // Validate contact information
      if (!formData.username.trim()) {
        setError("Please enter a username")
        return false
      }
      // Email validation
      const emailRegex = /^[a-z0-9]+[._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return false
      }
      // Phone validation
      if (formData.phoneNo.length !== 10 || !/^\d+$/.test(formData.phoneNo)) {
        setError("Please enter a valid 10-digit phone number")
        return false
      }
    } else if (step === 3) {
      // Validate password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
if (!passwordRegex.test(formData.password)) {
  setError(
    "Password must contain at least 6 characters, including uppercase, lowercase, number and special character"
  );
  return false;  // This ensures the function exits and doesn't continue further
}
      // Confirm password
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
    }

    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setLoading(true)

    try {
      const success = await registerUser(formData)
      if (success) {
        router.push("/login")
      } else {
        setError("Username already exists or registration failed")
      }
    } catch (err) {
      setError("An error occurred during registration")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? "bg-yellow-400 text-purple-900"
                  : index + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-white/30 text-white"
              } font-bold text-sm`}
            >
              {index + 1 < currentStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={`w-10 h-1 ${index + 1 < currentStep ? "bg-green-500" : "bg-white/30"}`}></div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter your address"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Gender</Label>
              <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" className="border-white/50 text-yellow-400" />
                  <Label htmlFor="male" className="text-white">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" className="border-white/50 text-yellow-400" />
                  <Label htmlFor="female" className="text-white">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter your age"
              />
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Choose a username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNo" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phoneNo"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Enter your 10-digit phone number"
              />
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Create a password"
              />
              <p className="text-xs text-white/70">
                Password must contain at least 6 characters, including uppercase, lowercase, number and special
                character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                placeholder="Confirm your password"
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
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
        <div className="absolute inset-0 bg-gray-900/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="text-white/80 mt-2">Register to use the software defect detection system</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">Registration</CardTitle>
              <CardDescription className="text-center text-white/70">
                Step {currentStep} of {totalSteps}:{" "}
                {currentStep === 1 ? "Personal Information" : currentStep === 2 ? "Contact Information" : "Security"}
              </CardDescription>
              {renderStepIndicator()}
            </CardHeader>
            <CardContent>
              <form
                onSubmit={currentStep === totalSteps ? handleSubmit : (e) => e.preventDefault()}
                className="space-y-4"
              >
                {error && (
                  <Alert variant="destructive" className="bg-red-500/80 border-red-600 text-white">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {renderStepContent()}

                <div className="flex justify-between mt-6">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      Back
                    </Button>
                  ) : (
                    <Link href="/">
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        Cancel
                      </Button>
                    </Link>
                  )}

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-white/80">
                Already have an account?{" "}
                <Link href="/login" className="text-yellow-300 hover:text-yellow-200 font-semibold">
                  Login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
