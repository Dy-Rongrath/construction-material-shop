import { Metadata } from 'next';

/**
 * SEO configuration and utilities
 */

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export const defaultSEO: SEOProps = {
  title: 'Construction Material Shop - Quality Building Materials',
  description:
    'Find the best construction materials for your building projects. Cement, lumber, steel, paints, and more. Quality products at competitive prices.',
  keywords: [
    'construction',
    'materials',
    'building',
    'supplies',
    'cement',
    'lumber',
    'steel',
    'paints',
  ],
  image: '/images/og-image.jpg',
  url: 'https://construction-material-shop.com',
  type: 'website',
  siteName: 'Construction Material Shop',
  locale: 'en_US',
};

/**
 * Generate comprehensive metadata for Next.js pages
 */
export function generateMetadata(props: SEOProps = {}): Metadata {
  const seo = { ...defaultSEO, ...props };

  const title = seo.title || defaultSEO.title;
  const description = seo.description || defaultSEO.description;
  const image = seo.image || defaultSEO.image!;
  const url = seo.url || defaultSEO.url;

  return {
    title,
    description,
    keywords: seo.keywords?.join(', '),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: seo.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: seo.locale,
      type: seo.type,
      publishedTime: seo.publishedTime,
      modifiedTime: seo.modifiedTime,
      authors: seo.author ? [seo.author] : undefined,
      section: seo.section,
      tags: seo.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: seo.author ? `@${seo.author}` : undefined,
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
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for products
 */
export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      sku: product.sku || product.id,
    },
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    category: product.category,
  };
}

/**
 * Generate structured data for organization
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Construction Material Shop',
    url: 'https://construction-material-shop.com',
    logo: 'https://construction-material-shop.com/images/logo/ShopLogo.png',
    description: 'Your trusted source for quality construction materials',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://facebook.com/constructionmaterialshop',
      'https://twitter.com/constructionshop',
      'https://linkedin.com/company/construction-material-shop',
    ],
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(
  faqs: Array<{
    question: string;
    answer: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate HowTo structured data
 */
export function generateHowToStructuredData(guide: {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.name,
    description: guide.description,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}
