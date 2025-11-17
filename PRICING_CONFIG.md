# Pricing Configuration Guide

This document explains the structure and management of `pricing-config.json`, which controls destination pricing and financial parameters for the VIDA Travel simulator.

## File Location

- **Local**: `/pricing-config.json` (root of project)
- **Cloud Storage**: `gs://[bucket-name]/pricing-config.json`
- **Purpose**: Stores destination pricing, seasonal multipliers, and financial calculation parameters

---

## JSON Structure

```json
{
  "destinations": {
    "destination-id": {
      "name": {
        "es-MX": "Spanish Name",
        "en-US": "English Name"
      },
      "basePrice": 15000,
      "priceRange": {
        "min": 12000,
        "max": 18000
      },
      "seasonalPricing": {
        "high": {
          "months": [12, 1, 2, 3],
          "multiplier": 1.1,
          "description": {
            "es-MX": "Temporada alta",
            "en-US": "High season"
          }
        },
        "medium": {
          "months": [4, 5, 11],
          "multiplier": 1.0,
          "description": {
            "es-MX": "Temporada media",
            "en-US": "Medium season"
          }
        },
        "low": {
          "months": [6, 7, 8, 9, 10],
          "multiplier": 0.9,
          "description": {
            "es-MX": "Temporada baja",
            "en-US": "Low season"
          }
        }
      }
    }
  },
  "childrenDiscount": 0.25,
  "savingsTargetPercentage": 0.8,
  "loanPercentage": 0.2,
  "loanTermRange": {
    "min": 6,
    "max": 12
  },
  "maxMonthlyPaymentPercentage": 0.15,
  "currency": "MXN",
  "packageDuration": {
    "min": 5,
    "max": 7
  }
}
```

---

## Field Descriptions

### Top-Level Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `destinations` | Object | Map of destination IDs to pricing configs | See below |
| `childrenDiscount` | Number | Percentage of adult price for children (0-1) | `0.25` = 25% |
| `savingsTargetPercentage` | Number | Percentage of total price user must save (0-1) | `0.8` = 80% |
| `loanPercentage` | Number | Percentage of total price VIDA loans (0-1) | `0.2` = 20% |
| `loanTermRange` | Object | Min/max loan repayment months | `{"min": 6, "max": 12}` |
| `maxMonthlyPaymentPercentage` | Number | Max monthly payment as % of salary (0-1) | `0.15` = 15% |
| `currency` | String | Currency code | `"MXN"` |
| `packageDuration` | Object | Min/max package duration in days | `{"min": 5, "max": 7}` |

### Destination Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | Object | Bilingual destination name | `{"es-MX": "Cancún", "en-US": "Cancun"}` |
| `basePrice` | Number | Base price per adult in MXN | `22500` |
| `priceRange` | Object | Min/max price for display | `{"min": 20000, "max": 25000}` |
| `seasonalPricing` | Object | Season definitions with multipliers | See below |

### Seasonal Pricing Structure

Each season (`high`, `medium`, `low`) contains:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `months` | Array | Month numbers (1-12) | `[12, 1, 2, 3]` |
| `multiplier` | Number | Price multiplier for this season | `1.1` = 10% increase |
| `description` | Object | Bilingual season description | `{"es-MX": "...", "en-US": "..."}` |

**Month Numbers:**
- `1` = January
- `2` = February
- `3` = March
- `4` = April
- `5` = May
- `6` = June
- `7` = July
- `8` = August
- `9` = September
- `10` = October
- `11` = November
- `12` = December

---

## Current Destinations

### Cancún
- **ID**: `cancun`
- **Base Price**: $22,500 MXN
- **Range**: $20,000 - $25,000 MXN
- **High Season**: Dec-Mar (1.1x multiplier)
- **Low Season**: Jun-Oct (0.9x multiplier)

### Puerto Vallarta
- **ID**: `puerto-vallarta`
- **Base Price**: $17,500 MXN
- **Range**: $15,000 - $20,000 MXN
- **High Season**: Dec-Mar (1.1x multiplier)
- **Low Season**: Jun-Oct (0.9x multiplier)

### Los Cabos
- **ID**: `los-cabos`
- **Base Price**: $22,500 MXN
- **Range**: $20,000 - $25,000 MXN
- **High Season**: Dec-Mar (1.1x multiplier)
- **Low Season**: Jun-Oct (0.9x multiplier)

### Ciudad de México
- **ID**: `ciudad-de-mexico`
- **Base Price**: $12,500 MXN
- **Range**: $10,000 - $15,000 MXN
- **High Season**: Dec-Apr (1.05x multiplier)
- **Low Season**: Jul-Sep (0.95x multiplier)

