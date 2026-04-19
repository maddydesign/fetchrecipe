"use client";

import { useEffect, useRef, useState } from "react";
import type { Recipe, Ingredient } from "@/types/recipe";

function formatIngredient(ing: Ingredient): string {
  const parts: string[] = [];
  if (ing.quantity) parts.push(ing.quantity);
  if (ing.unit) parts.push(ing.unit);
  parts.push(ing.name);
  return parts.join(" ");
}

function formatIngredientShort(ing: Ingredient): string {
  const parts: string[] = [];
  if (ing.quantity) parts.push(ing.quantity);
  if (ing.unit) parts.push(ing.unit);
  return parts.length > 0 ? parts.join(" ") : ing.name;
}

// Adjectives/qualifiers that modify but don't identify an ingredient.
// Stripping these lets us match "butter" when the name is "unsalted butter".
const SKIP_ADJECTIVES = new Set([
  "unsalted", "salted", "large", "medium", "small", "best", "good", "fresh",
  "freshly", "golden", "fine", "extra", "pure", "raw", "cooked", "uncooked",
  "organic", "dried", "dry", "whole", "light", "dark", "table", "sea",
  "kosher", "lukewarm", "warm", "hot", "cold", "room-temperature",
  "all-purpose", "self-rising", "low-sodium", "reduced-fat",
  "finely", "roughly", "thinly", "thick", "thin", "packed",
]);

/**
 * Generate search variants for an ingredient name so we can match
 * more liberally against step text.
 *
 * Examples:
 *   "unsalted butter"         -> ["unsalted butter", "butter"]
 *   "cane sugar or brown sugar" -> ["cane sugar or brown sugar", "cane sugar", "brown sugar"]
 *   "large eggs"              -> ["large eggs", "eggs"]
 *   "King Arthur All-Purpose Flour" -> ["king arthur all-purpose flour", "king arthur flour"]
 */
function nameVariants(name: string): string[] {
  const variants: string[] = [name];

  // Split on " or " for alternative names
  if (name.includes(" or ")) {
    for (const alt of name.split(" or ")) {
      const trimmed = alt.trim();
      if (trimmed) variants.push(trimmed);
    }
  }

  // Strip common adjectives to get the core ingredient
  const words = name.split(/\s+/);
  if (words.length > 1) {
    const stripped = words.filter((w) => !SKIP_ADJECTIVES.has(w.toLowerCase()));
    if (stripped.length > 0 && stripped.length < words.length) {
      variants.push(stripped.join(" "));
    }
  }

  // Strip parenthetical content  e.g. "chicken broth (low sodium)"
  const noParen = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  if (noParen !== name && noParen) variants.push(noParen);

  return Array.from(new Set(variants));
}

/**
 * Attempt to find an ingredient name (or a contiguous sub-phrase of it) inside
 * the step text. Returns the {start, end} of the match, or null.
 *
 * Strategy (in priority order):
 *   1. Try each name variant (original, adjective-stripped, or-split)
 *   2. For every variant, try all contiguous word sub-phrases, longest first
 *   3. As a last resort, try basic plural/singular fallback on individual words
 */
function findIngredientInText(
  name: string,
  textLower: string
): { start: number; end: number } | null {
  const variants = nameVariants(name);

  // --- Pass 1: exact sub-phrase matching (longest first) ---
  for (const variant of variants) {
    const words = variant.split(/\s+/);
    for (let len = words.length; len >= 1; len--) {
      for (let s = 0; s + len <= words.length; s++) {
        const partial = words.slice(s, s + len).join(" ");
        if (partial.length < 3) continue;
        const pos = textLower.indexOf(partial.toLowerCase());
        if (pos !== -1) {
          return { start: pos, end: pos + partial.length };
        }
      }
    }
  }

  // --- Pass 2: singular/plural fallback on individual words ---
  // Handles "eggs" in name vs "egg" in text, "tomatoes" vs "tomato", etc.
  const allWords = name.split(/\s+/);
  for (const word of allWords) {
    if (word.length < 3 || SKIP_ADJECTIVES.has(word.toLowerCase())) continue;
    const w = word.toLowerCase();

    // Generate singular/plural forms to search for
    const forms: string[] = [w];
    // Plural -> singular
    if (w.endsWith("ies") && w.length > 4) forms.push(w.slice(0, -3) + "y");
    else if (w.endsWith("ves") && w.length > 4) forms.push(w.slice(0, -3) + "f");
    else if (w.endsWith("oes") && w.length > 4) forms.push(w.slice(0, -2));
    else if (w.endsWith("es") && w.length > 4) forms.push(w.slice(0, -2));
    else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) forms.push(w.slice(0, -1));
    // Singular -> plural
    if (!w.endsWith("s")) {
      forms.push(w + "s");
      forms.push(w + "es");
    }

    for (const form of forms) {
      // Use word-boundary check to avoid matching inside unrelated words
      const regex = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      const m = regex.exec(textLower);
      if (m) {
        return { start: m.index, end: m.index + m[0].length };
      }
    }
  }

  return null;
}

