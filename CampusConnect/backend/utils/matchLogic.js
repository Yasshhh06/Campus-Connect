// Very basic string similarity logic
const stringSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  return 0; // Enhance this with a true fuzzy match if desired
};

const calculateMatchScore = (item1, item2) => {
  let score = 0;
  let weights = {
    title: 0.4,
    category: 0.3,
    color: 0.1,
    brand: 0.1,
    location: 0.1
  };

  // Title similarity
  score += stringSimilarity(item1.title, item2.title) * weights.title;

  // Category
  if (item1.category === item2.category) score += weights.category;

  // Color
  if (item1.color && item2.color && item1.color.toLowerCase() === item2.color.toLowerCase()) score += weights.color;

  // Brand
  if (item1.brand && item2.brand && stringSimilarity(item1.brand, item2.brand) > 0.5) score += weights.brand;

  // Location
  if (item1.location && item2.location && stringSimilarity(item1.location, item2.location) > 0.5) score += weights.location;

  return score;
};

module.exports = { calculateMatchScore, stringSimilarity };
