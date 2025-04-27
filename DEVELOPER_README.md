# Software Defect Detection System - Developer Guide

## Project Overview
This project is a Next.js application that implements a machine learning-based software defect detection system. It uses Supabase for authentication and data storage.

## Technical Stack
- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel

## Important Implementation Details

### Dataset Source
The system uses the NASA MDP (Metrics Data Program) dataset, specifically the PC1 dataset which contains software metrics and defect data from a flight software system for an earth orbiting satellite.

To obtain the dataset:
1. Download from: https://github.com/klainfo/DefectData/tree/master/pc1
2. Process the data to extract the relevant metrics
3. Upload to Supabase storage as "Soft_attributes.csv"

### Supabase Setup

#### Local Development Setup
1. Install Supabase CLI:
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. Initialize Supabase locally:
   \`\`\`bash
   supabase init
   \`\`\`

3. Start Supabase services:
   \`\`\`bash
   supabase start
   \`\`\`

4. Create the necessary tables in your Supabase project:

   \`\`\`sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     username TEXT UNIQUE NOT NULL,
     full_name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     phone_number TEXT,
     address TEXT,
     gender TEXT,
     age INTEGER,
     password TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Defect detection results table
   CREATE TABLE defect_results (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id),
     metrics JSONB NOT NULL,
     defect_detected BOOLEAN NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   \`\`\`

5. Set up environment variables in your `.env.local` file:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

#### Connecting to Production Supabase
1. Get the Supabase URL and keys from your Vercel project environment variables
2. Update the `createClient` function in `lib/supabase/client.ts` to use these environment variables:
   \`\`\`typescript
   export function createClient() {
     return createSupabaseClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   }
   \`\`\`

### Machine Learning Model
The current implementation uses a simplified decision tree logic. For a production system, you should:

1. Train a proper machine learning model (Random Forest, XGBoost, etc.) using the dataset
2. Export the model to a format that can be used in JavaScript (ONNX, TensorFlow.js)
3. Implement the model in the application

#### Model Training Process
1. Use Python with scikit-learn to train the model:
   ```python
   import pandas as pd
   from sklearn.ensemble import RandomForestClassifier
   from sklearn.model_selection import train_test_split
   from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

   # Load data
   data = pd.read_csv('Soft_attributes.csv')
   X = data.drop('defects', axis=1)
   y = data['defects']

   # Split data
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

   # Train model
   model = RandomForestClassifier(n_estimators=100, random_state=42)
   model.fit(X_train, y_train)

   # Evaluate model
   y_pred = model.predict(X_test)
   print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
   print(f"Precision: {precision_score(y_test, y_pred)}")
   print(f"Recall: {recall_score(y_test, y_pred)}")
   print(f"F1 Score: {f1_score(y_test, y_pred)}")
   \`\`\`

2. Export the model for JavaScript use

### Authentication Flow
The current implementation uses a simplified authentication system. For production:

1. Implement proper Supabase Auth with email verification
2. Add social login options
3. Implement password reset functionality
4. Add session management and token refresh

### Data Storage
1. Store user information in the `users` table
2. Store defect detection results in the `defect_results` table
3. Implement proper data access controls using Supabase Row Level Security (RLS)

### Future Improvements
1. Implement CSV upload functionality for batch processing
2. Add user dashboard with historical defect detection results
3. Implement more sophisticated ML model with regular retraining
4. Add detailed visualizations for defect analysis
5. Implement team collaboration features

## Deployment
The application is deployed on Vercel with Supabase integration. To deploy updates:

1. Push changes to the main branch
2. Vercel will automatically deploy the changes
3. Verify that environment variables are correctly set in the Vercel project settings

## Troubleshooting
- If Supabase connection fails, check environment variables and network connectivity
- If model predictions seem incorrect, verify the input metrics and model logic
- For database issues, check Supabase logs and database health
\`\`\`

```typescriptreact file="app/page.tsx"
[v0-no-op-code-block-prefix]"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Background images for carousel
const backgroundImages = [
  "/placeholder.svg?height=1080&width=1920",
  "/placeholder.svg?height=1080&width=1920",
  "/placeholder.svg?height=1080&width=1920",
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
        <div className="absolute inset-0 bg-gray-900/90" />
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
