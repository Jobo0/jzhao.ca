import React, { useMemo } from "react";
import Head from "next/head";

interface SeoHeadProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  noindex?: boolean;
  siteName?: string;
  urlPath?: string; // e.g., "/about" from Builder's page data
}

function toAbsoluteUrl(inputUrl: string | undefined, siteUrl: string | undefined): string | undefined {
  if (!inputUrl) return undefined;
  try {
    const isAbsolute = /^https?:\/\//i.test(inputUrl);
    if (isAbsolute) return inputUrl;
    if (!siteUrl) return undefined;
    return new URL(inputUrl, siteUrl).toString();
  } catch {
    return undefined;
  }
}

export default function SeoHead({ title, description, imageUrl, noindex, siteName, urlPath }: SeoHeadProps) {
  const isProd = process.env.NODE_ENV === "production";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const resolvedSiteName = siteName || "jzhao.ca";

  const pathname = (urlPath || "/").split("?")[0].split("#")[0];
  const canonicalUrl = useMemo(() => {
    if (!isProd || !siteUrl) return undefined;
    try {
      return new URL(pathname || "/", siteUrl).toString();
    } catch {
      return undefined;
    }
  }, [isProd, siteUrl, pathname]);

  const absoluteImage = useMemo(() => toAbsoluteUrl(imageUrl, siteUrl), [imageUrl, siteUrl]);
  const fullTitle = title ? `${title} | ${resolvedSiteName}` : resolvedSiteName;
  const shouldNoIndex = noindex || !isProd;

  const websiteJsonLd = useMemo(() => {
    if (!siteUrl) return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: siteUrl,
      name: resolvedSiteName,
    } as const;
  }, [siteUrl, resolvedSiteName]);

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={shouldNoIndex ? "noindex, nofollow" : "index, follow"} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={resolvedSiteName} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {absoluteImage ? <meta property="og:image" content={absoluteImage} /> : null}

      {/* Twitter Card */}
      <meta name="twitter:card" content={absoluteImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {absoluteImage ? <meta name="twitter:image" content={absoluteImage} /> : null}

      {/* JSON-LD */}
      {websiteJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      ) : null}
    </Head>
  );
}


