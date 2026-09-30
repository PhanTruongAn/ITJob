import html2canvas from "html2canvas-pro"
import { jsPDF } from "jspdf"

/**
 * Exports the CV canvas (#cv-a4-canvas) to a high-quality A4 PDF file.
 *
 * Uses html2canvas-pro for pixel-perfect rendering of the DOM
 * and jsPDF for generating the PDF with correct A4 dimensions.
 *
 * @param fileName - The desired file name (without .pdf extension)
 * @returns Promise<Blob> - The generated PDF as a Blob for upload or download
 */
export async function exportCvToPdf(fileName: string = "cv"): Promise<Blob> {
  const cvCanvas = document.getElementById("cv-a4-canvas")
  if (!cvCanvas) {
    throw new Error("CV canvas element (#cv-a4-canvas) not found.")
  }

  // Store original styles to restore after capture
  const originalTransform = cvCanvas.style.transform
  const originalTransformOrigin = cvCanvas.style.transformOrigin

  // Reset any zoom/transform for accurate capture
  cvCanvas.style.transform = "none"
  cvCanvas.style.transformOrigin = "top left"

  // Wait for re-paint
  await new Promise((resolve) => requestAnimationFrame(resolve))

  const canvas = await html2canvas(cvCanvas, {
    scale: 2, // High DPI resolution
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  })

  // Restore original transform
  cvCanvas.style.transform = originalTransform
  cvCanvas.style.transformOrigin = originalTransformOrigin

  // A4 dimensions in mm
  const A4_WIDTH_MM = 210
  const A4_HEIGHT_MM = 297

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // Height of one A4 page in canvas pixel units based on exact 210:297 ratio
  const pageHeightPx = Math.floor(canvasWidth * (A4_HEIGHT_MM / A4_WIDTH_MM))

  // Allow a tiny 3% tolerance for rounding so single page CVs don't trigger unnecessary multi-page slice
  if (canvasHeight <= pageHeightPx * 1.03) {
    // Single page A4 PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.92)
    pdf.addImage(imgData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM)
  } else {
    // Multi-page PDF slicing based on exact pageHeightPx
    const totalPages = Math.ceil(canvasHeight / pageHeightPx)

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage()
      }

      const sourceY = page * pageHeightPx
      const sourceH = Math.min(pageHeightPx, canvasHeight - sourceY)

      const pageCanvas = document.createElement("canvas")
      pageCanvas.width = canvasWidth
      pageCanvas.height = pageHeightPx
      const ctx = pageCanvas.getContext("2d")

      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvasWidth, pageHeightPx)
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvasWidth,
          sourceH,
          0,
          0,
          canvasWidth,
          sourceH
        )
      }

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.92)
      pdf.addImage(pageImgData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM)
    }
  }

  return pdf.output("blob")
}

/**
 * Downloads the PDF directly to user's computer
 */
export async function downloadCvPdf(fileName: string = "cv"): Promise<void> {
  const blob = await exportCvToPdf(fileName)
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${fileName}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generates a thumbnail preview image (PNG) of the CV
 * Returns a Blob for uploading to AWS S3
 */
export async function generateCvThumbnail(): Promise<Blob> {
  const cvCanvas = document.getElementById("cv-a4-canvas")
  if (!cvCanvas) {
    throw new Error("CV canvas element (#cv-a4-canvas) not found.")
  }

  const originalTransform = cvCanvas.style.transform
  const originalTransformOrigin = cvCanvas.style.transformOrigin

  cvCanvas.style.transform = "none"
  cvCanvas.style.transformOrigin = "top left"

  await new Promise((resolve) => requestAnimationFrame(resolve))

  const canvas = await html2canvas(cvCanvas, {
    scale: 0.5, // Lower resolution for thumbnail
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
  })

  cvCanvas.style.transform = originalTransform
  cvCanvas.style.transformOrigin = originalTransformOrigin

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to generate thumbnail blob"))
      },
      "image/png",
      0.8,
    )
  })
}
