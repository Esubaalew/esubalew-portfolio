import { NextRequest } from 'next/server'
import { generateOGImage } from '@/lib/og-image'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'Esubalew Chekol'
    const subtitle = searchParams.get('subtitle') || undefined
    const type = (searchParams.get('type') as 'general' | 'blog' | 'projects') || 'general'

    return await generateOGImage({ title, subtitle, type })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