function renderStepWithInlineIngredients(
  text: string,
  ingredientRefs: number[],
  ingredients: Ingredient[]
): React.ReactNode[] {
  if (!ingredientRefs.length) return [text];

  // Build a list of ingredient names to search for in the text
  const refs = ingredientRefs
    .map((idx) => {
      const ing = ingredients[idx];
      if (!ing) return null;
      return { idx, ing, short: formatIngredientShort(ing) };
    })
    .filter(Boolean) as { idx: number; ing: Ingredient; short: string }[];

  const textLower = text.toLowerCase();

  // Find all ingredient name occurrences and sort by position
  const matches: { start: number; end: number; ing: Ingredient }[] = [];
  const unmatched: Ingredient[] = [];

  for (const ref of refs) {
    const result = findIngredientInText(ref.ing.name, textLower);
    if (result) {
      matches.push({ start: result.start, end: result.end, ing: ref.ing });
    } else {
      unmatched.push(ref.ing);
    }
  }

  // Sort by position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const filtered: typeof matches = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  // Build nodes with inline tags
  const nodes: React.ReactNode[] = [];
  let keyIdx = 0;
  let cursor = 0;

  for (const m of filtered) {
    if (m.start > cursor) {
      nodes.push(text.slice(cursor, m.start));
    }
    const qtyLabel = formatIngredientShort(m.ing);
    nodes.push(
      <span
        key={keyIdx++}
        className="inline-qty"
        style={{
          background: "var(--inline-bg)",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 500,
          padding: "2px 6px",
          whiteSpace: "nowrap",
        }}
      >
        {qtyLabel}
      </span>
    );
    // Include the original text for the ingredient name
    nodes.push(" " + text.slice(m.start, m.end));
    cursor = m.end;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  // For referenced ingredients that weren't found in the text at all,
  // append small quantity tags at the end so the reader still sees them.
  if (unmatched.length > 0) {
    nodes.push(" ");
    for (const ing of unmatched) {
      const qtyLabel = formatIngredientShort(ing);
      nodes.push(
        <span
          key={keyIdx++}
          className="inline-qty"
          title={ing.name}
          style={{
            background: "var(--inline-bg)",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 500,
            padding: "2px 6px",
            whiteSpace: "nowrap",
            opacity: 0.7,
          }}
        >
          {qtyLabel !== ing.name ? `${qtyLabel} ${ing.name}` : ing.name}
        </span>
      );
      nodes.push(" ");
    }
  }

  return nodes.length > 0 ? nodes : [text];
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const hasMeta = recipe.prepTime || recipe.cookTime || recipe.servings;

  return (
    <div
      ref={cardRef}
      className="recipe-card recipe-appear"
      style={{
        background: "var(--white)",
        maxWidth: "780px",
        margin: "0 auto",
        padding: "48px 56px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 300ms var(--ease-out), transform 300ms var(--ease-out)`,
      }}
    >
      {/* Card header — image + title/meta */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: recipe.image ? "1fr 1fr" : "1fr",
          gap: "32px",
          alignItems: "center",
        }}
        className="recipe-header"
      >
        {recipe.image && (
          <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              fontWeight: 400,
              lineHeight: 1.15,
              color: "var(--black)",
              margin: 0,
            }}
          >
            {recipe.title}
          </h2>

          {hasMeta && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                marginTop: "20px",
              }}
            >
              {[
                { label: "Prep", value: recipe.prepTime },
                { label: "Cook", value: recipe.cookTime },
                { label: "Serves", value: recipe.servings },
              ].map(
                (item) =>
                  item.value && (
                    <div
                      key={item.label}
                      style={{
                        border: "0.5px solid var(--gray-border)",
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: 400,
                          color: "var(--black)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "var(--black)",
                          marginTop: "2px",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          {recipe.sourceSite && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                border: "0.5px solid var(--gray-border)",
                padding: "4px 10px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--black)",
                marginTop: "14px",
                textDecoration: "none",
                transition: "border-color 200ms var(--ease-out)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--black)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--gray-border)")
              }
            >
              {recipe.sourceSite}{" \u2197"}
            </a>
          )}
        </div>
      </div>

      {/* Card body — ingredients + method */}
      <div
        className="recipe-card-body"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gap: "56px",
          marginTop: "40px",
          paddingTop: "32px",
          borderTop: "0.5px solid var(--gray-border)",
        }}
      >
        {/* Ingredients */}
        <div className="recipe-ingredients">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--black)",
              margin: "0 0 20px 0",
            }}
          >
            Ingredients
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="ingredient-item"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "var(--black)",
                  padding: "4px 0",
                  opacity: 0,
                  animation: `fadeIn 300ms var(--ease-out) ${i * 30}ms forwards`,
                }}
              >
                <span style={{ marginRight: "8px" }}>&mdash;</span>
                {formatIngredient(ing)}
                {ing.notes ? (
                  <span>, {ing.notes}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        {/* Method */}
        <div className="recipe-method">
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--black)",
              margin: "0 0 20px 0",
            }}
          >
            Method
          </h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recipe.instructions.map((inst, i) => (
              <li
                key={inst.step}
                style={{
                  marginBottom: "22px",
                  opacity: 0,
                  animation: `fadeIn 300ms var(--ease-out) ${i * 50}ms forwards`,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "var(--black)",
                    marginRight: "10px",
                  }}
                >
                  {inst.step}.
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: "var(--black)",
                  }}
                >
                  {inst.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

    </div>
  );
}
