"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserDefectHistory } from "@/lib/model"
import { isLoggedIn } from "@/lib/auth"
import type { DefectResult } from "@/types/defect"
import { Loader2, ArrowLeft, Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<DefectResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login")
      return
    }

    // Fetch user's defect detection history
    const fetchHistory = async () => {
      try {
        const data = await getUserDefectHistory(20) // Get last 20 results
        setHistory(data)
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [router])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Detection History</h1>
          <Link href="/home">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading history...</span>
          </div>
        ) : history.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-8 text-center">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-white/10 rounded-full p-6 mb-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Detection History</h2>
                <p className="text-white/70 mb-6">
                  You haven't performed any defect detection yet. Start by analyzing your first software module.
                </p>
                <Link href="/detect">
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold">
                    Start Detection
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Recent Defect Detection Results</CardTitle>
                  <CardDescription className="text-white/70">
                    Your last {history.length} defect detection analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {history.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card
                          className={`border ${
                            result.defect_detected
                              ? "border-red-500/50 bg-red-900/20"
                              : "border-green-500/50 bg-green-900/20"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                {result.defect_detected ? (
                                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                                ) : (
                                  <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                                )}
                                <div>
                                  <h3 className="font-medium">
                                    {result.defect_detected ? "Defect Detected" : "No Defect Detected"}
                                  </h3>
                                  {result.reason && <p className="text-sm text-white/70">{result.reason}</p>}
                                </div>
                              </div>
                              <div className="text-right text-sm text-white/70">
                                <div className="flex items-center justify-end">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(result.created_at)}
                                </div>
                                <div className="flex items-center justify-end">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(result.created_at)}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="bg-white/10 rounded p-2">
                                <span className="text-white/60">LOC:</span>{" "}
                                <span className="font-medium">{result.metrics.loc}</span>
                              </div>
                              <div className="bg-white/10 rounded p-2">
                                <span className="text-white/60">Complexity:</span>{" "}
                                <span className="font-medium">{result.metrics.vg}</span>
                              </div>
                              <div className="bg-white/10 rounded p-2">
                                <span className="text-white/60">Essential:</span>{" "}
                                <span className="font-medium">{result.metrics.ev}</span>
                              </div>
                              <div className="bg-white/10 rounded p-2">
                                <span className="text-white/60">Effort:</span>{" "}
                                <span className="font-medium">{result.metrics.e}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