### Oaxaca
- **ID**: `oaxaca`
- **Base Price**: $12,500 MXN
- **Range**: $10,000 - $15,000 MXN
- **High Season**: Dec-Mar, Jul (1.05x multiplier)
- **Low Season**: Aug-Oct (0.95x multiplier)

### Chiapas
- **ID**: `chiapas`
- **Base Price**: $17,500 MXN
- **Range**: $15,000 - $20,000 MXN
- **High Season**: Dec-Apr (1.05x multiplier)
- **Low Season**: Jul-Sep (0.95x multiplier)

---

## Pricing Calculation Logic

### Step 1: Get Base Price
```javascript
basePrice = destination.basePrice  // e.g., 22500
```

### Step 2: Apply Seasonal Multiplier
```javascript
checkInMonth = new Date(checkIn).getMonth() + 1  // 1-12
season = findSeasonForMonth(destination.seasonalPricing, checkInMonth)
multiplier = season.multiplier  // e.g., 1.1
adjustedPrice = basePrice * multiplier  // e.g., 22500 * 1.1 = 24750
```

### Step 3: Calculate Total Package Price
```javascript
adultPrice = adjustedPrice
childrenPrice = adultPrice * childrenDiscount  // e.g., 24750 * 0.25 = 6187.5
totalPrice = (adults * adultPrice) + (children * childrenPrice)
```

### Example Calculation

**Scenario:**
- Destination: Cancún (base: $22,500)
- Check-in: January (high season, 1.1x)
- Adults: 2
- Children: 1

**Calculation:**
1. Adjusted adult price: $22,500 × 1.1 = $24,750
2. Children price: $24,750 × 0.25 = $6,187.50
3. Total: (2 × $24,750) + (1 × $6,187.50) = $55,687.50 MXN

---

## Financial Parameters

### Savings Target (80%)
- Users must save **80%** of total package price
- Remaining **20%** is provided as 0% interest loan
- Example: $55,687.50 total → Save $44,550, Loan $11,137.50

### Loan Terms
- **Minimum**: 6 months
- **Maximum**: 12 months
- Automatically adjusted to ensure monthly payment ≤ 15% of salary

### Monthly Payment Rule (15%)
- Maximum monthly payment = **15%** of monthly salary
- System calculates minimum months needed: `ceil(loanAmount / maxMonthlyPayment)`
- Loan term set to: `max(6, min(12, minMonthsNeeded))`

### Example Loan Calculation

**Scenario:**
- Total price: $55,687.50
- Loan amount (20%): $11,137.50
- Monthly salary: $15,000 MXN
- Max monthly payment (15%): $2,250

**Calculation:**
1. Min months needed: `ceil(11137.50 / 2250)` = 5 months
2. Loan term: `max(6, min(12, 5))` = 6 months
3. Actual monthly payment: $11,137.50 / 6 = $1,856.25
4. Payment percentage: ($1,856.25 / $15,000) × 100 = 12.4% ✓

---

## Adding a New Destination

### 1. Add to `pricing-config.json`

```json
{
  "destinations": {
    "new-destination-id": {
      "name": {
        "es-MX": "Nombre en Español",
        "en-US": "English Name"
      },
      "basePrice": 15000,
      "priceRange": {
        "min": 12000,
        "max": 18000
      },
      "seasonalPricing": {
        "high": {
          "months": [12, 1, 2, 3],
          "multiplier": 1.1,
          "description": {
            "es-MX": "Temporada alta (diciembre-marzo)",
            "en-US": "High season (December-March)"
          }
        },
        "medium": {
          "months": [4, 5, 11],
          "multiplier": 1.0,
          "description": {
            "es-MX": "Temporada media",
            "en-US": "Medium season"
          }
        },
        "low": {
          "months": [6, 7, 8, 9, 10],
          "multiplier": 0.9,
          "description": {
            "es-MX": "Temporada baja",
            "en-US": "Low season"
          }
        }
      }
    }
  }
}
```

### 2. Update Frontend

Add to `public/js/destination-selector.js`:
```javascript
{
  id: 'new-destination-id',
  name: { 'es-MX': 'Nombre en Español', 'en-US': 'English Name' },
  priceRange: { min: 12000, max: 18000 }
}
```

### 3. Update RAG Context

Add destination info to `rag-context.json` in both `es-MX` and `en-US` sections.

### 4. Add Destination Image

Upload to `public/images/destinations/new-destination-id.jpg` or Cloud Storage.

### 5. Deploy

