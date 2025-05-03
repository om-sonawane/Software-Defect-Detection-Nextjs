"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { parseCSVData, fetchAndParseCSV } from "@/lib/csv-parser"
import { batchProcessMetrics, generateBatchReport } from "@/lib/model"
import { Download, FileSpreadsheet, Upload, AlertTriangle, CheckCircle, Loader2, Link2 } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"

export function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [csvUrl, setCsvUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const [batchResult, setBatchResult] = useState<any>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError("")
      setBatchResult(null)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleProcessFile = async () => {
    if (uploadMethod === "file" && !file) {
      setError("Please select a file first")
      return
    }

    if (uploadMethod === "url" && !csvUrl) {
      setError("Please enter a CSV URL")
      return
    }

    setIsUploading(true)
    setProgress(10)
    setError("")

    try {
      let metricsArray: Record<string, number>[] = []

      if (uploadMethod === "file" && file) {
        // Parse the CSV file
        metricsArray = await parseCSVData(file)
      } else if (uploadMethod === "url" && csvUrl) {
        // Fetch and parse CSV from URL
        metricsArray = await fetchAndParseCSV(csvUrl)
      }

      setProgress(40)

      if (metricsArray.length === 0) {
        throw new Error("No valid data found in the CSV file. Please check the format.")
      }

      setIsUploading(false)
      setIsProcessing(true)
      setProgress(60)

      // Process the metrics
      const result = await batchProcessMetrics(metricsArray)
      setProgress(100)
      setBatchResult(result)
    } catch (err: any) {
      setError(err.message || "An error occurred while processing the file")
      setProgress(0)
    } finally {
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const handleDownloadReport = async () => {
    if (!batchResult) return

    setIsGeneratingReport(true)

    try {
      const reportBlob = await generateBatchReport(batchResult)
      const url = URL.createObjectURL(reportBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `defect-batch-report-${new Date().toISOString().slice(0, 10)}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || "Failed to generate report")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-6 w-6 text-yellow-400" />
          CSV Batch Analysis
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload a CSV file with software metrics to detect defects in multiple modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="bg-red-900 border-red-800 text-white mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!batchResult ? (
          <div className="space-y-4">
            <div className="flex space-x-4 mb-4">
              <Button
                variant={uploadMethod === "file" ? "default" : "outline"}
                onClick={() => setUploadMethod("file")}
                className={uploadMethod === "file" ? "bg-yellow-400 text-purple-900" : ""}
              >
                Upload File
              </Button>
              <Button
                variant={uploadMethod === "url" ? "default" : "outline"}
                onClick={() => setUploadMethod("url")}
                className={uploadMethod === "url" ? "bg-yellow-400 text-purple-900" : ""}
              >
                Use URL
              </Button>
            </div>

            {uploadMethod === "file" ? (
              <>
                <input type="file" accept=".csv" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-400 transition-colors"
                >
                  <Upload className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">{file ? file.name : "Click to upload or drag and drop"}</p>
                  <p className="text-xs text-gray-500">CSV file with software metrics (max 5MB)</p>
                </div>

                {file && (
                  <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleProcessFile}
                      disabled={isUploading || isProcessing}
                      className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
                    >
                      {isUploading || isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isUploading ? "Uploading..." : "Processing..."}
                        </>
                      ) : (
                        "Analyze"
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter CSV URL"
                    value={csvUrl}
                    onChange={(e) => setCsvUrl(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button
                    onClick={handleProcessFile}
                    disabled={isUploading || isProcessing || !csvUrl}
                    className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold whitespace-nowrap"
                  >
                    {isUploading || isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isUploading ? "Fetching..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Example URLs:
                  <br />
                  https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Soft_attributes-APpL0g16OixX3wkxqKsiHaDf7fPbgF.csv
                  <br />
                  https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Test-thA6DEicyOHUEGdHhBxpgr9v8SdxA9.csv
                </p>
              </div>
            )}

            {(isUploading || isProcessing) && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-gray-700" />
                <p className="text-xs text-gray-400 text-center">
                  {isUploading
                    ? uploadMethod === "file"
                      ? "Uploading and parsing CSV..."
                      : "Fetching and parsing CSV..."
                    : "Processing metrics..."}
                </p>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Analysis Results</h3>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Total Modules</p>
                  <p className="text-3xl font-bold text-white">{batchResult.totalModules}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Defective Modules</p>
                  <p className="text-3xl font-bold text-red-400">{batchResult.defectiveModules}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-400">Defect Rate</p>
                  <p className="text-3xl font-bold text-yellow-400">{batchResult.defectPercentage.toFixed(1)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Module Status:</h4>
                <div className="max-h-60 overflow-y-auto pr-2">
                  {batchResult.results.map((result: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                        result.defect_detected
                          ? "bg-red-900/30 border border-red-800/50"
                          : "bg-green-900/30 border border-green-800/50"
                      }`}
                    >
                      <div className="flex items-center">
                        {result.defect_detected ? (
                          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Module {index + 1}</p>
                          {result.defect_detected && <p className="text-xs text-red-300">{result.reason}</p>}
                        </div>
                      </div>
                      <div className="text-xs text-right">
                        <p>LOC: {result.metrics.loc}</p>
                        <p>CC: {result.metrics.vg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleDownloadReport}
                disabled={isGeneratingReport}
                className="bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Detailed Report
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 border-t border-gray-700 pt-4">
        <p>
          CSV format should include columns for metrics like loc, v(g), ev(g), iv(g), etc. The system also supports
          files with a "defects" column (TRUE/FALSE or 1/0).
          <br />
          Need a template?{" "}
          <a href="#" className="text-yellow-400 hover:underline">
            Download sample CSV
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
