export interface Site {
  name: string;
  slug: string;
  domain: string;
  description: string;
}

export const sites: Site[] = [
  {
    name: "Food Network",
    slug: "food-network",
    domain: "foodnetwork.com",
    description:
      "Food Network features recipes from celebrity chefs like Ina Garten, Bobby Flay, and Guy Fieri, along with cooking shows and step-by-step tutorials for home cooks.",
  },
  {
    name: "Bon Appetit",
    slug: "bon-appetit",
    domain: "bonappetit.com",
    description:
      "Bon Appetit blends restaurant-quality technique with home-kitchen practicality, offering recipes that range from quick pastas to ambitious weekend projects.",
  },
  {
    name: "King Arthur Baking",
    slug: "king-arthur-baking",
    domain: "kingarthurbaking.com",
    description:
      "King Arthur Baking is the gold standard for baking recipes, with meticulously tested formulas for breads, pastries, and cakes backed by their test kitchen team.",
  },
  {
    name: "Skinnytaste",
    slug: "skinnytaste",
    domain: "skinnytaste.com",
    description:
      "Skinnytaste specializes in lighter versions of comfort food favorites, with detailed nutritional information and Weight Watchers points for every recipe.",
  },
  {
    name: "Half Baked Harvest",
    slug: "half-baked-harvest",
    domain: "halfbakedharvest.com",
    description:
      "Half Baked Harvest is known for creative, flavor-packed recipes that combine unexpected ingredients, from cozy braises to colorful salads with a twist.",
  },
  {
    name: "RecipeTin Eats",
    slug: "recipetin-eats",
    domain: "recipetineats.com",
    description:
      "RecipeTin Eats delivers globally inspired recipes with an emphasis on big flavors and practical techniques, built by former food industry consultant Nagi Maehashi.",
  },
  {
    name: "Taste of Home",
    slug: "taste-of-home",
    domain: "tasteofhome.com",
    description:
      "Taste of Home is a reader-driven recipe collection focused on classic American home cooking, with thousands of recipes submitted and tested by everyday cooks.",
  },
  {
    name: "BBC Good Food",
    slug: "bbc-good-food",
    domain: "bbcgoodfood.com",
    description:
      "BBC Good Food offers triple-tested recipes from the UK's most trusted food brand, spanning British classics, international cuisines, and budget-friendly meal plans.",
  },
  {
    name: "Budget Bytes",
    slug: "budget-bytes",
    domain: "budgetbytes.com",
    description:
      "Budget Bytes breaks down the cost of every recipe ingredient by ingredient, proving that delicious home cooking doesn't have to be expensive.",
  },
  {
    name: "Love and Lemons",
    slug: "love-and-lemons",
    domain: "loveandlemons.com",
    description:
      "Love and Lemons focuses on vibrant vegetarian and plant-forward cooking, with recipes organized by seasonal produce and whole-food ingredients.",
  },
  {
    name: "Once Upon a Chef",
    slug: "once-upon-a-chef",
    domain: "onceuponachef.com",
    description:
      "Once Upon a Chef features polished, family-friendly recipes from a classically trained chef, with detailed photos and tips that make each dish foolproof.",
  },
  {
    name: "Pinterest",
    slug: "pinterest",
    domain: "pinterest.com",
    description:
      "Pinterest saves recipes from all over the web. When you paste a Pinterest pin, we follow it to the original recipe site and extract from there — so you always get a clean result, no matter where the recipe actually lives.",
  },
];

export function getSiteBySlug(slug: string): Site | undefined {
  return sites.find((s) => s.slug === slug);
}

/** Return 2-3 related sites for cross-linking. Picks neighbors and one from a different part of the list. */
export function getRelatedSites(slug: string): Site[] {
  const idx = sites.findIndex((s) => s.slug === slug);
  if (idx === -1) return sites.slice(0, 3);

  const related: Site[] = [];
  // Next site in list (wrap around)
  related.push(sites[(idx + 1) % sites.length]);
  // Previous site in list (wrap around)
  related.push(sites[(idx - 1 + sites.length) % sites.length]);
  // One from the opposite half of the list
  related.push(sites[(idx + Math.floor(sites.length / 2)) % sites.length]);

  return related;
}
