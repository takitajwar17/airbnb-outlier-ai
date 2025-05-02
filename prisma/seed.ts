import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

const prisma = new PrismaClient();

// Configuration
const CLOUDINARY_UPLOAD_PRESET = 'klmzvwvp'; // From your ImageUpload component
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dcb4ni5kg/image/upload';
const NUM_USERS = 10;

// Realistic user data
const users = [
  { name: 'Emma Johnson', email: 'emma.johnson@example.com' },
  { name: 'Noah Williams', email: 'noah.williams@example.com' },
  { name: 'Olivia Smith', email: 'olivia.smith@example.com' },
  { name: 'Liam Brown', email: 'liam.brown@example.com' },
  { name: 'Ava Jones', email: 'ava.jones@example.com' },
  { name: 'William Garcia', email: 'william.garcia@example.com' },
  { name: 'Sophia Martinez', email: 'sophia.martinez@example.com' },
  { name: 'James Davis', email: 'james.davis@example.com' },
  { name: 'Isabella Rodriguez', email: 'isabella.rodriguez@example.com' },
  { name: 'Benjamin Wilson', email: 'benjamin.wilson@example.com' },
  { name: 'Mia Anderson', email: 'mia.anderson@example.com' },
  { name: 'Mason Thomas', email: 'mason.thomas@example.com' },
  { name: 'Charlotte Taylor', email: 'charlotte.taylor@example.com' },
  { name: 'Elijah Moore', email: 'elijah.moore@example.com' },
  { name: 'Amelia Jackson', email: 'amelia.jackson@example.com' }
];

// Data for generating random listings
const titles = [
  'Luxury Suite with Ocean View',
  'Cozy Cabin in the Woods',
  'Modern Downtown Apartment',
  'Beachfront Villa',
  'Mountain Retreat',
  'Historic City Center Loft',
  'Countryside Farmhouse',
  'Lakeside Cottage',
  'Penthouse with City Views',
  'Tropical Paradise Bungalow',
  'Desert Oasis',
  'Ski-in/Ski-out Chalet',
  'Urban Artistic Studio',
  'Riverside Cabin',
  'Secluded Island Getaway',
  'Charming Colonial House',
  'Seaside Escape',
  'Rustic Mountain Lodge',
  'Contemporary Urban Loft',
  'Vineyard Cottage',
  'Rainforest Treehouse',
  'Hillside Villa with Infinity Pool',
  'Historic Downtown Apartment',
  'Coastal Retreat',
  'Zen Garden Hideaway'
];

const descriptions = [
  'Experience luxury living with breathtaking views',
  'Perfect getaway for nature lovers',
  'Modern amenities in the heart of the city',
  'Wake up to the sound of waves',
  'Ideal for hiking enthusiasts',
  'Immerse yourself in the local culture',
  'Peaceful retreat in the countryside',
  'Enjoy water activities right at your doorstep',
  'Live the high life with panoramic views',
  'Your personal slice of paradise',
  'Experience the beauty of the desert',
  'Perfect for winter sports enthusiasts',
  'Artistic space for creative minds',
  'Peaceful retreat by the water',
  'Complete privacy and natural beauty',
  'Step back in time with modern comforts',
  'Fall asleep to the sound of crashing waves',
  'Cozy evenings by the fireplace after a day of outdoor adventures',
  'Urban sophistication with all modern conveniences',
  'Enjoy local wines while overlooking the vineyards',
  'Experience nature from a unique perspective',
  'Luxury living with breathtaking panoramic views',
  'Experience the vibrant city life right outside your door',
  'Breathe in the fresh sea air and unwind',
  'Find peace and tranquility in this perfectly balanced space'
];

const categories = [
  'Beach',
  'Windmills',
  'Modern',
  'Countryside',
  'Pools',
  'Islands',
  'Lake',
  'Skiing',
  'Castles',
  'Camping',
  'Arctic',
  'Cave',
  'Desert',
  'Barns',
  'Lux'
];

// Countries from world-countries package
const countries = [
  { value: 'US', label: 'United States', region: 'Americas' },
  { value: 'FR', label: 'France', region: 'Europe' },
  { value: 'JP', label: 'Japan', region: 'Asia' },
  { value: 'AU', label: 'Australia', region: 'Oceania' },
  { value: 'BR', label: 'Brazil', region: 'Americas' },
  { value: 'IT', label: 'Italy', region: 'Europe' },
  { value: 'ZA', label: 'South Africa', region: 'Africa' },
  { value: 'CA', label: 'Canada', region: 'Americas' },
  { value: 'IN', label: 'India', region: 'Asia' },
  { value: 'GB', label: 'United Kingdom', region: 'Europe' },
  { value: 'TH', label: 'Thailand', region: 'Asia' },
  { value: 'ES', label: 'Spain', region: 'Europe' },
  { value: 'MX', label: 'Mexico', region: 'Americas' },
  { value: 'NO', label: 'Norway', region: 'Europe' },
  { value: 'EG', label: 'Egypt', region: 'Africa' },
  { value: 'NZ', label: 'New Zealand', region: 'Oceania' },
  { value: 'AR', label: 'Argentina', region: 'Americas' },
  { value: 'GR', label: 'Greece', region: 'Europe' },
  { value: 'CN', label: 'China', region: 'Asia' },
  { value: 'MA', label: 'Morocco', region: 'Africa' }
];

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random integer in range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Upload image to Cloudinary
async function uploadImageToCloudinary(filePath: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Fallback to a placeholder image
    return '/images/placeholder.jpg';
  }
}

async function main() {
  console.log('Starting seed...');

  // Get listing images
  const listingsDir = path.join(process.cwd(), 'public/listings');
  const imageFiles = fs.readdirSync(listingsDir);
  console.log(`Found ${imageFiles.length} images in the listings directory`);

  // Create users
  const createdUsers = [];
  console.log(`Creating ${Math.min(users.length, NUM_USERS)} users...`);
  
  for (let i = 0; i < Math.min(users.length, NUM_USERS); i++) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await prisma.user.create({
      data: {
        name: users[i].name,
        email: users[i].email,
        hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteIds: [],
      }
    });
    
    createdUsers.push(user);
    console.log(`Created user: ${user.name}`);
  }

  // Create listings with images
  console.log(`Creating ${imageFiles.length} listings...`);
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const imagePath = path.join(listingsDir, imageFile);
    
    // Use local path for development or uncomment the Cloudinary upload for production
    // For now, we'll use the local path format
    // const imageSrc = `/listings/${imageFile}`;
    
    // Uncomment to use Cloudinary upload
    const imageSrc = await uploadImageToCloudinary(imagePath);
    console.log(`Uploaded image to Cloudinary: ${imageSrc}`);
    
    const randomUser = getRandomItem(createdUsers);
    const country = getRandomItem(countries);
    
    const listing = await prisma.listing.create({
      data: {
        title: getRandomItem(titles),
        description: getRandomItem(descriptions),
        imageSrc,
        category: getRandomItem(categories),
        roomCount: getRandomInt(1, 5),
        bathroomCount: getRandomInt(1, 3),
        guestCount: getRandomInt(1, 10),
        locationValue: country.value,
        price: getRandomInt(50, 500),
        userId: randomUser.id,
      }
    });
    
    console.log(`Created listing: ${listing.title} in ${country.label}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 