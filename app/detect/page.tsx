"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { detectDefects } from "@/lib/model"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function DetectPage() {
  const [formData, setFormData] = useState({
    loc: "",
    vg: "",
    ev: "",
    iv: "",
    n: "",
    v: "",
    l: "",
    d: "",
    i: "",
    e: "",
    t: "",
    lOCode: "",
    lOComment: "",
    lOBlank: "",
    locCodeAndComment: "",
    uniq_Op: "",
    uniq_Opnd: "",
    total_Op: "",
    total_Opnd: "",
    branchCount: "",
  })

  const [result, setResult] = useState<null | { defectDetected: boolean }>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      // Convert all form values to numbers
      const numericData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          acc[key] = Number.parseFloat(value)
          return acc
        },
        {} as Record<string, number>,
      )

      const result = await detectDefects(numericData)
      setResult(result)
    } catch (err) {
      console.error(err)
      setError("An error occurred while processing your request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Software Defect Detection</h1>
          <Link href="/">
            <Button variant="outline" className="border-white text-white hover:bg-gray-700">
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Input Software Metrics</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter the software metrics to detect potential defects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loc" className="text-white">
                        Lines of Code (LOC)
                      </Label>
                      <Input
                        id="loc"
                        name="loc"
                        type="number"
                        value={formData.loc}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vg" className="text-white">
                        Cyclomatic Complexity (v(g))
                      </Label>
                      <Input
                        id="vg"
                        name="vg"
                        type="number"
                        value={formData.vg}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ev" className="text-white">
                        Essential Complexity (ev(g))
                      </Label>
                      <Input
                        id="ev"
                        name="ev"
                        type="number"
                        value={formData.ev}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="iv" className="text-white">
                        Design Complexity (iv(g))
                      </Label>
                      <Input
                        id="iv"
                        name="iv"
                        type="number"
                        value={formData.iv}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="n" className="text-white">
                        Halstead Length (n)
                      </Label>
                      <Input
                        id="n"
                        name="n"
                        type="number"
                        value={formData.n}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="v" className="text-white">
                        Halstead Volume (v)
                      </Label>
                      <Input
                        id="v"
                        name="v"
                        type="number"
                        value={formData.v}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="l" className="text-white">
                        Halstead Level (l)
                      </Label>
                      <Input
                        id="l"
                        name="l"
                        type="number"
                        value={formData.l}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="d" className="text-white">
                        Halstead Difficulty (d)
                      </Label>
                      <Input
                        id="d"
                        name="d"
                        type="number"
                        value={formData.d}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="i" className="text-white">
                        Halstead Intelligence (i)
                      </Label>
                      <Input
                        id="i"
                        name="i"
                        type="number"
                        value={formData.i}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="e" className="text-white">
                        Halstead Effort (e)
                      </Label>
                      <Input
                        id="e"
                        name="e"
                        type="number"
                        value={formData.e}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="t" className="text-white">
                        Halstead Time (t)
                      </Label>
                      <Input
                        id="t"
                        name="t"
                        type="number"
                        value={formData.t}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lOCode" className="text-white">
                        Lines of Code (lOCode)
                      </Label>
                      <Input
                        id="lOCode"
                        name="lOCode"
                        type="number"
                        value={formData.lOCode}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lOComment" className="text-white">
                        Lines of Comments
                      </Label>
                      <Input
                        id="lOComment"
                        name="lOComment"
                        type="number"
                        value={formData.lOComment}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lOBlank" className="text-white">
                        Blank Lines
                      </Label>
                      <Input
                        id="lOBlank"
                        name="lOBlank"
                        type="number"
                        value={formData.lOBlank}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locCodeAndComment" className="text-white">
                        Code and Comment Lines
                      </Label>
                      <Input
                        id="locCodeAndComment"
                        name="locCodeAndComment"
                        type="number"
                        value={formData.locCodeAndComment}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uniq_Op" className="text-white">
                        Unique Operators
                      </Label>
                      <Input
                        id="uniq_Op"
                        name="uniq_Op"
                        type="number"
                        value={formData.uniq_Op}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="uniq_Opnd" className="text-white">
                        Unique Operands
                      </Label>
                      <Input
                        id="uniq_Opnd"
                        name="uniq_Opnd"
                        type="number"
                        value={formData.uniq_Opnd}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_Op" className="text-white">
                        Total Operators
                      </Label>
                      <Input
                        id="total_Op"
                        name="total_Op"
                        type="number"
                        value={formData.total_Op}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total_Opnd" className="text-white">
                        Total Operands
                      </Label>
                      <Input
                        id="total_Opnd"
                        name="total_Opnd"
                        type="number"
                        value={formData.total_Opnd}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branchCount" className="text-white">
                        Branch Count
                      </Label>
                      <Input
                        id="branchCount"
                        name="branchCount"
                        type="number"
                        value={formData.branchCount}
                        onChange={handleChange}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 mt-6" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Detect Defects"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700 text-white h-full">
              <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription className="text-gray-400">Analysis of software defect prediction</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="text-center">
                    {result.defectDetected ? (
                      <div className="space-y-4">
                        <div className="bg-red-900 text-white p-6 rounded-lg">
                          <h3 className="text-2xl font-bold mb-2">Software Defect Detected!</h3>
                          <p>
                            Based on the provided metrics, our model has detected potential defects in your software.
                          </p>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold mb-2">Report Generated</h4>
                          <p className="text-gray-300">
                            A detailed report has been generated with information about the potential defects and
                            recommendations for fixing them.
                          </p>
                          <Button className="mt-4 bg-red-700 hover:bg-red-800">Download Report</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-green-900 text-white p-6 rounded-lg">
                          <h3 className="text-2xl font-bold mb-2">No Software Defect Detected</h3>
                          <p>
                            Based on the provided metrics, our model has not detected any potential defects in your
                            software.
                          </p>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold mb-2">Report Generated</h4>
                          <p className="text-gray-300">
                            A detailed report has been generated confirming the quality of your software based on the
                            provided metrics.
                          </p>
                          <Button className="mt-4 bg-green-700 hover:bg-green-800">Download Report</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>Enter software metrics and click "Detect Defects" to analyze your code.</p>
                    <p className="mt-4">
                      Our machine learning model will predict potential defects based on the provided metrics.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
