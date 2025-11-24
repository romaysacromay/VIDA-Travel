#!/usr/bin/env node

/**
 * Quick script to seed Firestore destinations
 * Run with: node seed-firestore.js
 */

const admin = require('firebase-admin');

// Initialize with application default credentials
admin.initializeApp({
  projectId: 'vida-travel-vacation-credit'
});

const db = admin.firestore();

const destinations = [
  {
    id: 'cancun',
    name: { es: 'Cancún', en: 'Cancun' },
    basePrice: 15000,
    description: {
      es: 'Playas de arena blanca, aguas turquesas y vida nocturna vibrante.',
      en: 'White sand beaches, turquoise waters, and vibrant nightlife.'
    },
    highlights: {
      es: ['Zona Hotelera', 'Isla Mujeres', 'Parques acuáticos', 'Ruinas mayas'],
      en: ['Hotel Zone', 'Isla Mujeres', 'Water parks', 'Mayan ruins']
    },
    imageUrl: '/assets/destinations/cancun.jpg',
    active: true,
    order: 1
  },
  {
    id: 'playadelcarmen',
    name: { es: 'Playa del Carmen', en: 'Playa del Carmen' },
    basePrice: 13000,
    description: {
      es: 'Ambiente cosmopolita, cenotes mágicos y la famosa Quinta Avenida.',
      en: 'Cosmopolitan atmosphere, magical cenotes, and Fifth Avenue.'
    },
    highlights: {
      es: ['Quinta Avenida', 'Cenotes', 'Cozumel', 'Tulum'],
      en: ['Fifth Avenue', 'Cenotes', 'Cozumel', 'Tulum']
    },
    imageUrl: '/assets/destinations/playa.jpg',
    active: true,
    order: 2
  },
  {
    id: 'tulum',
    name: { es: 'Tulum', en: 'Tulum' },
    basePrice: 16000,
    description: {
      es: 'Ruinas mayas frente al mar, playas bohemias y cenotes místicos.',
      en: 'Mayan ruins by the sea, bohemian beaches, and mystical cenotes.'
    },
    highlights: {
      es: ['Ruinas arqueológicas', 'Playas vírgenes', 'Cenotes', 'Yoga'],
      en: ['Archaeological ruins', 'Pristine beaches', 'Cenotes', 'Yoga']
    },
    imageUrl: '/assets/destinations/tulum.jpg',
    active: true,
    order: 3
  },
  {
    id: 'cabo',
    name: { es: 'Cabo San Lucas', en: 'Cabo San Lucas' },
    basePrice: 18000,
    description: {
      es: 'Donde el desierto se encuentra con el mar. Lujo y aventura.',
      en: 'Where the desert meets the sea. Luxury and adventure.'
    },
    highlights: {
      es: ['El Arco', 'Ballenas', 'Golf', 'Vida marina'],
      en: ['The Arch', 'Whales', 'Golf', 'Marine life']
    },
    imageUrl: '/assets/destinations/cabo.jpg',
    active: true,
    order: 4
  },
  {
    id: 'puertovallarta',
    name: { es: 'Puerto Vallarta', en: 'Puerto Vallarta' },
    basePrice: 14000,
    description: {
      es: 'Encanto colonial, montañas verdes y playa. Tradición mexicana.',
      en: 'Colonial charm, green mountains, and beach. Mexican tradition.'
    },
    highlights: {
      es: ['Malecón', 'Zona Romántica', 'Islas Marietas', 'Gastronomía'],
      en: ['Boardwalk', 'Romantic Zone', 'Marietas Islands', 'Cuisine']
    },
    imageUrl: '/assets/destinations/vallarta.jpg',
    active: true,
    order: 5
  },
  {
    id: 'cdmx',
    name: { es: 'Ciudad de México', en: 'Mexico City' },
    basePrice: 10000,
    description: {
      es: 'Historia, cultura, arte y gastronomía de clase mundial.',
      en: 'History, culture, art, and world-class cuisine.'
    },
    highlights: {
      es: ['Teotihuacán', 'Museos', 'Xochimilco', 'Centro Histórico'],
      en: ['Teotihuacan', 'Museums', 'Xochimilco', 'Historic Center']
    },
    imageUrl: '/assets/destinations/cdmx.jpg',
    active: true,
    order: 6
  }
];

async function seedDestinations() {
  console.log('🌴 Seeding destinations to Firestore...\n');

  try {
    const batch = db.batch();

    destinations.forEach(dest => {
      const docRef = db.collection('destinations').doc(dest.id);
      batch.set(docRef, {
        ...dest,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`  ✓ ${dest.name.es} (${dest.id})`);
    });

    await batch.commit();

    console.log(`\n✅ Successfully seeded ${destinations.length} destinations!`);
    console.log('\n📊 Verify at: https://console.firebase.google.com/project/vida-travel-vacation-credit/firestore\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding destinations:', error.message);
    console.error('\n💡 Make sure you\'re authenticated: firebase login\n');
    process.exit(1);
  }
}

seedDestinations();

