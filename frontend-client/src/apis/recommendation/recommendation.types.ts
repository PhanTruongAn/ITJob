import { IPaginatedData } from "../common/response.types"

export interface ICandidateRecommendation {
  id: number
  jobId: number
  jobTitle: string
  companyName: string
  companyLogo?: string
  location?: string
  salary?: number
  jobType?: string
  level?: string
  matchScore?: number
  matchedSkills: string[]
  createdAt?: string
}

export type ICandidateRecommendationPage = IPaginatedData<ICandidateRecommendation>
