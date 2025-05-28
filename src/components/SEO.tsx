import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  location?: 'Sun Prairie' | 'Waunakee';
  image?: string;
}

export function SEO({ 
  title = 'J. Lash Studios - Premium Lash Extensions',
  description = 'Experience luxury lash extensions and microblading services at J. Lash Studios. Professional beauty services in Sun Prairie and Waunakee, WI.',
  location = 'Sun Prairie',
  image = '/images/jlash logo.jpeg'
}: SEOProps) {
  const siteUrl = 'https://jlashstudios.com';
  const fullTitle = `${title} | J. Lash Studios ${location}`;
  const canonicalUrl = `${siteUrl}${location === 'Waunakee' ? '/waunakee' : ''}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${image}`} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />

      {/* Additional Meta Tags */}
      <meta name="keywords" content="lash extensions, microblading, permanent makeup, beauty services, Wisconsin, Sun Prairie, Waunakee" />
      <meta name="author" content="J. Lash Studios" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />

      {/* Geo Meta Tags */}
      <meta name="geo.region" content="US-WI" />
      <meta name="geo.placename" content={`${location}, Wisconsin`} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href="/images/jlash logo no background.png" />
    </Helmet>
  );
}