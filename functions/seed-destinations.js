/**
 * VIDA Travel - Seed Destinations Script
 * Populates Firestore with destination data
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin (use default credentials or service account)
admin.initializeApp();

const db = admin.firestore();

const destinations = [
  {
    id: 'cancun',
    name: {
      es: 'Cancún',
      en: 'Cancun'
    },
    basePrice: 15000,
    description: {
      es: 'Playas de arena blanca, aguas turquesas y vida nocturna vibrante. El paraíso caribeño perfecto.',
      en: 'White sand beaches, turquoise waters, and vibrant nightlife. The perfect Caribbean paradise.'
    },
    highlights: {
      es: ['Zona Hotelera', 'Isla Mujeres', 'Parques acuáticos', 'Ruinas mayas cercanas'],
      en: ['Hotel Zone', 'Isla Mujeres', 'Water parks', 'Nearby Mayan ruins']
    },
    imageUrl: '/assets/destinations/cancun.jpg',
    active: true,
    order: 1
  },
  {
    id: 'playadelcarmen',
    name: {
      es: 'Playa del Carmen',
      en: 'Playa del Carmen'
    },
    basePrice: 13000,
    description: {
      es: 'Ambiente cosmopolita, cenotes mágicos y la famosa Quinta Avenida. Perfecto para familias aventureras.',
      en: 'Cosmopolitan atmosphere, magical cenotes, and the famous Fifth Avenue. Perfect for adventurous families.'
    },
    highlights: {
      es: ['Quinta Avenida', 'Cenotes', 'Cozumel', 'Tulum cercano'],
      en: ['Fifth Avenue', 'Cenotes', 'Cozumel', 'Nearby Tulum']
    },
    imageUrl: '/assets/destinations/playa.jpg',
    active: true,
    order: 2
  },
  {
    id: 'tulum',
    name: {
      es: 'Tulum',
      en: 'Tulum'
    },
    basePrice: 16000,
    description: {
      es: 'Ruinas mayas frente al mar, playas bohemias y cenotes místicos. Espiritualidad y naturaleza.',
      en: 'Mayan ruins by the sea, bohemian beaches, and mystical cenotes. Spirituality and nature.'
    },
    highlights: {
      es: ['Ruinas arqueológicas', 'Playas vírgenes', 'Cenotes sagrados', 'Yoga y wellness'],
      en: ['Archaeological ruins', 'Pristine beaches', 'Sacred cenotes', 'Yoga and wellness']
    },
    imageUrl: '/assets/destinations/tulum.jpg',
    active: true,
    order: 3
  },
  {
    id: 'cabo',
    name: {
      es: 'Cabo San Lucas',
      en: 'Cabo San Lucas'
    },
    basePrice: 18000,
    description: {
      es: 'Donde el desierto se encuentra con el mar. Lujo, aventura y espectaculares puestas de sol.',
      en: 'Where the desert meets the sea. Luxury, adventure, and spectacular sunsets.'
    },
    highlights: {
      es: ['El Arco', 'Avistamiento de ballenas', 'Golf de clase mundial', 'Vida marina'],
      en: ['The Arch', 'Whale watching', 'World-class golf', 'Marine life']
    },
    imageUrl: '/assets/destinations/cabo.jpg',
    active: true,
    order: 4
  },
  {
    id: 'puertovallarta',
    name: {
      es: 'Puerto Vallarta',
      en: 'Puerto Vallarta'
    },
    basePrice: 14000,
    description: {
      es: 'Encanto colonial, montañas verdes y playa. Tradición mexicana auténtica con comodidad moderna.',
      en: 'Colonial charm, green mountains, and beach. Authentic Mexican tradition with modern comfort.'
    },
    highlights: {
      es: ['Malecón', 'Zona Romántica', 'Islas Marietas', 'Gastronomía tradicional'],
      en: ['Boardwalk', 'Romantic Zone', 'Marietas Islands', 'Traditional cuisine']
    },
    imageUrl: '/assets/destinations/vallarta.jpg',
    active: true,
    order: 5
  },
  {
    id: 'cdmx',
    name: {
      es: 'Ciudad de México',
      en: 'Mexico City'
    },
    basePrice: 10000,
    description: {
      es: 'Historia, cultura, arte y gastronomía de clase mundial. La vibrante capital cultural de México.',
      en: 'History, culture, art, and world-class cuisine. Mexico\'s vibrant cultural capital.'
    },
    highlights: {
      es: ['Teotihuacán', 'Museos de clase mundial', 'Xochimilco', 'Centro Histórico'],
      en: ['Teotihuacan', 'World-class museums', 'Xochimilco', 'Historic Center']
    },
    imageUrl: '/assets/destinations/cdmx.jpg',
    active: true,
    order: 6
  }
];

async function seedDestinations() {
  console.log('🌴 Starting destination seeding...');

  try {
    const batch = db.batch();

    destinations.forEach(dest => {
      const docRef = db.collection('destinations').doc(dest.id);
      batch.set(docRef, {
        ...dest,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    await batch.commit();

    console.log(`✅ Successfully seeded ${destinations.length} destinations`);
    console.log('Destinations:', destinations.map(d => d.name.es).join(', '));

    // Verify
    const snapshot = await db.collection('destinations').get();
    console.log(`📊 Total destinations in database: ${snapshot.size}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
    process.exit(1);
  }
}

// Run the script
seedDestinations();
