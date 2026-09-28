import axiosInstance from "@/configs/axiosInstance"
import { IBackendRes } from "@/types/backend"
import {
  ICandidateCv,
  ICvContent,
  ICvThemeConfig,
  ICreateCandidateCvReq,
  IUpdateCandidateCvReq,
} from "@/types/cvBuilder"

export async function getMyCandidateCvs(): Promise<IBackendRes<ICandidateCv[]>> {
  const response = await axiosInstance.get<IBackendRes<ICandidateCv[]>>(
    "/api/v1/candidate/cvs"
  )
  return response.data
}

export async function getCandidateCvById(
  id: number
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.get<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}`
  )
  return response.data
}

export async function createCandidateCv(
  dto: ICreateCandidateCvReq
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.post<IBackendRes<ICandidateCv>>(
    "/api/v1/candidate/cvs",
    dto
  )
  return response.data
}

export async function updateCandidateCv(
  id: number,
  dto: IUpdateCandidateCvReq
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.put<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}`,
    dto
  )
  return response.data
}

export async function updateCandidateCvTheme(
  id: number,
  themeConfig: ICvThemeConfig
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.patch<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}/theme`,
    themeConfig
  )
  return response.data
}

export async function updateCandidateCvContent(
  id: number,
  content: ICvContent
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.patch<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}/content`,
    content
  )
  return response.data
}

export async function deleteCandidateCv(
  id: number
): Promise<IBackendRes<void>> {
  const response = await axiosInstance.delete<IBackendRes<void>>(
    `/api/v1/candidate/cvs/${id}`
  )
  return response.data
}

export async function duplicateCandidateCv(
  id: number
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.post<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}/duplicate`
  )
  return response.data
}

export async function setDefaultCandidateCv(
  id: number
): Promise<IBackendRes<ICandidateCv>> {
  const response = await axiosInstance.put<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}/set-default`
  )
  return response.data
}

export async function syncCandidateCvPdf(
  id: number,
  pdfUrl?: string,
  thumbnailUrl?: string
): Promise<IBackendRes<ICandidateCv>> {
  if (pdfUrl) {
    // Fail-safe: Update via PUT endpoint with JSON body
    await updateCandidateCv(id, { pdfUrl, thumbnailUrl })
  }
  const response = await axiosInstance.post<IBackendRes<ICandidateCv>>(
    `/api/v1/candidate/cvs/${id}/sync-pdf`,
    null,
    {
      params: { pdfUrl, thumbnailUrl },
    }
  )
  return response.data
}
