import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BDSPro - Phần mềm quản lý bất động sản hàng đầu Việt Nam",
  description:
    "BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Hệ thống quản lý khách hàng, dự án, hợp đồng và báo cáo toàn diện.",
  keywords: [
    "phần mềm bất động sản",
    "quản lý bds",
    "BDSPro",
    "real estate software",
    "phần mềm quản lý dự án",
    "quản lý khách hàng",
  ],
  authors: [{ name: "BDSPro Team" }],
  creator: "BDSPro",
  publisher: "BDSPro",
  generator: "BDSPro",
  applicationName: "BDSPro",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    url: "https://bdspro.vn",
    siteName: "BDSPro",
    title: "BDSPro - Phần mềm quản lý bất động sản hàng đầu Việt Nam",
    description:
      "BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Hệ thống quản lý khách hàng, dự án, hợp đồng và báo cáo toàn diện.",
    images: [
      {
        url: "/bdspro-logo-ngang.png",
        width: 1200,
        height: 630,
        alt: "BDSPro - Phần mềm quản lý bất động sản",
        type: "image/png",
      },
      {
        url: "/real-estate-dashboard.png",
        width: 1200,
        height: 630,
        alt: "BDSPro Dashboard - Giao diện quản lý bất động sản",
        type: "image/png",
      },
    ],
    videos: [],
    audio: [],
    determiner: "the",
  },
  facebook: {
    appId: "YOUR_FACEBOOK_APP_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "BDSPro - Phần mềm quản lý bất động sản hàng đầu Việt Nam",
    description:
      "BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Hệ thống quản lý khách hàng, dự án, hợp đồng và báo cáo toàn diện.",
    images: ["/bdspro-logo-ngang.png"],
    creator: "@bdspro",
    site: "@bdspro",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/bdspro.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/bdspro.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  category: "technology",
  classification: "Business Software",
  other: {
    // Microsoft/Windows
    "msapplication-TileColor": "#2563eb",
    "msapplication-tooltip": "BDSPro - Phần mềm quản lý bất động sản",
    "msapplication-starturl": "/",
    "msapplication-navbutton-color": "#2563eb",
    "msapplication-window": "width=1024;height=768",

    // Apple/iOS
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "BDSPro",
    "apple-itunes-app": "app-id=YOUR_APP_ID",

    // Mobile
    "mobile-web-app-capable": "yes",
    "application-name": "BDSPro",
    "theme-color": "#2563eb",

    // Facebook specific
    "fb:app_id": "YOUR_FACEBOOK_APP_ID",
    "fb:admins": "YOUR_FACEBOOK_ADMIN_ID",
    "fb:pages": "YOUR_FACEBOOK_PAGE_ID",

    // Zalo specific
    "zalo:app_id": "YOUR_ZALO_APP_ID",
    "zalo:page_id": "YOUR_ZALO_PAGE_ID",

    // Instagram specific
    "instagram:site": "@bdspro",
    "instagram:creator": "@bdspro",

    // LinkedIn specific
    "linkedin:owner": "YOUR_LINKEDIN_ID",

    // Pinterest specific
    "pinterest-rich-pin": "true",

    // WhatsApp specific
    "whatsapp:contact": "+8419001234",

    // Telegram specific
    "telegram:channel": "@bdspro",

    // Additional social media
    "youtube:channel": "YOUR_YOUTUBE_CHANNEL_ID",
    "tiktok:site": "@bdspro",

    // Business information
    "business:contact_data:street_address": "Hà Nội, Việt Nam",
    "business:contact_data:locality": "Hà Nội",
    "business:contact_data:region": "Hà Nội",
    "business:contact_data:postal_code": "100000",
    "business:contact_data:country_name": "Việt Nam",
    "business:contact_data:phone_number": "+84 1900 1234",
    "business:contact_data:email": "contact@bdspro.vn",
    "business:contact_data:website": "https://bdspro.vn",

    // Additional SEO
    "google-site-verification": "YOUR_GOOGLE_VERIFICATION_CODE",
    "baidu-site-verification": "YOUR_BAIDU_VERIFICATION_CODE",
    "yandex-verification": "YOUR_YANDEX_VERIFICATION_CODE",

    // Performance
    "format-detection": "telephone=no",
    "mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-inter: ${inter.variable};
}
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "BDSPro",
              description:
                "BDSPro - Giải pháp phần mềm quản lý bất động sản hàng đầu Việt Nam. Hệ thống quản lý khách hàng, dự án, hợp đồng và báo cáo toàn diện.",
              url: "https://bdspro.vn",
              logo: "https://bdspro.vn/bdspro-logo-ngang.png",
              image: [
                "https://bdspro.vn/bdspro-logo-ngang.png",
                "https://bdspro.vn/real-estate-dashboard.png",
              ],
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              author: {
                "@type": "Organization",
                name: "BDSPro Team",
              },
              publisher: {
                "@type": "Organization",
                name: "BDSPro",
                logo: {
                  "@type": "ImageObject",
                  url: "https://bdspro.vn/bdspro-logo-ngang.png",
                },
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+84-1900-1234",
                contactType: "customer service",
                email: "contact@bdspro.vn",
                availableLanguage: ["Vietnamese", "English"],
              },
              sameAs: [
                "https://www.facebook.com/bdspro",
                "https://www.instagram.com/bdspro",
                "https://www.linkedin.com/company/bdspro",
                "https://twitter.com/bdspro",
                "https://www.youtube.com/channel/bdspro",
                "https://zalo.me/bdspro",
              ],
              keywords:
                "phần mềm bất động sản, quản lý bds, BDSPro, real estate software",
              inLanguage: "vi",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "150",
              },
            }),
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
