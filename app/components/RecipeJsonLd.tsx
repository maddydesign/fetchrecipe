"use client";

import type { Recipe } from "@/types/recipe";

/**
 * Parse a human-readable duration string like "15 mins", "1 hour 30 minutes"
 * into ISO 8601 duration format like "PT15M", "PT1H30M".
 * Returns null if parsing fails.
 */
function toISO8601Duration(time: string | null): string | null {
  if (!time) return null;

  const lower = time.toLowerCase().trim();
  let hours = 0;
  let minutes = 0;

  // Match patterns like "1 hour", "2 hours", "1 hr"
  const hourMatch = lower.match(/(\d+)\s*(?:hours?|hrs?)/);
  if (hourMatch) hours = parseInt(hourMatch[1], 10);

  // Match patterns like "15 mins", "30 minutes", "45 min"
  const minMatch = lower.match(/(\d+)\s*(?:minutes?|mins?)/);
  if (minMatch) minutes = parseInt(minMatch[1], 10);

  // If only a bare number, assume minutes
  if (!hourMatch && !minMatch) {
    const bare = lower.match(/^(\d+)$/);
    if (bare) minutes = parseInt(bare[1], 10);
  }

  if (hours === 0 && minutes === 0) return null;

  let iso = "PT";
  if (hours > 0) iso += `${hours}H`;
  if (minutes > 0) iso += `${minutes}M`;
  return iso;
}

export default function RecipeJsonLd({ recipe }: { recipe: Recipe }) {
  const ingredients = recipe.ingredients.map((ing) => {
    const parts: string[] = [];
    if (ing.quantity) parts.push(ing.quantity);
    if (ing.unit) parts.push(ing.unit);
    parts.push(ing.name);
    if (ing.notes) parts.push(`(${ing.notes})`);
    return parts.join(" ");
  });

  const instructions = recipe.instructions.map((inst) => ({
    "@type": "HowToStep" as const,
    text: inst.text,
  }));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    recipeIngredient: ingredients,
    recipeInstructions: instructions,
  };

  if (recipe.image) jsonLd.image = recipe.image;
  if (recipe.description) jsonLd.description = recipe.description;

  const prepTime = toISO8601Duration(recipe.prepTime);
  const cookTime = toISO8601Duration(recipe.cookTime);
  if (prepTime) jsonLd.prepTime = prepTime;
  if (cookTime) jsonLd.cookTime = cookTime;
  if (recipe.servings) jsonLd.recipeYield = recipe.servings;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
