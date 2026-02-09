import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Azone",
  description: "Get in touch with Azone. Need a custom solution or priority support? Our engineers are ready to assist.",
  keywords: ["contact", "support", "custom solutions", "help"],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/contact`,
    title: "Contact - Azone",
    description: "Get in touch with Azone. Need a custom solution or priority support?",
    siteName: "Azone",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/og`,
        width: 1200,
        height: 630,
        alt: "Contact Azone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Azone",
    description: "Get in touch with Azone.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/og`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://paing.xyz"}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

