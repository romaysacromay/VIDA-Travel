# 🌴 Seed Destinations to Firestore

## Quick Manual Method (Recommended - 5 minutes)

Since automated seeding requires authentication setup, here's the fastest way to add destinations manually:

### Via Firebase Console

1. **Open Firestore Console**
   ```
   https://console.firebase.google.com/project/vida-travel-vacation-credit/firestore/data
   ```

2. **Create Collection**
   - Click "Start collection"
   - Collection ID: `destinations`
   - Click "Next"

3. **Add 6 Documents** (Copy-paste each)

#### Document 1: Cancún
```
Document ID: cancun

Fields:
id: "cancun"
name (map):
  es: "Cancún"
  en: "Cancun"
basePrice: 15000
description (map):
  es: "Playas de arena blanca, aguas turquesas y vida nocturna vibrante."
  en: "White sand beaches, turquoise waters, and vibrant nightlife."
highlights (map):
  es (array): ["Zona Hotelera", "Isla Mujeres", "Parques acuáticos", "Ruinas mayas"]
  en (array): ["Hotel Zone", "Isla Mujeres", "Water parks", "Mayan ruins"]
imageUrl: "/assets/destinations/cancun.jpg"
active: true
order: 1
```

#### Document 2: Playa del Carmen
```
Document ID: playadelcarmen

Fields:
id: "playadelcarmen"
name (map):
  es: "Playa del Carmen"
  en: "Playa del Carmen"
basePrice: 13000
description (map):
  es: "Ambiente cosmopolita, cenotes mágicos y la famosa Quinta Avenida."
  en: "Cosmopolitan atmosphere, magical cenotes, and Fifth Avenue."
highlights (map):
  es (array): ["Quinta Avenida", "Cenotes", "Cozumel", "Tulum"]
  en (array): ["Fifth Avenue", "Cenotes", "Cozumel", "Tulum"]
imageUrl: "/assets/destinations/playa.jpg"
active: true
order: 2
```

#### Document 3: Tulum
```
Document ID: tulum

Fields:
id: "tulum"
name (map):
  es: "Tulum"
  en: "Tulum"
basePrice: 16000
description (map):
  es: "Ruinas mayas frente al mar, playas bohemias y cenotes místicos."
  en: "Mayan ruins by the sea, bohemian beaches, and mystical cenotes."
highlights (map):
  es (array): ["Ruinas arqueológicas", "Playas vírgenes", "Cenotes", "Yoga"]
  en (array): ["Archaeological ruins", "Pristine beaches", "Cenotes", "Yoga"]
imageUrl: "/assets/destinations/tulum.jpg"
active: true
order: 3
```

#### Document 4: Cabo San Lucas
```
Document ID: cabo

Fields:
id: "cabo"
name (map):
  es: "Cabo San Lucas"
  en: "Cabo San Lucas"
basePrice: 18000
description (map):
  es: "Donde el desierto se encuentra con el mar. Lujo y aventura."
  en: "Where the desert meets the sea. Luxury and adventure."
highlights (map):
  es (array): ["El Arco", "Ballenas", "Golf", "Vida marina"]
  en (array): ["The Arch", "Whales", "Golf", "Marine life"]
imageUrl: "/assets/destinations/cabo.jpg"
active: true
order: 4
```

#### Document 5: Puerto Vallarta
```
Document ID: puertovallarta

Fields:
id: "puertovallarta"
name (map):
  es: "Puerto Vallarta"
  en: "Puerto Vallarta"
basePrice: 14000
description (map):
  es: "Encanto colonial, montañas verdes y playa. Tradición mexicana."
  en: "Colonial charm, green mountains, and beach. Mexican tradition."
highlights (map):
  es (array): ["Malecón", "Zona Romántica", "Islas Marietas", "Gastronomía"]
  en (array): ["Boardwalk", "Romantic Zone", "Marietas Islands", "Cuisine"]
imageUrl: "/assets/destinations/vallarta.jpg"
active: true
order: 5
```

#### Document 6: Ciudad de México
```
Document ID: cdmx

Fields:
id: "cdmx"
name (map):
  es: "Ciudad de México"
  en: "Mexico City"
basePrice: 10000
description (map):
  es: "Historia, cultura, arte y gastronomía de clase mundial."
  en: "History, culture, art, and world-class cuisine."
highlights (map):
  es (array): ["Teotihuacán", "Museos", "Xochimilco", "Centro Histórico"]
  en (array): ["Teotihuacan", "Museums", "Xochimilco", "Historic Center"]
imageUrl: "/assets/destinations/cdmx.jpg"
active: true
order: 6
```

---

## Alternative: Automated Script (Requires Setup)

If you want to use the automated script `seed-firestore.js`:

### Step 1: Set up Application Default Credentials

```bash
# Install gcloud CLI (if not installed)
# MacOS:
brew install google-cloud-sdk

# Then authenticate:
gcloud auth application-default login

# Set project:
gcloud config set project vida-travel-vacation-credit
```

### Step 2: Run the Seed Script

```bash
cd "/Users/syffs/Desktop/VIDA Travel/functions"
NODE_PATH=./node_modules node ../seed-firestore.js
```

---

## Verify

After adding destinations, verify at:
```
https://console.firebase.google.com/project/vida-travel-vacation-credit/firestore/data/~2Fdestinations
```

You should see 6 documents: cancun, playadelcarmen, tulum, cabo, puertovallarta, cdmx

---

## Then Test the Website

1. Visit: https://vida-travel-vacation-credit.web.app
2. Scroll to "Planifica Tu Viaje"
3. You should see 6 destination cards with names and prices
4. Click any destination to select it
5. Prices will vary by A/B test variant:
   - Control: Base prices (as listed above)
   - Pricing High: +15% (e.g., Cancún = $17,250)
   - Pricing Low: -15% (e.g., Cancún = $12,750)
   - Loan 30: Base prices

---

**Estimated Time**: 5-10 minutes via Firebase Console

