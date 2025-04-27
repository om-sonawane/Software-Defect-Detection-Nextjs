"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getModelPerformance, getTrainingData } from "@/lib/model"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface ModelPerformance {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  confusionMatrix: {
    truePositive: number
    trueNegative: number
    falsePositive: number
    falseNegative: number
  }
}

interface TrainingData {
  defectDistribution: {
    defective: number
    nonDefective: number
  }
  featureImportance: {
    name: string
    importance: number
  }[]
}

export default function TrainingPage() {
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance | null>(null)
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const performance = await getModelPerformance()
        const data = await getTrainingData()

        setModelPerformance(performance)
        setTrainingData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  const renderPerformanceMetrics = () => {
    if (!modelPerformance) return null

    const performanceData = [
      { name: "Accuracy", value: modelPerformance.accuracy },
      { name: "Precision", value: modelPerformance.precision },
      { name: "Recall", value: modelPerformance.recall },
      { name: "F1 Score", value: modelPerformance.f1Score },
    ]

    return (
      <div className="space-y-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" domain={[0, 1]} />
              <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} labelStyle={{ color: "white" }} />
              <Legend />
              <Bar dataKey="value" name="Score" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Confusion Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-900 p-4 rounded">
                  <p className="text-sm">True Positive</p>
                  <p className="text-2xl font-bold">{modelPerformance.confusionMatrix.truePositive}</p>
                </div>
                <div className="bg-red-900 p-4 rounded">
                  <p className="text-sm">False Positive</p>
                  <p className="text-2xl font-bold">{modelPerformance.confusionMatrix.falsePositive}</p>
                </div>
                <div className="bg-red-900 p-4 rounded">
                  <p className="text-sm">False Negative</p>
                  <p className="text-2xl font-bold">{modelPerformance.confusionMatrix.falseNegative}</p>
                </div>
                <div className="bg-green-900 p-4 rounded">
                  <p className="text-sm">True Negative</p>
                  <p className="text-2xl font-bold">{modelPerformance.confusionMatrix.trueNegative}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-bold">{(modelPerformance.accuracy * 100).toFixed(2)}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Precision:</span>
                  <span className="font-bold">{(modelPerformance.precision * 100).toFixed(2)}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Recall:</span>
                  <span className="font-bold">{(modelPerformance.recall * 100).toFixed(2)}%</span>
                </li>
                <li className="flex justify-between">
                  <span>F1 Score:</span>
                  <span className="font-bold">{(modelPerformance.f1Score * 100).toFixed(2)}%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderTrainingData = () => {
    if (!trainingData) return null

    const defectDistributionData = [
      { name: "Defective", value: trainingData.defectDistribution.defective },
      { name: "Non-Defective", value: trainingData.defectDistribution.nonDefective },
    ]

    // Sort feature importance in descending order and take top 10
    const topFeatures = [...trainingData.featureImportance].sort((a, b) => b.importance - a.importance).slice(0, 10)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Defect Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Distribution of defective vs non-defective samples in training data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={defectDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {defectDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      labelStyle={{ color: "white" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Feature Importance</CardTitle>
              <CardDescription className="text-gray-400">
                Top 10 most important features for defect prediction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topFeatures} layout="vertical" margin={{ top: 5, right: 30, left: 90, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" stroke="#ccc" />
                    <YAxis type="category" dataKey="name" stroke="#ccc" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#333", border: "none" }}
                      labelStyle={{ color: "white" }}
                    />
                    <Bar dataKey="importance" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Model Training & Performance</h1>
          <Link href="/">
            <Button variant="outline" className="border-white text-white hover:bg-gray-700">
              Back to Home
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading data...</span>
          </div>
        ) : (
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="performance">Model Performance</TabsTrigger>
              <TabsTrigger value="data">Training Data</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="mt-6">
              {renderPerformanceMetrics()}
            </TabsContent>
            <TabsContent value="data" className="mt-6">
              {renderTrainingData()}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
