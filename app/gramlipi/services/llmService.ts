import type { ComplaintDetails, ComplaintLetter,DocumentSummary, Language, SimplifiedDocument } from '../types';
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
const OLLAMA_MODEL = 'llama3.2:3b';

interface OllamaGenerateResponse {
  response: string;
}

function buildSummaryPrompt(text: string, language: Language): string {
    const languageInstruction =
      language === 'kn'
        ? 'Respond entirely in Kannada script. Every word, including dates, month names, and headings-equivalent phrases, must be written in Kannada — do not leave any English words, numerals-as-English-months (e.g. "November"), or English phrases mixed in. Numbers/phone numbers may stay in digits, but all surrounding words must be Kannada.'
        : 'Respond with all text values written in simple, plain English.';
  
    return `You are helping a villager fully understand a government notice they may not read again. Read the notice text below and respond with ONLY a JSON object (no markdown, no code fences, no extra commentary) matching exactly this shape:
  
  {
    "mainPurpose": string,
    "importantDates": string[],
    "requiredActions": string[],
    "keyPoints": string[]
  }
  
  ${languageInstruction}
  
  Be thorough and specific — do not compress this into single generic phrases. Guidelines for each field:
  
  - "mainPurpose": 1-2 full sentences explaining what this notice is about, who it concerns, and why it was issued. Do not just name a category (e.g. avoid "Application Information") — explain what is actually happening.
  - "importantDates": every date mentioned, each written with what it's FOR, e.g. "16 November 2024 — last date to submit application" not just "16 November 2024". If no dates exist, return [].
  - "requiredActions": every concrete action the reader must take, written as full instructions including where/how, e.g. "Submit your application with all required documents to the Public Relations Officer's office" not just "Submit Applications". If none, return [].
  - "keyPoints": all remaining important specifics that don't fit above — names of offices/officials, addresses/locations, contact numbers (list each one), reference/session numbers, eligibility conditions, or anything the reader would otherwise have to re-read the notice to find. Extract these directly from the text; do not omit contact numbers or addresses if present.
  
  Do not leave any field sparse if the source text contains relevant detail — extract everything meaningful, don't summarize it away.
  
  Notice text:
  """
  ${text}
  """`;
  }
  function buildComplaintPrompt(details: ComplaintDetails, language: Language): string {
    const languageInstruction =
      language === 'kn'
        ? 'Write the entire letter in formal, respectful Kannada.'
        : 'Write the entire letter in formal, respectful English.';
  
    return `You are helping a villager write a formal complaint letter to a government authority. Using the details below, draft the letter and respond with ONLY a JSON object (no markdown, no code fences, no extra commentary) matching exactly this shape:
  
  {
    "subject": string,
    "greeting": string,
    "body": string,
    "closingStatement": string
  }
  
  ${languageInstruction}
  
  Guidelines:
  - "subject": a short, clear one-line subject referencing the issue.
  - "greeting": a formal salutation addressed to the given authority (e.g. "Respected Sir/Madam," or the Kannada equivalent).
  - "body": 2-4 paragraphs stating what happened, where and when (use the location and date given), why it needs attention, and a polite request for action. Do not invent facts beyond what is given below.
  - "closingStatement": a formal closing request and sign-off phrase (e.g. "I request you to kindly look into this matter at the earliest. Thanking you,"). Do not include a name/signature line — the app adds that separately.
  
  Complaint details:
  Issue Title: ${details.issueTitle}
  Location: ${details.location}
  Date: ${details.date}
  Authority: ${details.authorityName}
  Description: ${details.description}`;
  }

  interface ComplaintLetterFields {
    subject: string;
    greeting: string;
    body: string;
    closingStatement: string;
  }
  
  /**
   * Translates an already-drafted English letter into Kannada, rather than
   * asking the model to draft directly in Kannada. Translation of finished,
   * well-formed English text is a far more reliable task for a small local
   * model than composing formal, grammatically correct Kannada from raw form
   * details — this consistently produces more natural results.
   */
  async function translateComplaintLetterFields(
    fields: ComplaintLetterFields,
    targetLanguage: Language
  ): Promise<ComplaintLetterFields> {
    if (targetLanguage === 'en') return fields;
  
    const prompt = `Translate the following formal complaint letter into natural, fluent, grammatically correct Kannada, as a native Kannada speaker would write it formally. Preserve the formal tone and every fact, date, number, and name exactly — do not summarize, shorten, or add anything. Respond with ONLY a JSON object (no markdown, no commentary) in exactly this shape:
  
  {
    "subject": string,
    "greeting": string,
    "body": string,
    "closingStatement": string
  }
  
  Letter to translate:
  Subject: ${fields.subject}
  Greeting: ${fields.greeting}
  Body: ${fields.body}
  Closing: ${fields.closingStatement}`;
  
    let response: Response;
    try {
      response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          format: 'json',
        }),
      });
    } catch {
      throw new Error('Could not reach Ollama while translating the letter.');
    }
  
    if (!response.ok) {
      throw new Error(`Ollama returned an error (${response.status}) while translating.`);
    }
  
    const { response: rawModelOutput }: OllamaGenerateResponse = await response.json();
  
    let parsed: Partial<ComplaintLetterFields>;
    try {
      parsed = JSON.parse(rawModelOutput);
    } catch {
      throw new Error('The model did not return valid JSON while translating. Try again.');
    }
  
    return {
      subject: parsed.subject ?? fields.subject,
      greeting: parsed.greeting ?? fields.greeting,
      body: parsed.body ?? fields.body,
      closingStatement: parsed.closingStatement ?? fields.closingStatement,
    };
  }
  function buildSimplifyPrompt(text: string, language: Language): string {
    const languageInstruction =
      language === 'kn'
        ? 'Write your rewritten version entirely in Kannada script. Every word, including dates and month names, must be in Kannada — do not leave any English words or phrases mixed in. Numbers/phone numbers may stay in digits, but all surrounding words must be Kannada.'
        : 'Write your rewritten version in simple, plain English.';
  
    return `You are helping a villager who may not understand formal or legal government language. Rewrite the notice text below in plain, simple, everyday language so an ordinary person can understand it easily.
  
  ${languageInstruction}
  
  Rules:
  - Keep every fact, date, number, name, and instruction from the original — do not drop or invent information.
  - Replace difficult or bureaucratic words with simple everyday words.
  - Break long sentences into short, clear sentences.
  - Keep the same overall order of information as the original.
  - Respond with ONLY the rewritten text. No headings, no markdown, no commentary, no preamble like "Here is the simplified version".
  
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

/**
 * Sends complaint form details to the local Ollama instance and asks it to
 * draft a formal letter. Same connectivity requirements as
 * summarizeDocument() — see that function's docstring.
 */
export async function generateComplaintLetter(
    details: ComplaintDetails,
    letterId: string,
    language: Language = 'en'
  ): Promise<ComplaintLetter> {
    // Always draft in English first, regardless of the requested output
    // language — see translateComplaintLetterFields() for why.
    let response: Response;
  
    try {
      response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: buildComplaintPrompt(details, 'en'),
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
  
    let parsed: Partial<ComplaintLetterFields>;
    try {
      parsed = JSON.parse(rawModelOutput);
    } catch {
      throw new Error('The model did not return valid JSON. Try again, or use a different model.');
    }
  
    if (!parsed.subject || !parsed.body) {
      throw new Error('The model returned an incomplete letter. Try again.');
    }
  
    const englishFields: ComplaintLetterFields = {
      subject: parsed.subject,
      greeting: parsed.greeting ?? 'Respected Sir/Madam,',
      body: parsed.body,
      closingStatement: parsed.closingStatement ?? '',
    };
  
    const finalFields = await translateComplaintLetterFields(englishFields, language);
  
    return {
      id: letterId,
      details,
      subject: finalFields.subject,
      greeting: finalFields.greeting,
      body: finalFields.body,
      closingStatement: finalFields.closingStatement,
      language,
      generatedAt: new Date().toISOString(),
    };
  }

/**
 * Sends OCR'd document text to the local Ollama instance and asks it to
 * rewrite it in plain language. Same connectivity requirements as
 * summarizeDocument() — see that function's docstring.
 */
export async function simplifyDocument(
    text: string,
    documentId: string,
    language: Language = 'en'
  ): Promise<SimplifiedDocument> {
    let response: Response;
  
    try {
      response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: buildSimplifyPrompt(text, language),
          stream: false,
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
    const simplifiedText = rawModelOutput.trim();
  
    if (!simplifiedText) {
      throw new Error('The model returned an empty response. Try again.');
    }
  
    return {
      documentId,
      originalText: text,
      simplifiedText,
      language,
    };
  }