```bash
# Upload updated config
gsutil cp pricing-config.json gs://[bucket-name]/pricing-config.json

# Deploy frontend
firebase deploy --only hosting
```

---

## Updating Pricing

### Method 1: Edit Base Price

Change `basePrice` for a destination:
```json
"cancun": {
  "basePrice": 24000,  // Changed from 22500
  ...
}
```

### Method 2: Adjust Seasonal Multipliers

Change season multipliers:
```json
"seasonalPricing": {
  "high": {
    "multiplier": 1.15,  // Increased from 1.1
    ...
  }
}
```

### Method 3: Modify Price Range

Update display range:
```json
"priceRange": {
  "min": 22000,  // Updated
  "max": 27000   // Updated
}
```

### Upload Changes

```bash
gsutil cp pricing-config.json gs://[bucket-name]/pricing-config.json
```

**Note**: Pricing engine caches config for 1 hour. Changes take effect after cache expires or Cloud Functions restart.

---

## Modifying Financial Parameters

### Change Savings Target (Default: 80%)

```json
"savingsTargetPercentage": 0.75  // Users save 75% instead of 80%
```

### Change Loan Percentage (Default: 20%)

```json
"loanPercentage": 0.25  // VIDA loans 25% instead of 20%
```

**Note**: `savingsTargetPercentage + loanPercentage` should equal 1.0 (100%)

### Change Loan Term Range

```json
"loanTermRange": {
  "min": 3,   // Minimum 3 months
  "max": 18   // Maximum 18 months
}
```

### Change Maximum Monthly Payment (Default: 15%)

```json
"maxMonthlyPaymentPercentage": 0.20  // Allow up to 20% of salary
```

---

## Validation Rules

### Required Fields
- All destinations must have: `name`, `basePrice`, `priceRange`, `seasonalPricing`
- Each season must have: `months`, `multiplier`, `description`
- Top-level must have: `childrenDiscount`, `savingsTargetPercentage`, `loanPercentage`

### Value Constraints
- `basePrice`: Must be > 0
- `priceRange.min`: Must be ≤ `basePrice`
- `priceRange.max`: Must be ≥ `basePrice`
- `childrenDiscount`: Must be between 0 and 1
- `savingsTargetPercentage`: Must be between 0 and 1
- `loanPercentage`: Must be between 0 and 1
- `savingsTargetPercentage + loanPercentage`: Should equal 1.0
- `multiplier`: Typically 0.8-1.2 (80%-120%)
- `months`: Array of integers 1-12, no duplicates

---

## Testing Pricing Changes

### Local Testing

1. Update `pricing-config.json` locally
2. Test simulator with different dates/seasons
3. Verify calculations match expected results

### Staging Testing

1. Upload to Cloud Storage staging bucket
2. Test with staging Cloud Functions
3. Verify pricing displays correctly

### Production Deployment

1. Upload to production Cloud Storage
2. Monitor Cloud Functions logs for errors
3. Verify pricing in production environment

---

## Troubleshooting

### Pricing Not Updating

**Issue**: Changes to `pricing-config.json` not reflected in simulator

**Solutions**:
1. Wait 1 hour for cache to expire
2. Restart Cloud Functions: `firebase functions:delete simulateVacationCredit && firebase deploy --only functions`
3. Verify file uploaded correctly: `gsutil ls gs://[bucket]/pricing-config.json`
4. Check JSON syntax is valid

### Incorrect Seasonal Pricing

**Issue**: Prices don't match expected season multipliers

**Solutions**:
1. Verify month numbers are correct (1-12, not 0-11)
2. Check that check-in date month matches season definition
3. Verify multiplier values are correct
4. Check Cloud Functions logs for calculation errors

### Loan Calculations Wrong

**Issue**: Monthly payment exceeds 15% rule

**Solutions**:
1. Verify `maxMonthlyPaymentPercentage` is 0.15
2. Check loan term calculation logic
3. Verify `loanTermRange` min/max values
4. Check that loan amount calculation is correct (20% of total)

---

## Best Practices

1. **Version Control**: Keep `pricing-config.json` in Git
2. **Backup**: Always backup before making changes
3. **Test First**: Test pricing changes in staging before production
4. **Document Changes**: Note reason for price changes
5. **Monitor**: Track conversion rates after price changes
6. **Seasonal Updates**: Review and update seasonal pricing quarterly
7. **Consistency**: Keep price ranges consistent across similar destinations

---

## Support

For pricing-related issues:
- Check Cloud Functions logs: `firebase functions:log`
- Verify JSON syntax: Use JSON validator
- Review calculation logic in `functions/src/pricingEngine.ts`
- See `OPERATIONS.md` for general operational guides


