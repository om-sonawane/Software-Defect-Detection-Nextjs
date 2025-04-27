import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Defect<span className="text-yellow-300">Detect</span>
              </span>
            </Link>
            <p className="mt-4 text-white/70 max-w-md">
              Advanced software defect detection powered by machine learning. Predict and prevent software defects
              before they impact your users.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/om-sonawane" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/om-sonawane03/" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:omsonawane03@gmail.com" className="text-white/70 hover:text-yellow-300 transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-white/70 hover:text-yellow-300 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-yellow-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} DefectDetect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
