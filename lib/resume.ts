import { readdir } from 'fs/promises'
import { join } from 'path'

export interface ResumeInfo {
  filename: string
  path: string
  displayName: string
}

export async function getResumeFile(): Promise<ResumeInfo | null> {
  try {
    const publicDir = join(process.cwd(), 'public')
    const files = await readdir(publicDir)
    
    // Look for PDF files that might be resumes
    const resumePatterns = [
      /resume/i,
      /cv/i,
      /esubalew.*chekol/i,
      /chekol.*esubalew/i
    ]
    
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'))
    
    // First, try to find files matching resume patterns
    for (const pattern of resumePatterns) {
      const matchingFile = pdfFiles.find(file => pattern.test(file))
      if (matchingFile) {
        return {
          filename: matchingFile,
          path: `/${matchingFile}`,
          displayName: formatDisplayName(matchingFile)
        }
      }
    }
    
    // If no pattern matches, return the first PDF file
    if (pdfFiles.length > 0) {
      const firstPdf = pdfFiles[0]
      return {
        filename: firstPdf,
        path: `/${firstPdf}`,
        displayName: formatDisplayName(firstPdf)
      }
    }
    
    return null
  } catch (error) {
    console.warn('Error reading resume file:', error)
    return null
  }
}

function formatDisplayName(filename: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.pdf$/i, '')
  
  // Convert underscores and hyphens to spaces
  const formatted = nameWithoutExt.replace(/[_-]/g, ' ')
  
  // Capitalize words
  return formatted.replace(/\b\w/g, letter => letter.toUpperCase())
}
