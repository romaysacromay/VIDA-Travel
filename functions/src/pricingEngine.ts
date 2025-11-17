// Pricing Engine - Reads seasonal pricing from Cloud Storage
import { getStorage } from "firebase-admin/storage";

interface PricingConfig {
  destinations: Record<string, DestinationConfig>;
  childrenDiscount: number;
  savingsTargetPercentage: number;
  loanPercentage: number;
  loanTermRange: { min: number; max: number };
  maxMonthlyPaymentPercentage: number;
  currency: string;
  packageDuration: { min: number; max: number };
}

interface DestinationConfig {
  name: { "es-MX": string; "en-US": string };
  basePrice: number;
  priceRange: { min: number; max: number };
  seasonalPricing?: Record<string, SeasonConfig>;
}

interface SeasonConfig {
  months: number[];
  multiplier: number;
  description: { "es-MX": string; "en-US": string };
}

let pricingConfigCache: PricingConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600000; // 1 hour

export async function getPricingConfig(): Promise<PricingConfig> {
  // Return cached config if still valid
  const now = Date.now();
  if (pricingConfigCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return pricingConfigCache;
  }

  try {
    const bucket = getStorage().bucket();
    const file = bucket.file("pricing-config.json");
    
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("pricing-config.json not found in Cloud Storage");
    }

    const [contents] = await file.download();
    const config = JSON.parse(contents.toString());
    
    // Cache the config
    pricingConfigCache = config;
    cacheTimestamp = now;
    
    return config;
  } catch (error) {
    console.error("Error loading pricing config:", error);
    
    // Return default config if file not found
    return {
      destinations: {
        "cancun": { name: { "es-MX": "Cancún", "en-US": "Cancun" }, basePrice: 22500, priceRange: { min: 20000, max: 25000 } },
        "puerto-vallarta": { name: { "es-MX": "Puerto Vallarta", "en-US": "Puerto Vallarta" }, basePrice: 17500, priceRange: { min: 15000, max: 20000 } },
        "los-cabos": { name: { "es-MX": "Los Cabos", "en-US": "Los Cabos" }, basePrice: 22500, priceRange: { min: 20000, max: 25000 } },
        "ciudad-de-mexico": { name: { "es-MX": "Ciudad de México", "en-US": "Mexico City" }, basePrice: 12500, priceRange: { min: 10000, max: 15000 } },
        "oaxaca": { name: { "es-MX": "Oaxaca", "en-US": "Oaxaca" }, basePrice: 12500, priceRange: { min: 10000, max: 15000 } },
        "chiapas": { name: { "es-MX": "Chiapas", "en-US": "Chiapas" }, basePrice: 17500, priceRange: { min: 15000, max: 20000 } }
      },
      childrenDiscount: 0.25,
      savingsTargetPercentage: 0.8,
      loanPercentage: 0.2,
      loanTermRange: { min: 6, max: 12 },
      maxMonthlyPaymentPercentage: 0.15,
      currency: "MXN",
      packageDuration: { min: 5, max: 7 }
    };
  }
}

export function getDestinationPrice(
  config: PricingConfig,
  destinationId: string,
  checkInDate: string
): number {
  const destination = config.destinations[destinationId];
  if (!destination) {
    throw new Error(`Destination ${destinationId} not found`);
  }

  const checkIn = new Date(checkInDate);
  const month = checkIn.getMonth() + 1; // JavaScript months are 0-indexed

  // Determine season
  let multiplier = 1.0;
  if (destination.seasonalPricing) {
    for (const [, seasonData] of Object.entries(destination.seasonalPricing)) {
      const seasonInfo = seasonData as SeasonConfig;
      if (seasonInfo.months.includes(month)) {
        multiplier = seasonInfo.multiplier;
        break;
      }
    }
  }

  return Math.round(destination.basePrice * multiplier);
}

