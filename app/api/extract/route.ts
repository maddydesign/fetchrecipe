import OpenAI from "openai";
import type { ExtractRequest, Recipe, SimilarRecipeSuggestion } from "@/types/recipe";

// ---------- Rate limiting (in-memory, per IP, 10 req/min) ----------

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];

  // Keep only timestamps within the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT_MAX) return true;

  recent.push(now);
  return false;
}

// ---------- HTML cleaning ----------

function cleanHtml(html: string): string {
  // Remove entire tags and their contents for elements that never contain recipe data
  const tagsToRemove = [
    "script",
    "style",
    "nav",
    "footer",
    "header",
    "iframe",
    "noscript",
    "svg",
    "form",
  ];
  let cleaned = html;
  for (const tag of tagsToRemove) {
    cleaned = cleaned.replace(
      new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"),
      ""
    );
  }

  // Remove common ad / sidebar / comment containers by class or id patterns
  cleaned = cleaned.replace(
    /<(div|section|aside)[^>]*(class|id)="[^"]*(comment|sidebar|advertisement|ad-container|social-share|newsletter|popup|modal)[^"]*"[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Collapse whitespace
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // If the cleaned HTML is extremely long, trim it to avoid sending too much to the AI.
  // 60 000 chars ≈ ~15 000 tokens, well within GPT-4o-mini's 128k context.
  const MAX_CHARS = 60_000;
  if (cleaned.length > MAX_CHARS) {
    cleaned = cleaned.slice(0, MAX_CHARS);
  }

  return cleaned.trim();
}

// ---------- OpenAI prompt ----------

const SYSTEM_PROMPT = `You are a recipe extraction assistant. Your job is to read HTML from a recipe web page and extract the structured recipe data.

Respond ONLY with valid JSON — no markdown fences, no explanation, no extra text.

The JSON must match this exact structure:
{
  "title": "string",
  "description": "string or null",
  "image": "string (absolute URL) or null",
  "prepTime": "string like '15 mins' or null",
  "cookTime": "string like '30 mins' or null",
  "totalTime": "string like '45 mins' or null",
  "servings": "string like '4 servings' or null",
  "ingredients": [
    {
      "quantity": "string (e.g. '2', '1/2', '2-3', '' if none)",
      "unit": "string (e.g. 'cups', 'g', 'oz', '' if none)",
      "name": "string (the ingredient itself)",
      "notes": "string (e.g. 'sifted', 'room temperature', '' if none)"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "text": "string (the instruction text)",
      "ingredientRefs": [0, 2]
    }
  ],
  "sourceSite": "string (the site name, e.g. 'AllRecipes')"
}

Rules:
- Be precise with measurements. Never round, estimate, or change quantities. Extract them exactly as written.
- Separate quantity, unit, and ingredient name into distinct fields. "2 cups all-purpose flour, sifted" → quantity: "2", unit: "cups", name: "all-purpose flour", notes: "sifted".
- For ingredients with no specific quantity (like "salt to taste" or "cooking spray"), set quantity to "" and put qualifiers in notes.
- For range quantities like "2-3 cups", keep the range as-is in the quantity field: "2-3".
- For weight measurements (grams, ounces, pounds), use the appropriate unit: "g", "oz", "lb".
- ingredientRefs is an array of zero-based indices into the ingredients array. For each instruction step, identify which ingredients from the list are used in that step and include their indices. This is critical — be thorough and accurate.
- Extract prep time, cook time, total time, and servings if they appear anywhere on the page. If not found, use null.
- For image, extract the main recipe photo URL. Look for the og:image meta tag, or the primary image in the recipe's JSON-LD schema, or the largest image near the recipe content. Return the absolute URL (starting with https://). Return null if no suitable image is found.
- For sourceSite, extract the human-readable site name (e.g. "Sally's Baking Addiction", not "sallysbakingaddiction.com").
- If the page does not contain a recipe, respond with: {"error": "No recipe found on this page."}`;

// Allow up to 60 seconds for the full request (ScraperAPI can be slow for
// sites that need JavaScript rendering).
export const maxDuration = 60;

// ---------- Similar recipe suggestions (shown on failure) ----------

const KNOWN_RECIPES: SimilarRecipeSuggestion[] = [
  {
    url: "https://www.allrecipes.com/recipe/10813/best-chocolate-chip-cookies/",
    title: "Best Chocolate Chip Cookies",
    image: "https://www.allrecipes.com/thmb/JDfMI0VJaKbSKOiKbFm2bY7OBpI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/10813-best-chocolate-chip-cookies-Chef-John-1x1-1-b3d0426a8a25451d94c8fb9e107a29dc.jpg",
    sourceSite: "AllRecipes",
  },
  {
    url: "https://www.budgetbytes.com/chili/",
    title: "One Pot Chili Mac",
    image: "https://www.budgetbytes.com/wp-content/uploads/2023/10/One-Pot-Chili-Mac-close-up.jpg",
    sourceSite: "Budget Bytes",
  },
  {
    url: "https://www.loveandlemons.com/banana-bread-recipe/",
    title: "Banana Bread",
    image: "https://cdn.loveandlemons.com/wp-content/uploads/2023/01/banana-bread-recipe.jpg",
    sourceSite: "Love and Lemons",
  },
  {
    url: "https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592",
    title: "Perfect Roast Chicken",
    image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2003/10/15/1/ig1a07_roasted_chicken.jpg",
    sourceSite: "Food Network",
  },
  {
    url: "https://www.bbcgoodfood.com/recipes/banana-bread",
    title: "Banana Bread",
    image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/banana-bread-ee97a7a.jpg",
    sourceSite: "BBC Good Food",
  },
  {
    url: "https://www.kingarthurbaking.com/recipes/banana-bread-recipe",
    title: "Banana Bread",
    image: "https://www.kingarthurbaking.com/sites/default/files/2024-04/Banana-Bread_0163.jpg",
    sourceSite: "King Arthur Baking",
  },
];

function getSuggestion(failedUrl: string): SimilarRecipeSuggestion {
  // Don't suggest the same site that just failed
  let failedDomain = "";
  try {
    failedDomain = new URL(failedUrl).hostname;
  } catch {
    // ignore
  }

  const candidates = KNOWN_RECIPES.filter(
    (r) => !r.url.includes(failedDomain)
  );

  return candidates[Math.floor(Math.random() * candidates.length)] ?? KNOWN_RECIPES[0];
}

// ---------- HTML fetching with ScraperAPI fallback ----------

type FetchResult =
  | { ok: true; html: string }
  | { ok: false; error: string; status: number };

async function directFetch(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  const response = await fetch(url, {
    signal: controller.signal,
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  clearTimeout(timeout);
  return response;
}

async function scraperApiFetch(url: string): Promise<Response> {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing SCRAPER_API_KEY");
  }

  // render=true tells ScraperAPI to execute JavaScript, which is needed for
  // sites like Serious Eats that load content dynamically.
  // timeout=20000 tells ScraperAPI to give up after 20s on their side.
  const scraperUrl = `https://api.scraperapi.com?api_key=${encodeURIComponent(apiKey)}&url=${encodeURIComponent(url)}&render=true&timeout=20000`;

  const controller = new AbortController();
  // 45s total to allow ScraperAPI time to render + respond
  const timeout = setTimeout(() => controller.abort(), 45_000);

  const response = await fetch(scraperUrl, {
    signal: controller.signal,
    redirect: "follow",
  });

  clearTimeout(timeout);
  return response;
}

async function fetchWithFallback(url: string): Promise<FetchResult> {
  // Step 1: Try direct fetch (free & fast)
  try {
    const response = await directFetch(url);

    if (response.ok) {
      return { ok: true, html: await response.text() };
    }

    // 404 means the page genuinely doesn't exist — no point retrying
    if (response.status === 404) {
      return { ok: false, error: "Page not found. Please check the URL and try again.", status: 422 };
    }

    // 403 or other blocking status — fall through to ScraperAPI
    if (response.status !== 403) {
      return {
        ok: false,
        error: `The recipe site returned an error (HTTP ${response.status}).`,
        status: 422,
      };
    }
  } catch (err) {
    // Network error or timeout on direct fetch — fall through to ScraperAPI
    if (err instanceof DOMException && err.name === "AbortError") {
      // Timeout — still worth trying ScraperAPI
    }
    // Other network errors — also try ScraperAPI
  }

  // Step 2: Retry through ScraperAPI (handles Cloudflare, bot protection)
  try {
    const response = await scraperApiFetch(url);

    if (response.ok) {
      return { ok: true, html: await response.text() };
    }

    if (response.status === 404) {
      return { ok: false, error: "Page not found. Please check the URL and try again.", status: 422 };
    }

    if (response.status === 403) {
      return {
        ok: false,
        error: "Access denied by the recipe site. This site blocks automated requests.",
        status: 422,
      };
    }

    return {
      ok: false,
      error: `The recipe site returned an error (HTTP ${response.status}).`,
      status: 422,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        ok: false,
        error: "The recipe site took too long to respond. Please try again.",
        status: 422,
      };
    }
    return {
      ok: false,
      error: "Could not reach the recipe site. Please check the URL and try again.",
      status: 422,
    };
  }
}

// ---------- POST handler ----------

export async function POST(request: Request) {
  // --- Rate limiting ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { success: false, error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  // --- Parse & validate request body ---
  let body: ExtractRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return Response.json(
      { success: false, error: "Missing 'url' field in request body." },
      { status: 400 }
    );
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return Response.json(
      { success: false, error: "Invalid URL. Please provide a valid URL starting with http:// or https://." },
      { status: 400 }
    );
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return Response.json(
      { success: false, error: "Only HTTP and HTTPS URLs are supported." },
      { status: 400 }
    );
  }

  // --- Check for OpenAI API key ---
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { success: false, error: "Server configuration error: missing OpenAI API key." },
      { status: 500 }
    );
  }

  // --- Fetch the recipe page ---
  // Strategy: try direct fetch first (free & fast). If the site blocks us
  // with a 403, retry through ScraperAPI which can bypass bot protection.
  let html: string;
  const fetchResult = await fetchWithFallback(url);

  if (!fetchResult.ok) {
    return Response.json(
      { success: false, error: fetchResult.error, suggestion: getSuggestion(url) },
      { status: fetchResult.status }
    );
  }

  html = fetchResult.html;

  // --- Clean HTML ---
  const cleanedHtml = cleanHtml(html);

  // --- Send to OpenAI ---
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let recipe: Recipe;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract the recipe from this page. The source URL is: ${url}\n\n${cleanedHtml}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return Response.json(
        { success: false, error: "The AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    // Check if the AI said there's no recipe
    if (parsed.error) {
      return Response.json(
        { success: false, error: parsed.error, suggestion: getSuggestion(url) },
        { status: 422 }
      );
    }

    recipe = { ...parsed, sourceUrl: url };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return Response.json(
        { success: false, error: "The AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }
    return Response.json(
      { success: false, error: "Failed to process the recipe. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ success: true, recipe });
}
