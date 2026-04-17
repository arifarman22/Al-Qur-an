// Curated Unsplash images for surah categories
// Makkah surahs get Makkah/desert/spiritual imagery
// Madinah surahs get Madinah/mosque/community imagery

const makkahImages = [
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80", // Kaaba
  "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80", // Makkah aerial
  "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80", // Desert landscape
  "https://images.unsplash.com/photo-1590076215667-875c2d180929?w=800&q=80", // Islamic arch
  "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80", // Quran open
];

const madinahImages = [
  "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80", // Mosque
  "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80", // Madinah green dome
  "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80", // Islamic pattern
  "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80", // Mosque interior
  "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80", // Lanterns
];

export function getSurahImage(surahId: number, revelationPlace: string): string {
  const isMakkah = revelationPlace.toLowerCase() === "makkah";
  const images = isMakkah ? makkahImages : madinahImages;
  return images[surahId % images.length];
}
