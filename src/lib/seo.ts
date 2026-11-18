/** LocalBusiness (HealthClub) structured data, built from content.ts so it never drifts from the page. */
import { contact, hours, rating, site } from "./content";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivapremiumgym.example"; // TODO(client): real domain

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: site.altName,
  url: SITE_URL,
  telephone: contact.phoneE164,
  image: `${SITE_URL}/media/img/floor-energy-782.webp`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.street}, ${contact.address.locality}`,
    addressLocality: contact.address.city,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: contact.address.country,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: hours.weekdays.open,
      closes: hours.weekdays.close,
    },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: rating.value, reviewCount: rating.count },
  sameAs: [contact.instagram, contact.facebook],
  amenityFeature: ["Steam & shower", "Acupuncture shower", "Personal lockers", "Healthy café", "Free WiFi", "Parking"].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};
