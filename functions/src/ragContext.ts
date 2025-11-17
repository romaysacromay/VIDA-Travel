// RAG Context Loader - Reads bilingual knowledge base from Cloud Storage
import { getStorage } from "firebase-admin/storage";

interface RAGContext {
  [language: string]: {
    mission?: { title: string; content: string };
    model?: { title: string; content: string };
    simulator?: { title: string; rules: string[] };
    destinations?: Record<string, DestinationInfo>;
    financing?: { title: string; details: string[]; guarantee: string };
    eligibility?: { title: string; requirements: string[] };
    faqs?: Array<{ question: string; answer: string }>;
    privacy?: { title: string; content: string };
  };
}

interface DestinationInfo {
  name: string;
  description: string;
  priceRange: string;
  bestTime: string;
}

let ragContextCache: RAGContext | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getRagContext(language: string = "es-MX"): Promise<string> {
  // Return cached context if still valid
  const now = Date.now();
  if (ragContextCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return formatRagContext(ragContextCache, language);
  }

  try {
    const bucket = getStorage().bucket();
    const file = bucket.file("rag-context.json");
    
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("rag-context.json not found in Cloud Storage");
    }

    const [contents] = await file.download();
    const context = JSON.parse(contents.toString());
    
    // Cache the context
    ragContextCache = context;
    cacheTimestamp = now;
    
    return formatRagContext(context, language);
  } catch (error) {
    console.error("Error loading RAG context:", error);
    
    // Return default context
    return getDefaultRagContext(language);
  }
}

function formatRagContext(context: RAGContext, language: string): string {
  const langContext = context[language] || context["es-MX"];
  
  if (!langContext) {
    return getDefaultRagContext(language);
  }

  let formatted = `VIDA Travel - ${langContext.mission?.title || "Mission"}\n\n`;
  formatted += `${langContext.mission?.content || ""}\n\n`;
  
  formatted += `${langContext.model?.title || "Business Model"}\n`;
  formatted += `${langContext.model?.content || ""}\n\n`;
  
  formatted += `${langContext.simulator?.title || "Simulator Rules"}\n`;
  if (langContext.simulator?.rules) {
    langContext.simulator.rules.forEach((rule: string, index: number) => {
      formatted += `${index + 1}. ${rule}\n`;
    });
  }
  formatted += "\n";
  
  formatted += "Destinations:\n";
  if (langContext.destinations) {
    Object.entries(langContext.destinations).forEach(([_key, dest]: [string, DestinationInfo]) => {
      formatted += `- ${dest.name}: ${dest.description}\n`;
      formatted += `  Price Range: ${dest.priceRange}\n`;
      formatted += `  Best Time: ${dest.bestTime}\n\n`;
    });
  }
  
  formatted += `${langContext.financing?.title || "Financing"}\n`;
  formatted += `${langContext.financing?.guarantee || ""}\n`;
  if (langContext.financing?.details) {
    langContext.financing.details.forEach((detail: string) => {
      formatted += `- ${detail}\n`;
    });
  }
  formatted += "\n";
  
  formatted += `${langContext.eligibility?.title || "Eligibility"}\n`;
  if (langContext.eligibility?.requirements) {
    langContext.eligibility.requirements.forEach((req: string) => {
      formatted += `- ${req}\n`;
    });
  }
  formatted += "\n";
  
  formatted += "Frequently Asked Questions:\n";
  if (langContext.faqs) {
    langContext.faqs.forEach((faq: { question: string; answer: string }) => {
      formatted += `Q: ${faq.question}\n`;
      formatted += `A: ${faq.answer}\n\n`;
    });
  }
  
  formatted += `${langContext.privacy?.title || "Privacy"}\n`;
  formatted += `${langContext.privacy?.content || ""}\n`;
  
  return formatted;
}

function getDefaultRagContext(language: string): string {
  if (language === "en-US") {
    return "VIDA Travel is a domestic tourism platform helping Mexican families plan and finance their dream vacations with interest-free credit. Users save 80% of package cost, VIDA provides 0% interest loan for remaining 20%. Monthly payment never exceeds 15% of salary. Loan terms: 6-12 months.";
  }
  
  return "VIDA Travel es una plataforma de turismo doméstico que ayuda a las familias mexicanas a planear y financiar sus vacaciones soñadas con crédito sin intereses. Los usuarios ahorran el 80% del costo del paquete, VIDA proporciona un préstamo del 20% sin intereses. El pago mensual nunca excede el 15% del salario. Plazos: 6-12 meses.";
}

