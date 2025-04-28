"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { isLoggedIn, logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { motion } from "framer-motion"

export function Header() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const userLoggedIn = isLoggedIn()

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Defect<span className="text-yellow-300">Detect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-white hover:text-yellow-300 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-white hover:text-yellow-300 transition-colors">
              How It Works
            </Link>
            <Link href="#about" className="text-white hover:text-yellow-300 transition-colors">
              About
            </Link>
            {userLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/home">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-md"
        >
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link
              href="/"
              className="block py-2 text-white hover:text-yellow-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="block py-2 text-white hover:text-yellow-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block py-2 text-white hover:text-yellow-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="block py-2 text-white hover:text-yellow-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {userLoggedIn ? (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link href="/home" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white/10 text-white hover:bg-white/20">Dashboard</Button>
                </Link>
                <Button
                  className="w-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white/10 text-white hover:bg-white/20">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
