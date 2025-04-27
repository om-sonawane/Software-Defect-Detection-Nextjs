export interface DefectResult {
    id: string
    user_id: string
    metrics: Record<string, number>
    defect_detected: boolean
    reason?: string
    created_at: string
  }
  