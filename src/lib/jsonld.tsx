import type { SiteConfig } from "@fourplusweb/config";

type WithSiteConfig = { site: SiteConfig };

export function organizationJsonLd({ site }: WithSiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: site.contact.address,
    sameAs: Object.values(site.social ?? {}).filter(Boolean),
  };
}

export type LocalBusinessInput = {
  site: SiteConfig;
  businessType?: string;
  geo?: { latitude: number; longitude: number };
  openingHours?: string[];
  priceRange?: string;
};

export function localBusinessJsonLd({
  site,
  businessType = "LocalBusiness",
  geo,
  openingHours,
  priceRange,
}: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": businessType,
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
    },
    ...(geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(priceRange && { priceRange }),
    sameAs: Object.values(site.social ?? {}).filter(Boolean),
  };
}

export type ArticleInput = {
  site: SiteConfig;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  url: string;
};

export function articleJsonLd({
  site,
  title,
  description,
  date,
  author,
  image,
  url,
}: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image.startsWith("http") ? image : `${site.url}${image}`,
    datePublished: date,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: url,
  };
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
