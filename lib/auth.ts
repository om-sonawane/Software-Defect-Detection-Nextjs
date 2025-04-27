// Authentication functions using Supabase

import { createClient } from "@/lib/supabase/client"
import type { User } from "@/types/user"

// Type for registration form data
interface RegistrationData {
  fullName: string
  address: string
  gender: string
  age: string
  username: string
  email: string
  phoneNo: string
  password: string
}

// Function to register a new user
export async function registerUser(userData: RegistrationData): Promise<boolean> {
  try {
    const supabase = createClient()

    // Check if username already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", userData.username)
      .single()

    if (existingUser) {
      console.log("Username already exists")
      return false // Username already exists
    }

    // Insert new user
    const { error } = await supabase.from("users").insert([
      {
        full_name: userData.fullName,
        address: userData.address,
        username: userData.username,
        email: userData.email,
        phone_number: userData.phoneNo,
        gender: userData.gender,
        age: Number.parseInt(userData.age),
        // In a real app, you would hash the password
        password: userData.password,
      },
    ])

    if (error) {
      console.error("Registration error:", error)
      return false
    }

    console.log("User registered successfully")
    return true
  } catch (error) {
    console.error("Registration error:", error)
    return false
  }
}

// Function to login a user
export async function loginUser(username: string, password: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Find user with matching username and password
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password) // In a real app, you would verify hashed passwords
      .single()

    if (error || !data) {
      console.log("Login failed:", error || "No matching user found")
      return false
    }

    // Store user session in localStorage
    const user: User = {
      id: data.id,
      username: data.username,
      fullName: data.full_name,
      email: data.email,
    }

    localStorage.setItem("user", JSON.stringify(user))
    console.log("User logged in successfully:", user.username)
    return true
  } catch (error) {
    console.error("Login error:", error)
    return false
  }
}

// Function to check if user is logged in
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const user = localStorage.getItem("user")
  return !!user
}

// Function to logout user
export function logoutUser(): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("user")
  console.log("User logged out")
}

// Function to get current user
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}
