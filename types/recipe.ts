// ---- API Request ----

export interface ExtractRequest {
  url: string;
}

// ---- Structured Recipe ----

export interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
  notes: string;
}

export interface Instruction {
  step: number;
  text: string;
  ingredientRefs: number[];
}

export interface Recipe {
  title: string;
  description: string | null;
  image: string | null;
  prepTime: string | null;
  cookTime: string | null;
  totalTime: string | null;
  servings: string | null;
  ingredients: Ingredient[];
  instructions: Instruction[];
  sourceUrl: string;
  sourceSite: string;
}

// ---- Similar Recipe Suggestion (shown when extraction fails) ----

export interface SimilarRecipeSuggestion {
  url: string;
  title: string;
  image: string | null;
  sourceSite: string;
}

// ---- API Response ----

export interface ExtractSuccessResponse {
  success: true;
  recipe: Recipe;
  wasRedirected?: boolean;
}

export interface ExtractErrorResponse {
  success: false;
  error: string;
  suggestion?: SimilarRecipeSuggestion;
}

export type ExtractResponse = ExtractSuccessResponse | ExtractErrorResponse;
