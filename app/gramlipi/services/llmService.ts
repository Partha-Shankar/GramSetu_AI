import type { DocumentSummary, Language } from '../types';

/**
 * IMPORTANT — architecture note:
 * This module's spec calls for an on-device LLM running inside the browser
 * (ONNX Runtime Web / WebAssembly), so it works offline on a villager's
 * phone with nothing installed. Ollama is a separate desktop application
 * running a local server — it requires a laptop, a manual install, and a
 * running background process, none of which fit that requirement.
 *
 * This file exists for local development/demo purposes only, and is
 * intentionally isolated behind `summarizeDocument()` so the rest of the
 * app (hooks, components, state) never talks to Ollama directly. Swapping
 * this out for a real in-browser model later means changing only this
 * file, not anything that calls it.
 */

const OLLAMA_BASE_URL = 'http://localhost:11434';
// Any small, free, locally-pulled Ollama model works here — change this to
// whatever you've pulled, e.g. `ollama pull llama3.2:1b`.
const OLLAMA_MODEL = 'llama3.2:1b';

interface OllamaGenerateResponse {
  response: string;
}

function buildSummaryPrompt(text: string, language: Language): string {
  const languageInstruction =
    language === 'kn'
      ? 'Respond with all text values written in Kannada.'
      : 'Respond with all text values written in simple, plain English.';

  return `You are helping a villager understand a government notice. Read the notice text below and respond with ONLY a JSON object (no markdown, no code fences, no extra commentary) matching exactly this shape:

{
  "mainPurpose": string,
  "importantDates": string[],
  "requiredActions": string[],
  "keyPoints": string[]
}

${languageInstruction} Keep each string short and in plain, everyday language — avoid legal or bureaucratic wording. If there are no dates or no specific actions, return an empty array for that field.

Notice text:
"""
${text}
"""`;
}

/**
 * Sends OCR'd document text to a locally-running Ollama instance and asks
 * it to return a structured summary. Requires Ollama running locally with
 * OLLAMA_MODEL already pulled, and CORS enabled for this app's origin
 * (set the OLLAMA_ORIGINS environment variable before starting Ollama —
 * see README for the exact command).
 */
export async function summarizeDocument(
  text: string,
  documentId: string,
  language: Language = 'en'
): Promise<DocumentSummary> {
  let response: Response;

  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: buildSummaryPrompt(text, language),
        stream: false,
        format: 'json',
      }),
    });
  } catch {
    throw new Error(
      'Could not reach Ollama. Make sure it is running locally (ollama serve) and that OLLAMA_ORIGINS allows this app.'
    );
  }

  if (!response.ok) {
    throw new Error(`Ollama returned an error (${response.status}). Is the model pulled?`);
  }

  const { response: rawModelOutput }: OllamaGenerateResponse = await response.json();

  let parsed: {
    mainPurpose?: string;
    importantDates?: string[];
    requiredActions?: string[];
    keyPoints?: string[];
  };

  try {
    parsed = JSON.parse(rawModelOutput);
  } catch {
    throw new Error('The model did not return valid JSON. Try again, or use a different model.');
  }

  return {
    documentId,
    mainPurpose: parsed.mainPurpose ?? '',
    importantDates: parsed.importantDates ?? [],
    requiredActions: parsed.requiredActions ?? [],
    keyPoints: parsed.keyPoints ?? [],
    language,
  };
}