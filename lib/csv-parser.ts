// Utility to parse CSV files and extract software metrics

/**
 * Parse CSV data and convert it to an array of software metrics objects
 */
export async function parseCSVData(file: File): Promise<Record<string, number>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  
      reader.onload = (event) => {
        try {
          const csvData = event.target?.result as string
          if (!csvData) {
            throw new Error("Failed to read CSV file")
          }
  
          // Split the CSV into rows
          const rows = csvData.split(/\r?\n/).filter((row) => row.trim() !== "")
  
          // Extract headers (first row)
          const headers = rows[0].split(",").map((header) => header.trim())
  
          // Process data rows
          const metricsArray: Record<string, number>[] = []
  
          for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(",").map((value) => value.trim())
  
            // Skip rows with incorrect number of columns
            if (values.length !== headers.length) continue
  
            const metricsObject: Record<string, number> = {}
  
            // Map each value to its corresponding header
            headers.forEach((header, index) => {
              // Convert to number
              const numValue = Number.parseFloat(values[index])
              if (!isNaN(numValue)) {
                metricsObject[header] = numValue
              } else if (values[index].toLowerCase() === "true") {
                metricsObject[header] = 1
              } else if (values[index].toLowerCase() === "false") {
                metricsObject[header] = 0
              } else {
                metricsObject[header] = 0 // Default to 0 for non-numeric values
              }
            })
  
            // Ensure all required metrics are present
            if (validateMetrics(metricsObject)) {
              metricsArray.push(metricsObject)
            }
          }
  
          resolve(metricsArray)
        } catch (error) {
          reject(error)
        }
      }
  
      reader.onerror = () => {
        reject(new Error("Error reading file"))
      }
  
      reader.readAsText(file)
    })
  }
  
  /**
   * Validate that all required metrics are present in the object
   */
  function validateMetrics(metrics: Record<string, number>): boolean {
    // List of required metrics for defect detection
    const requiredMetrics = [
      "loc",
      "v(g)",
      "ev(g)",
      "iv(g)",
      "n",
      "v",
      "l",
      "d",
      "i",
      "e",
      "t",
      "lOCode",
      "lOComment",
      "lOBlank",
      "locCodeAndComment",
      "uniq_Op",
      "uniq_Opnd",
      "total_Op",
      "total_Opnd",
      "branchCount",
    ]
  
    // Check if all required metrics are present or have alternative names
    return requiredMetrics.every((metric) => {
      // Direct match
      if (metrics[metric] !== undefined) return true
  
      // Check for alternative naming conventions
      if (metric === "v(g)" && (metrics["vg"] !== undefined || metrics["cyclomatic_complexity"] !== undefined))
        return true
      if (metric === "ev(g)" && (metrics["ev"] !== undefined || metrics["essential_complexity"] !== undefined))
        return true
      if (metric === "iv(g)" && (metrics["iv"] !== undefined || metrics["design_complexity"] !== undefined)) return true
      if (metric === "branchCount" && metrics["branch_count"] !== undefined) return true
  
      // For the specific format in the provided files
      if (metric === "v(g)" && metrics["v(g)"] !== undefined) return true
      if (metric === "ev(g)" && metrics["ev(g)"] !== undefined) return true
      if (metric === "iv(g)" && metrics["iv(g)"] !== undefined) return true
      if (metric === "branchCount" && metrics["branchCount"] !== undefined) return true
  
      return false
    })
  }
  
  /**
   * Map CSV column names to our standard metric names
   */
  export function normalizeMetricNames(metrics: Record<string, number>): Record<string, number> {
    const metricMappings: Record<string, string> = {
      // Common alternative names for metrics
      "v(g)": "vg",
      "ev(g)": "ev",
      "iv(g)": "iv",
      lines_of_code: "loc",
      cyclomatic_complexity: "vg",
      essential_complexity: "ev",
      design_complexity: "iv",
      halstead_length: "n",
      halstead_volume: "v",
      halstead_level: "l",
      halstead_difficulty: "d",
      halstead_intelligence: "i",
      halstead_effort: "e",
      halstead_time: "t",
      lines_of_code_no_comments: "lOCode",
      lines_of_comments: "lOComment",
      blank_lines: "lOBlank",
      code_and_comment_lines: "locCodeAndComment",
      unique_operators: "uniq_Op",
      unique_operands: "uniq_Opnd",
      total_operators: "total_Op",
      total_operands: "total_Opnd",
      branch_count: "branchCount",
      b: "b", // Additional metric in the provided files
    }
  
    const normalizedMetrics: Record<string, number> = {}
  
    // Copy all metrics to the normalized object
    Object.keys(metrics).forEach((key) => {
      // Use the mapping if available, otherwise use the original key
      const normalizedKey = metricMappings[key] || key
      normalizedMetrics[normalizedKey] = metrics[key]
    })
  
    // Ensure all required metrics are present with default values if missing
    if (normalizedMetrics.vg === undefined && metrics["v(g)"] !== undefined) {
      normalizedMetrics.vg = metrics["v(g)"]
    }
  
    if (normalizedMetrics.ev === undefined && metrics["ev(g)"] !== undefined) {
      normalizedMetrics.ev = metrics["ev(g)"]
    }
  
    if (normalizedMetrics.iv === undefined && metrics["iv(g)"] !== undefined) {
      normalizedMetrics.iv = metrics["iv(g)"]
    }
  
    return normalizedMetrics
  }
  
  /**
   * Fetch and parse CSV data from a URL
   */
  export async function fetchAndParseCSV(url: string): Promise<Record<string, number>[]> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }
  
      const csvText = await response.text()
  
      // Split the CSV into rows
      const rows = csvText.split(/\r?\n/).filter((row) => row.trim() !== "")
  
      // Extract headers (first row)
      const headers = rows[0].split(",").map((header) => header.trim())
  
      // Process data rows
      const metricsArray: Record<string, number>[] = []
  
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(",").map((value) => value.trim())
  
        // Skip rows with incorrect number of columns
        if (values.length !== headers.length) continue
  
        const metricsObject: Record<string, number> = {}
  
        // Map each value to its corresponding header
        headers.forEach((header, index) => {
          // Convert to number
          const numValue = Number.parseFloat(values[index])
          if (!isNaN(numValue)) {
            metricsObject[header] = numValue
          } else if (values[index].toLowerCase() === "true") {
            metricsObject[header] = 1
          } else if (values[index].toLowerCase() === "false") {
            metricsObject[header] = 0
          } else {
            metricsObject[header] = 0 // Default to 0 for non-numeric values
          }
        })
  
        metricsArray.push(metricsObject)
      }
  
      return metricsArray
    } catch (error) {
      console.error("Error fetching and parsing CSV:", error)
      throw error
    }
  }
  