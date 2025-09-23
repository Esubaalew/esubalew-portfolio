import { Metadata } from 'next'

const baseUrl = 'https://esubalew.et'
const siteName = 'Esubalew Chekol'
const defaultDescription = 'Software Engineer & MSc AI Student. I build systems that think, learn, and scale. Passionate about Rust, Python, and the elegant algorithms that power modern computing.'

export interface SEOConfig {
  title: string
  description?: string
  path: string
  type?: 'website' | 'article'
  ogType?: 'general' | 'blog' | 'projects'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  author?: string
}

export function generateMetadata({
  title,
  description = defaultDescription,
  path,
  type = 'website',
  ogType = 'general',
  publishedTime,
  modifiedTime,
  tags,
  author = 'Esubalew Chekol'
}: SEOConfig): Metadata {
  const fullTitle = title === siteName ? title : `${title} - ${siteName}`
  const url = `${baseUrl}${path}`
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=${ogType}${description !== defaultDescription ? `&subtitle=${encodeURIComponent(description)}` : ''}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    authors: [{ name: author, url: baseUrl }],
    creator: author,
    publisher: author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
      locale: 'en_US',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: '@esubaalew',
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
    },
  }

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      authors: [author],
      publishedTime,
      modifiedTime,
      tags,
    }
  }

  // Add structured data for articles
  if (type === 'article') {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      author: {
        '@type': 'Person',
        name: author,
        url: baseUrl,
        sameAs: [
          'https://github.com/esubaalew',
          'https://linkedin.com/in/esubaalew',
          'https://twitter.com/esubaalew',
        ],
      },
      publisher: {
        '@type': 'Person',
        name: author,
        url: baseUrl,
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      image: ogImageUrl,
      url,
    }

    metadata.other = {
      ...metadata.other,
      'application/ld+json': JSON.stringify(structuredData),
    }
  }

  return metadata
}

// Predefined metadata for common pages
export const homeMetadata = generateMetadata({
  title: siteName,
  description: defaultDescription,
  path: '/',
  ogType: 'general',
})

export const blogMetadata = generateMetadata({
  title: 'Blog',
  description: 'Technical articles, tutorials, and insights on software engineering, AI, and systems programming.',
  path: '/blog',
  ogType: 'blog',
})

export const projectsMetadata = generateMetadata({
  title: 'Projects',
  description: 'A collection of software engineering and AI projects showcasing technical expertise and problem-solving skills.',
  path: '/projects',
  ogType: 'projects',
})

// Function to generate blog post metadata
export function generateBlogPostMetadata(post: {
  title: string
  description?: string
  date: string
  tags?: string[]
  slug: string
  dateSlug: string
}) {
  return generateMetadata({
    title: post.title,
    description: post.description || defaultDescription,
    path: `/blog/${post.dateSlug}/${post.slug}`,
    type: 'article',
    ogType: 'blog',
    publishedTime: new Date(post.date).toISOString(),
    tags: post.tags,
  })
}
