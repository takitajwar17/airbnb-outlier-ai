import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Configuration
const CLOUDINARY_UPLOAD_PRESET = 'klmzvwvp'; // From your ImageUpload component
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dcb4ni5kg/image/upload';
const NUM_USERS = 20; // Increased number of users

/*
 * Multi-step plan for global location expansion:
 * 1. Create a comprehensive countries object with all world countries
 * 2. Add major cities for each country (at least 10-20 per country)
 * 3. Group countries by continents/regions for better organization
 * 4. Add location-specific features (landmarks, attractions, etc.)
 * 5. Implement regional price variations to reflect real-world costs
 */

// First names and last names for random generation
const firstNames = [
  'Emma', 'Noah', 'Olivia', 'Liam', 'Ava', 'William', 'Sophia', 'James',
  'Isabella', 'Benjamin', 'Mia', 'Mason', 'Charlotte', 'Elijah', 'Amelia',
  'Oliver', 'Harper', 'Daniel', 'Evelyn', 'Alexander', 'Abigail', 'Michael',
  'Emily', 'Ethan', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Lucas',
  'Ella', 'Jackson', 'Scarlett', 'Aiden', 'Grace', 'Jack', 'Chloe', 'Owen',
  'Victoria', 'Gabriel', 'Riley', 'Matthew', 'Aria', 'Connor', 'Lily'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez',
  'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
  'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell'
];

const emailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'mail.com', 'protonmail.com', 'example.com', 'aol.com', 'zoho.com',
  'fastmail.com', 'yandex.com', 'gmx.com', 'tutanota.com', 'mail.ru'
];

// Expanded data for generating random listings
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
  'Zen Garden Hideaway',
  'Elegant Mansion with Private Garden',
  'Minimalist Architect-Designed House',
  'Nordic-Inspired Cabin with Sauna',
  'Converted Lighthouse with Ocean Views',
  'Traditional Houseboat on Canal',
  'Glass House in the Forest',
  'Bamboo Eco-Cottage',
  'Renovated Barn with Modern Amenities',
  'Luxury Yurt with Hot Tub',
  'Cliffside Villa with Panoramic Views',
  'Artist\'s Loft in Cultural District',
  'Underground Cave Home',
  'Converted Factory Loft',
  'Safari Tent in Nature Reserve',
  'Tiny House in Sustainable Community'
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
  'Find peace and tranquility in this perfectly balanced space',
  'Spacious and elegant with a touch of old-world charm',
  'Minimalist design meets comfort in this unique space',
  'Authentic traditional experience with modern amenities',
  'Stunning 360-degree views from this unique property',
  'Live like a local in this charming neighborhood',
  'Eco-friendly luxury in harmony with nature',
  'Secluded retreat perfect for digital detox',
  'Quirky and unique space filled with character',
  'Perfectly curated interior with designer furnishings',
  'Historically significant property with fascinating stories',
  'Boutique experience with personalized touches',
  'Romantic getaway ideal for couples',
  'Family-friendly space with entertainment for all ages',
  'Adventure awaits just outside your doorstep',
  'Fusion of traditional style and contemporary design'
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
  'Lux',
  'Tropical',
  'Vineyard',
  'Historical',
  'Surfing',
  'Mountain',
  'Urban',
  'Forest',
  'Seaside',
  'Lakefront',
  'Riverside',
  'Chalets',
  'Boats',
  'Gardens',
  'Golf',
  'Eco-friendly'
];

// Countries from world-countries package - expanded with more countries by continent
const countries = [
  // Africa
  { value: 'ZA', label: 'South Africa', region: 'Africa' },
  { value: 'EG', label: 'Egypt', region: 'Africa' },
  { value: 'MA', label: 'Morocco', region: 'Africa' },
  { value: 'NG', label: 'Nigeria', region: 'Africa' },
  { value: 'CD', label: 'Democratic Republic of Congo', region: 'Africa' },
  { value: 'AO', label: 'Angola', region: 'Africa' },
  { value: 'TZ', label: 'Tanzania', region: 'Africa' },
  { value: 'SD', label: 'Sudan', region: 'Africa' },
  { value: 'CI', label: 'Ivory Coast', region: 'Africa' },
  { value: 'ET', label: 'Ethiopia', region: 'Africa' },
  { value: 'KE', label: 'Kenya', region: 'Africa' },
  { value: 'GH', label: 'Ghana', region: 'Africa' },
  { value: 'DZ', label: 'Algeria', region: 'Africa' },
  { value: 'TN', label: 'Tunisia', region: 'Africa' },
  { value: 'LY', label: 'Libya', region: 'Africa' },
  { value: 'CM', label: 'Cameroon', region: 'Africa' },
  { value: 'UG', label: 'Uganda', region: 'Africa' },
  { value: 'SN', label: 'Senegal', region: 'Africa' },
  { value: 'ZM', label: 'Zambia', region: 'Africa' },
  { value: 'ZW', label: 'Zimbabwe', region: 'Africa' },
  { value: 'RW', label: 'Rwanda', region: 'Africa' },
  { value: 'NA', label: 'Namibia', region: 'Africa' },
  { value: 'BW', label: 'Botswana', region: 'Africa' },
  { value: 'ML', label: 'Mali', region: 'Africa' },
  { value: 'MG', label: 'Madagascar', region: 'Africa' },

  // Americas
  { value: 'US', label: 'United States', region: 'Americas' },
  { value: 'CA', label: 'Canada', region: 'Americas' },
  { value: 'BR', label: 'Brazil', region: 'Americas' },
  { value: 'MX', label: 'Mexico', region: 'Americas' },
  { value: 'AR', label: 'Argentina', region: 'Americas' },
  { value: 'PE', label: 'Peru', region: 'Americas' },
  { value: 'CO', label: 'Colombia', region: 'Americas' },
  { value: 'CL', label: 'Chile', region: 'Americas' },
  { value: 'CR', label: 'Costa Rica', region: 'Americas' },
  { value: 'CU', label: 'Cuba', region: 'Americas' },
  { value: 'DO', label: 'Dominican Republic', region: 'Americas' },
  { value: 'EC', label: 'Ecuador', region: 'Americas' },
  { value: 'GT', label: 'Guatemala', region: 'Americas' },
  { value: 'HT', label: 'Haiti', region: 'Americas' },
  { value: 'PA', label: 'Panama', region: 'Americas' },
  { value: 'UY', label: 'Uruguay', region: 'Americas' },
  { value: 'JM', label: 'Jamaica', region: 'Americas' },
  { value: 'PR', label: 'Puerto Rico', region: 'Americas' },
  { value: 'BS', label: 'Bahamas', region: 'Americas' },
  { value: 'BZ', label: 'Belize', region: 'Americas' },
  { value: 'NI', label: 'Nicaragua', region: 'Americas' },
  { value: 'VE', label: 'Venezuela', region: 'Americas' },
  { value: 'HN', label: 'Honduras', region: 'Americas' },
  { value: 'SV', label: 'El Salvador', region: 'Americas' },
  { value: 'BO', label: 'Bolivia', region: 'Americas' },

  // Asia
  { value: 'JP', label: 'Japan', region: 'Asia' },
  { value: 'CN', label: 'China', region: 'Asia' },
  { value: 'IN', label: 'India', region: 'Asia' },
  { value: 'TH', label: 'Thailand', region: 'Asia' },
  { value: 'SG', label: 'Singapore', region: 'Asia' },
  { value: 'KR', label: 'South Korea', region: 'Asia' },
  { value: 'ID', label: 'Indonesia', region: 'Asia' },
  { value: 'MY', label: 'Malaysia', region: 'Asia' },
  { value: 'VN', label: 'Vietnam', region: 'Asia' },
  { value: 'AE', label: 'United Arab Emirates', region: 'Asia' },
  { value: 'IL', label: 'Israel', region: 'Asia' },
  { value: 'PH', label: 'Philippines', region: 'Asia' },
  { value: 'SA', label: 'Saudi Arabia', region: 'Asia' },
  { value: 'TR', label: 'Turkey', region: 'Asia' },
  { value: 'KH', label: 'Cambodia', region: 'Asia' },
  { value: 'LB', label: 'Lebanon', region: 'Asia' },
  { value: 'IR', label: 'Iran', region: 'Asia' },
  { value: 'IQ', label: 'Iraq', region: 'Asia' },
  { value: 'JO', label: 'Jordan', region: 'Asia' },
  { value: 'LK', label: 'Sri Lanka', region: 'Asia' },
  { value: 'NP', label: 'Nepal', region: 'Asia' },
  { value: 'BT', label: 'Bhutan', region: 'Asia' },
  { value: 'PK', label: 'Pakistan', region: 'Asia' },
  { value: 'QA', label: 'Qatar', region: 'Asia' },
  { value: 'KW', label: 'Kuwait', region: 'Asia' },

  // Europe
  { value: 'GB', label: 'United Kingdom', region: 'Europe' },
  { value: 'FR', label: 'France', region: 'Europe' },
  { value: 'IT', label: 'Italy', region: 'Europe' },
  { value: 'ES', label: 'Spain', region: 'Europe' },
  { value: 'DE', label: 'Germany', region: 'Europe' },
  { value: 'PT', label: 'Portugal', region: 'Europe' },
  { value: 'GR', label: 'Greece', region: 'Europe' },
  { value: 'CH', label: 'Switzerland', region: 'Europe' },
  { value: 'NL', label: 'Netherlands', region: 'Europe' },
  { value: 'SE', label: 'Sweden', region: 'Europe' },
  { value: 'NO', label: 'Norway', region: 'Europe' },
  { value: 'FI', label: 'Finland', region: 'Europe' },
  { value: 'DK', label: 'Denmark', region: 'Europe' },
  { value: 'IE', label: 'Ireland', region: 'Europe' },
  { value: 'AT', label: 'Austria', region: 'Europe' },
  { value: 'BE', label: 'Belgium', region: 'Europe' },
  { value: 'IS', label: 'Iceland', region: 'Europe' },
  { value: 'PL', label: 'Poland', region: 'Europe' },
  { value: 'CZ', label: 'Czech Republic', region: 'Europe' },
  { value: 'HU', label: 'Hungary', region: 'Europe' },
  { value: 'RO', label: 'Romania', region: 'Europe' },
  { value: 'HR', label: 'Croatia', region: 'Europe' },
  { value: 'BG', label: 'Bulgaria', region: 'Europe' },
  { value: 'UA', label: 'Ukraine', region: 'Europe' },
  { value: 'RU', label: 'Russia', region: 'Europe' },
  { value: 'MT', label: 'Malta', region: 'Europe' },
  { value: 'CY', label: 'Cyprus', region: 'Europe' },
  { value: 'LV', label: 'Latvia', region: 'Europe' },
  { value: 'EE', label: 'Estonia', region: 'Europe' },
  { value: 'LT', label: 'Lithuania', region: 'Europe' },
  { value: 'SK', label: 'Slovakia', region: 'Europe' },
  { value: 'SI', label: 'Slovenia', region: 'Europe' },
  { value: 'MC', label: 'Monaco', region: 'Europe' },
  { value: 'LU', label: 'Luxembourg', region: 'Europe' },
  { value: 'AD', label: 'Andorra', region: 'Europe' },

  // Oceania
  { value: 'AU', label: 'Australia', region: 'Oceania' },
  { value: 'NZ', label: 'New Zealand', region: 'Oceania' },
  { value: 'FJ', label: 'Fiji', region: 'Oceania' },
  { value: 'PG', label: 'Papua New Guinea', region: 'Oceania' },
  { value: 'SB', label: 'Solomon Islands', region: 'Oceania' },
  { value: 'VU', label: 'Vanuatu', region: 'Oceania' },
  { value: 'WS', label: 'Samoa', region: 'Oceania' },
  { value: 'TO', label: 'Tonga', region: 'Oceania' },
  { value: 'KI', label: 'Kiribati', region: 'Oceania' },
  { value: 'PF', label: 'French Polynesia', region: 'Oceania' }
];

// Expanded cities for each country
const citiesByCountry: { [key: string]: string[] } = {
  // Africa
  'ZA': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley', 'Polokwane', 'Pietermaritzburg', 'Rustenburg', 'Soweto', 'Potchefstroom', 'George'],
  'EG': ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Mansoura', 'Tanta', 'Asyut', 'Ismailia', 'Faiyum'],
  'MA': ['Casablanca', 'Rabat', 'Fes', 'Marrakesh', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'El Jadida', 'Beni Mellal', 'Chefchaouen'],
  'NG': ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Kaduna', 'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Sokoto'],
  'CD': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kisangani', 'Kananga', 'Bukavu', 'Goma', 'Kolwezi', 'Likasi', 'Tshikapa', 'Matadi', 'Mbandaka', 'Bunia', 'Uvira', 'Boma'],
  'AO': ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Kuito', 'Lubango', 'Malanje', 'Namibe', 'Soyo', 'Cabinda', 'Uíge', 'Lucapa', 'Dundo', 'Saurimo', 'Sumbe'],
  'TZ': ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Kigoma', 'Zanzibar City', 'Musoma', 'Tabora', 'Sumbawanga', 'Iringa', 'Shinyanga', 'Songea'],
  'KE': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Nyeri', 'Kakamega', 'Garissa', 'Lamu', 'Malindi', 'Thika', 'Kitale', 'Machakos', 'Naivasha', 'Voi'],
  'ET': ['Addis Ababa', 'Dire Dawa', 'Gondar', 'Bahir Dar', 'Mekelle', 'Adama', 'Hawassa', 'Jimma', 'Harar', 'Dessie', 'Bishoftu', 'Arba Minch', 'Axum', 'Lalibela', 'Jijiga'],
  'CI': ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'Korhogo', 'San-Pédro', 'Divo', 'Man', 'Gagnoa', 'Abengourou', 'Anyama', 'Agboville', 'Dimbokro', 'Bingerville', 'Odienné'],
  
  // Americas
  'US': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Seattle', 'Boston', 'Austin', 'Denver', 'Portland', 'Nashville', 'San Diego', 'Philadelphia', 'New Orleans', 'Atlanta', 'Dallas', 'Houston', 'Phoenix', 'Las Vegas', 'Detroit', 'Minneapolis', 'Orlando', 'Baltimore', 'San Antonio', 'Tampa', 'Cincinnati', 'Cleveland', 'St. Louis', 'Charlotte', 'Indianapolis'],
  'CA': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec City', 'Halifax', 'Victoria', 'Winnipeg', 'Edmonton', 'St. John\'s', 'Regina', 'Kingston', 'Saskatoon', 'London', 'Hamilton', 'Windsor', 'Mississauga', 'Niagara Falls', 'Whistler'],
  'BR': ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Campinas', 'São Luís', 'Maceió', 'Natal', 'João Pessoa', 'Campo Grande', 'Florianópolis', 'Vitória'],
  'MX': ['Mexico City', 'Cancún', 'Guadalajara', 'Monterrey', 'Playa del Carmen', 'Tulum', 'Oaxaca', 'Puerto Vallarta', 'Merida', 'San Miguel de Allende', 'Tijuana', 'Acapulco', 'León', 'Puebla', 'Querétaro', 'San Cristóbal de las Casas', 'Cozumel', 'Los Cabos', 'Manzanillo', 'Mazatlán'],
  'AR': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Bariloche', 'Salta', 'Ushuaia', 'Mar del Plata', 'El Calafate', 'Puerto Iguazú', 'Tucumán', 'La Plata', 'Neuquén', 'Tigre', 'Pinamar', 'San Salvador de Jujuy', 'Corrientes', 'Posadas', 'Paraná', 'San Luis'],
  'CO': ['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Barranquilla', 'Santa Marta', 'Pereira', 'Bucaramanga', 'Manizales', 'Armenia', 'Popayán', 'Ibagué', 'Pasto', 'Cúcuta', 'Riohacha', 'Valledupar', 'Quibdó', 'Villavicencio', 'Neiva', 'Montería'],
  'CL': ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Puerto Montt', 'Pucón', 'La Serena', 'Arica', 'Iquique', 'Valdivia', 'Temuco', 'Antofagasta', 'Punta Arenas', 'Osorno', 'Puerto Varas', 'Chillán', 'Calama', 'Rancagua', 'Coyhaique', 'Talca'],
  'PE': ['Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Iquitos', 'Puno', 'Huaraz', 'Chiclayo', 'Máncora', 'Nazca', 'Cajamarca', 'Ayacucho', 'Piura', 'Tacna', 'Ica', 'Huancayo', 'Pucallpa', 'Tarapoto', 'Paracas', 'Tumbes'],
  'CR': ['San José', 'Tamarindo', 'Manuel Antonio', 'La Fortuna', 'Monteverde', 'Jacó', 'Puerto Viejo', 'Santa Teresa', 'Nosara', 'Tortuguero', 'Liberia', 'Dominical', 'Sámara', 'Montezuma', 'Uvita', 'Cahuita', 'Puerto Jiménez', 'Mal País', 'Alajuela', 'Heredia'],
  
  // Asia
  'JP': ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Sapporo', 'Nagoya', 'Fukuoka', 'Nara', 'Kobe', 'Okinawa', 'Yokohama', 'Kanazawa', 'Takayama', 'Hakone', 'Nikko', 'Kamakura', 'Sendai', 'Nagasaki', 'Matsumoto', 'Ise'],
  'CN': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Xi\'an', 'Chengdu', 'Hangzhou', 'Suzhou', 'Guilin', 'Lijiang', 'Nanjing', 'Chongqing', 'Xiamen', 'Tianjin', 'Lhasa', 'Kunming', 'Qingdao', 'Harbin', 'Sanya', 'Wuhan'],
  'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Jaipur', 'Agra', 'Goa', 'Hyderabad', 'Varanasi', 'Amritsar', 'Udaipur', 'Kochi', 'Darjeeling', 'Rishikesh', 'Jodhpur', 'Mysore', 'Leh', 'Lucknow', 'Ahmedabad'],
  'TH': ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi', 'Koh Samui', 'Hua Hin', 'Ayutthaya', 'Koh Phangan', 'Koh Phi Phi', 'Koh Tao', 'Koh Lanta', 'Sukhothai', 'Railay Beach', 'Khao Lak', 'Koh Chang', 'Pai', 'Khao Yai', 'Kanchanaburi', 'Udon Thani'],
  'VN': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang', 'Ha Long', 'Hue', 'Sapa', 'Phu Quoc', 'Dalat', 'Mui Ne', 'Can Tho', 'Ninh Binh', 'Quy Nhon', 'Hai Phong', 'Con Dao', 'Phan Thiet', 'Vung Tau', 'Buon Ma Thuot', 'Kon Tum'],
  'ID': ['Jakarta', 'Bali', 'Yogyakarta', 'Bandung', 'Surabaya', 'Lombok', 'Medan', 'Makassar', 'Ubud', 'Malang', 'Semarang', 'Manado', 'Labuan Bajo', 'Komodo', 'Raja Ampat', 'Bogor', 'Palembang', 'Solo', 'Batam', 'Padang'],
  'SG': ['Downtown Core', 'Marina Bay', 'Orchard', 'Sentosa', 'Jurong East', 'Changi', 'Punggol', 'Katong', 'Bukit Timah', 'Woodlands', 'Toa Payoh', 'Tampines', 'Yishun', 'Bugis', 'Chinatown', 'Little India', 'Raffles Place', 'Bedok', 'Clementi', 'Serangoon'],
  'AE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain', 'Khor Fakkan', 'Dibba Al-Hisn', 'Kalba', 'Jebel Ali', 'Madinat Zayed', 'Ruwais', 'Liwa Oasis', 'Hatta', 'Dibba Al-Fujairah', 'Ghayathi', 'Dalma Island', 'Sir Bani Yas Island'],
  'LB': ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Byblos', 'Baalbek', 'Zahle', 'Batroun', 'Anjar', 'Nabatieh', 'Deir el Qamar', 'Ehden', 'Bcharre', 'Faraya', 'Harissa', 'Chtoura', 'Aley', 'Broummana', 'Mzaar Kfardebian'],
  'TR': ['Istanbul', 'Antalya', 'Cappadocia', 'Izmir', 'Bodrum', 'Ankara', 'Fethiye', 'Marmaris', 'Ölüdeniz', 'Pamukkale', 'Kusadasi', 'Bursa', 'Konya', 'Trabzon', 'Alanya', 'Gaziantep', 'Kas', 'Selçuk', 'Dalyan', 'Göreme'],
  
  // Europe
  'GB': ['London', 'Edinburgh', 'Manchester', 'Liverpool', 'Glasgow', 'Bath', 'Oxford', 'Cambridge', 'Bristol', 'York', 'Birmingham', 'Brighton', 'Cardiff', 'Belfast', 'Newcastle', 'Leeds', 'Inverness', 'Stratford-upon-Avon', 'Durham', 'Exeter', 'Canterbury', 'Nottingham', 'Plymouth', 'Norwich', 'Aberdeen'],
  'FR': ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Strasbourg', 'Cannes', 'Lille', 'Montpellier', 'Annecy', 'Avignon', 'Chamonix', 'Saint-Tropez', 'Aix-en-Provence', 'Antibes', 'Colmar', 'Dijon', 'La Rochelle', 'Mont Saint-Michel', 'Nantes', 'Orleans', 'Reims', 'Tours', 'Versailles'],
  'IT': ['Rome', 'Florence', 'Venice', 'Milan', 'Naples', 'Turin', 'Bologna', 'Palermo', 'Verona', 'Siena', 'Pisa', 'Genoa', 'Bari', 'Sorrento', 'Cinque Terre', 'Amalfi', 'Positano', 'Capri', 'Lake Como', 'Lake Garda', 'Catania', 'Lucca', 'Perugia', 'San Gimignano', 'Syracuse'],
  'ES': ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Malaga', 'Granada', 'Bilbao', 'San Sebastian', 'Ibiza', 'Toledo', 'Cordoba', 'Mallorca', 'Tenerife', 'Alicante', 'Salamanca', 'Marbella', 'Girona', 'Cadiz', 'Tarragona', 'Santiago de Compostela', 'Zaragoza', 'Pamplona', 'Segovia', 'Ronda', 'Oviedo'],
  'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Dresden', 'Heidelberg', 'Nuremberg', 'Stuttgart', 'Leipzig', 'Dusseldorf', 'Bremen', 'Bonn', 'Hannover', 'Freiburg', 'Rothenburg ob der Tauber', 'Bamberg', 'Regensburg', 'Würzburg', 'Potsdam', 'Baden-Baden', 'Augsburg', 'Koblenz', 'Trier', 'Mainz'],
  'PT': ['Lisbon', 'Porto', 'Faro', 'Madeira', 'Coimbra', 'Braga', 'Sintra', 'Lagos', 'Aveiro', 'Évora', 'Cascais', 'Albufeira', 'Nazaré', 'Óbidos', 'Guimarães', 'Tavira', 'Sesimbra', 'Viana do Castelo', 'Setúbal', 'Tomar'],
  'GR': ['Athens', 'Santorini', 'Mykonos', 'Thessaloniki', 'Crete', 'Rhodes', 'Corfu', 'Nafplio', 'Delphi', 'Zakynthos', 'Paros', 'Naxos', 'Hydra', 'Milos', 'Meteora', 'Ios', 'Skiathos', 'Symi', 'Kefalonia', 'Olympia'],
  'CH': ['Zurich', 'Geneva', 'Lucerne', 'Bern', 'Lausanne', 'Interlaken', 'Zermatt', 'Basel', 'Lugano', 'St. Moritz', 'Montreux', 'Davos', 'Locarno', 'Grindelwald', 'Lauterbrunnen', 'Thun', 'Fribourg', 'Sion', 'Ascona', 'Bellinzona'],
  'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Maastricht', 'Delft', 'Haarlem', 'Groningen', 'Leiden', 'Giethoorn', 'Eindhoven', 'Gouda', 'Tilburg', 'Arnhem', 'Nijmegen', 'Breda', 'Den Bosch', 'Alkmaar', 'Middelburg', 'Zaanse Schans'],
  'IS': ['Reykjavik', 'Akureyri', 'Vik', 'Húsavík', 'Selfoss', 'Keflavik', 'Egilsstaðir', 'Borgarnes', 'Höfn', 'Isafjordur', 'Stykkishólmur', 'Vopnafjördur', 'Hvolsvöllur', 'Blönduós', 'Seyðisfjörður', 'Kirkjubæjarklaustur', 'Borgarfjörður Eystri', 'Djúpivogur', 'Grindavík', 'Reyðarfjörður'],
  
  // Oceania
  'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Cairns', 'Hobart', 'Darwin', 'Canberra', 'Byron Bay', 'Alice Springs', 'Noosa', 'Broome', 'Port Douglas', 'Airlie Beach', 'Margaret River', 'Launceston', 'Fremantle', 'Wollongong'],
  'NZ': ['Auckland', 'Wellington', 'Christchurch', 'Queenstown', 'Rotorua', 'Napier', 'Dunedin', 'Taupo', 'Nelson', 'Hamilton', 'Picton', 'Wanaka', 'Paihia', 'Kaikoura', 'Te Anau', 'Franz Josef', 'Hokitika', 'New Plymouth', 'Gisborne', 'Invercargill'],
  'FJ': ['Suva', 'Nadi', 'Lautoka', 'Sigatoka', 'Savusavu', 'Labasa', 'Levuka', 'Rakiraki', 'Tavua', 'Ba', 'Navua', 'Korovou', 'Vunisea', 'Deuba', 'Vatukoula'],
  'PG': ['Port Moresby', 'Lae', 'Mount Hagen', 'Madang', 'Goroka', 'Wewak', 'Kokopo', 'Kimbe', 'Alotau', 'Popondetta', 'Mendi', 'Vanimo', 'Kavieng', 'Bulolo', 'Arawa'],
  
  // Additional country cities to complete the full list (copy as needed)
  'FI': ['Helsinki', 'Tampere', 'Turku', 'Rovaniemi', 'Oulu', 'Porvoo', 'Vaasa', 'Savonlinna', 'Kuopio', 'Jyväskylä', 'Espoo', 'Vantaa', 'Lahti', 'Lappeenranta', 'Mariehamn'],
  'SE': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Lund', 'Helsingborg', 'Linköping', 'Umeå', 'Karlstad', 'Visby', 'Örebro', 'Jönköping', 'Västerås', 'Norrköping', 'Kiruna'],
  'NO': ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Tromsø', 'Ålesund', 'Kristiansand', 'Bodø', 'Lillehammer', 'Fredrikstad', 'Drammen', 'Røros', 'Flåm', 'Narvik', 'Hamar'],
  'TO': ['Nukuʻalofa', 'Neiafu', 'Pangai', 'ʻOhonua', 'Hihifo', 'Kolonga', 'Vaini', 'Haʻapai', 'Haʻafeva', 'Niuatoputapu'],
  'KI': ['Tarawa', 'Betio', 'Bikenibeu', 'Bairiki', 'Teaoraereke', 'Eita', 'Bonriki', 'Ambo', 'Tabwakea', 'London'],
  'WS': ['Apia', 'Vaitele', 'Faleula', 'Siumu', 'Safotulafai', 'Salelologa', 'Leulumoega', 'Saleimoa', 'Fasito\'o Uta', 'Falealili'],
  'SB': ['Honiara', 'Auki', 'Gizo', 'Kirakira', 'Buala', 'Taro Island', 'Tigoa', 'Tulagi', 'Lata', 'Taro'],
  'VU': ['Port Vila', 'Luganville', 'Norsup', 'Isangel', 'Lakatoro', 'Sola', 'Longana', 'Lenakel', 'Lamap', 'Santo'],
  'PF': ['Papeete', 'Faaa', 'Punaauia', 'Pirae', 'Mahina', 'Moorea', 'Bora Bora', 'Huahine', 'Rangiroa', 'Tikehau'],
  'SD': ['Khartoum', 'Omdurman', 'Nyala', 'Port Sudan', 'Kassala', 'El Obeid', 'Wad Madani', 'Al-Fashir', 'Kosti', 'Atbara'],
  'ML': ['Bamako', 'Sikasso', 'Mopti', 'Gao', 'Kayes', 'Timbuktu', 'Koutiala', 'Ségou', 'Kidal', 'Koulikoro'],
  'MG': ['Antananarivo', 'Toamasina', 'Antsirabe', 'Fianarantsoa', 'Mahajanga', 'Toliara', 'Antsiranana', 'Ambovombe', 'Antalaha', 'Morondava'],
  'DZ': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra'],
  'TN': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Aryanah', 'Gafsa', 'El Kef', 'Monastir'],
  'LY': ['Tripoli', 'Benghazi', 'Misrata', 'Tarhuna', 'Al Khums', 'Zawiya', 'Sirte', 'Tobruk', 'Sabha', 'Zliten'],
  'CM': ['Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Maroua', 'Bafoussam', 'Ngaoundéré', 'Bertoua', 'Loum', 'Kumba'],
  'UG': ['Kampala', 'Nansana', 'Kira', 'Mbarara', 'Mukono', 'Gulu', 'Masaka', 'Kasese', 'Hoima', 'Lira'],
  'SN': ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Mbour', 'Rufisque', 'Ziguinchor', 'Tivaouane', 'Louga', 'Diourbel'],
  'ZM': ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone', 'Luanshya', 'Kasama', 'Chipata'],
  'ZW': ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Epworth', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi'],
  'RW': ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Byumba', 'Cyangugu', 'Kibuye', 'Kibungo', 'Nyanza'],
  'BW': ['Gaborone', 'Francistown', 'Molepolole', 'Serowe', 'Selibe Phikwe', 'Maun', 'Kanye', 'Mahalapye', 'Mogoditshane', 'Lobatse'],
  'NA': ['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati', 'Rundu', 'Grootfontein', 'Katima Mulilo', 'Otjiwarongo', 'Rehoboth', 'Tsumeb'],
  'GH': ['Accra', 'Kumasi', 'Tamale', 'Sekondi-Takoradi', 'Ashaiman', 'Sunyani', 'Cape Coast', 'Obuasi', 'Teshie', 'Tema'],
  
  // Add for Americas region countries
  'CU': ['Havana', 'Santiago de Cuba', 'Camagüey', 'Holguín', 'Guantánamo', 'Santa Clara', 'Bayamo', 'Cienfuegos', 'Pinar del Río', 'Matanzas'],
  'DO': ['Santo Domingo', 'Santiago de los Caballeros', 'Santo Domingo Este', 'Santo Domingo Norte', 'Santo Domingo Oeste', 'San Pedro de Macorís', 'La Romana', 'San Cristóbal', 'Puerto Plata', 'San Francisco de Macorís'],
  'EC': ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Loja', 'Ambato'],
  'GT': ['Guatemala City', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'Chinautla', 'Petapa', 'San Juan Sacatepéquez', 'Villa Canales', 'Amatitlán'],
  'HT': ['Port-au-Prince', 'Carrefour', 'Delmas', 'Pétion-Ville', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Saint-Marc', 'Jacmel', 'Léogâne'],
  'PA': ['Panama City', 'San Miguelito', 'Tocumen', 'David', 'Arraiján', 'Colón', 'La Chorrera', 'Santiago', 'Chitré', 'Penonomé'],
  'UY': ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Las Piedras', 'Rivera', 'Maldonado', 'Tacuarembó', 'Melo', 'Mercedes'],
  'JM': ['Kingston', 'Portmore', 'Spanish Town', 'Montego Bay', 'May Pen', 'Mandeville', 'Old Harbour', 'Savanna-la-Mar', 'Port Antonio', 'Ocho Rios'],
  'PR': ['San Juan', 'Bayamón', 'Carolina', 'Ponce', 'Caguas', 'Guaynabo', 'Mayagüez', 'Trujillo Alto', 'Arecibo', 'Fajardo'],
  'BS': ['Nassau', 'Freeport', 'West End', 'Coopers Town', 'Marsh Harbour', 'High Rock', 'Freetown', 'Andros Town', 'San Andros', 'George Town'],
  'BZ': ['Belize City', 'San Ignacio', 'Orange Walk Town', 'Belmopan', 'Dangriga', 'Corozal Town', 'Punta Gorda', 'San Pedro', 'Benque Viejo del Carmen', 'Placencia'],
  'NI': ['Managua', 'León', 'Masaya', 'Matagalpa', 'Chinandega', 'Granada', 'Estelí', 'Tipitapa', 'Jinotega', 'Ciudad Sandino'],
  'VE': ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Ciudad Guayana', 'Maracay', 'Barcelona', 'Maturín', 'Petare', 'Porlamar'],
  'HN': ['Tegucigalpa', 'San Pedro Sula', 'Choloma', 'La Ceiba', 'El Progreso', 'Choluteca', 'Comayagua', 'Puerto Cortés', 'Siguatepeque', 'Danlí'],
  'SV': ['San Salvador', 'Santa Ana', 'Soyapango', 'San Miguel', 'Mejicanos', 'Santa Tecla', 'Apopa', 'Delgado', 'Ilopango', 'Colón'],
  'BO': ['Santa Cruz de la Sierra', 'El Alto', 'La Paz', 'Cochabamba', 'Oruro', 'Sucre', 'Tarija', 'Potosí', 'Sacaba', 'Montero'],
  
  // Add for remaining Asia region countries
  'IL': ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Netanya', 'Beer Sheva', 'Holon', 'Bnei Brak'],
  'SA': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Buraidah', 'Khobar', 'Abha'],
  'KH': ['Phnom Penh', 'Battambang', 'Siem Reap', 'Sihanoukville', 'Kampong Cham', 'Kompong Thom', 'Takéo', 'Svay Rieng', 'Pursat', 'Prey Veng'],
  'IR': ['Tehran', 'Mashhad', 'Isfahan', 'Karaj', 'Shiraz', 'Tabriz', 'Qom', 'Ahvaz', 'Kermanshah', 'Urmia'],
  'IQ': ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Kirkuk', 'Sulaymaniyah', 'Karbala', 'Nasiriyah', 'Amarah'],
  'JO': ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Aqaba', 'Madaba', 'Salt', 'Jerash', 'Karak', 'Mafraq'],
  'LK': ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Jaffna', 'Negombo', 'Pita Kotte', 'Sri Jayawardenepura Kotte', 'Kandy', 'Trincomalee', 'Galle'],
  'NP': ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Birgunj', 'Dharan', 'Bharatpur', 'Janakpur', 'Hetauda'],
  'BT': ['Thimphu', 'Phuntsholing', 'Paro', 'Punakha', 'Gelephu', 'Samdrup Jongkhar', 'Trashigang', 'Mongar', 'Wangdue Phodrang', 'Bumthang'],
  'PK': ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Peshawar', 'Islamabad', 'Quetta', 'Sialkot'],
  'QA': ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Umm Salal Muhammad', 'Mesaieed', 'Dukhan', 'Al Shamal', 'Abu Samra', 'Madinat ash Shamal'],
  'KW': ['Kuwait City', 'Al Ahmadi', 'Hawalli', 'Al Farwaniyah', 'Al Jahra', 'Salwa', 'Sabah Al-Salem', 'Al Mangaf', 'Al Fahaheel', 'Ar Rumaithiyah'],
  'MY': ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Ipoh', 'Kuching', 'Kota Kinabalu', 'Shah Alam', 'Malacca City', 'Petaling Jaya', 'Kota Bharu'],
  'PH': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig', 'Antipolo', 'Pasig', 'Cagayan de Oro'],
  
  // Add for Europe region countries that might be missing
  'DK': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  'IE': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan'],
  'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn'],
  'BE': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst'],
  'PL': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
  'CZ': ['Prague', 'Brno', 'Ostrava', 'Plzeň', 'Liberec', 'Olomouc', 'České Budějovice', 'Hradec Králové', 'Ústí nad Labem', 'Pardubice'],
  'HU': ['Budapest', 'Debrecen', 'Szeged', 'Miskolc', 'Pécs', 'Győr', 'Nyíregyháza', 'Kecskemét', 'Székesfehérvár', 'Szombathely'],
  'RO': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța', 'Craiova', 'Brașov', 'Galați', 'Ploiești', 'Oradea'],
  'HR': ['Zagreb', 'Split', 'Rijeka', 'Osijek', 'Zadar', 'Pula', 'Slavonski Brod', 'Karlovac', 'Varaždin', 'Dubrovnik'],
  'BG': ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora', 'Pleven', 'Sliven', 'Dobrich', 'Shumen'],
  'UA': ['Kyiv', 'Kharkiv', 'Odessa', 'Dnipro', 'Donetsk', 'Lviv', 'Zaporizhzhia', 'Kryvyi Rih', 'Mykolaiv', 'Mariupol'],
  'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk', 'Omsk', 'Samara', 'Rostov-on-Don'],
  'MT': ['Valletta', 'Birkirkara', 'Qormi', 'Mosta', 'Sliema', 'St. Paul\'s Bay', 'Żabbar', 'San Ġwann', 'Fgura', 'Żejtun'],
  'CY': ['Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Famagusta', 'Kyrenia', 'Paralimni', 'Strovolos', 'Ayia Napa', 'Protaras'],
  'LV': ['Riga', 'Daugavpils', 'Liepāja', 'Jelgava', 'Jūrmala', 'Ventspils', 'Rēzekne', 'Valmiera', 'Jēkabpils', 'Ogre'],
  'EE': ['Tallinn', 'Tartu', 'Narva', 'Pärnu', 'Kohtla-Järve', 'Viljandi', 'Rakvere', 'Maardu', 'Sillamäe', 'Kuressaare'],
  'LT': ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys', 'Alytus', 'Marijampolė', 'Mažeikiai', 'Jonava', 'Utena'],
  'SK': ['Bratislava', 'Košice', 'Prešov', 'Žilina', 'Nitra', 'Banská Bystrica', 'Trnava', 'Martin', 'Trenčín', 'Poprad'],
  'SI': ['Ljubljana', 'Maribor', 'Celje', 'Kranj', 'Koper', 'Velenje', 'Novo Mesto', 'Ptuj', 'Trbovlje', 'Kamnik'],
  'MC': ['Monaco', 'Monte Carlo', 'La Condamine', 'Fontvieille', 'Moneghetti', 'Larvotto', 'Saint-Roman', 'Les Révoires', 'La Colle', 'Les Moneghetti'],
  'LU': ['Luxembourg City', 'Esch-sur-Alzette', 'Differdange', 'Dudelange', 'Ettelbruck', 'Diekirch', 'Wiltz', 'Rumelange', 'Echternach', 'Remich'],
  'AD': ['Andorra la Vella', 'Escaldes-Engordany', 'Encamp', 'Sant Julià de Lòria', 'La Massana', 'Ordino', 'Canillo', 'Arinsal', 'Pas de la Casa', 'El Tarter']
};

// Additional listing features
const amenities = [
  'Wi-Fi', 'Air conditioning', 'Heating', 'Kitchen', 'Washer', 'Dryer', 
  'Free parking', 'Pool', 'Hot tub', 'TV', 'Fireplace', 'BBQ grill', 
  'Gym', 'Breakfast', 'Indoor fireplace', 'Smoking allowed', 'Laptop-friendly workspace',
  'Private entrance', 'Security cameras', 'Smoke alarm', 'Carbon monoxide detector'
];

// Helper function to get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random integer in range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random boolean with a given probability
function getRandomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

// Generate a random name
function generateRandomName(): string {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  return `${firstName} ${lastName}`;
}

// Generate a random email based on name or completely random
function generateRandomEmail(name?: string): string {
  if (name && getRandomBoolean(0.7)) {
    // 70% chance to use name-based email
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}${getRandomInt(1, 999)}@${getRandomItem(emailDomains)}`;
  } else {
    // 30% chance for completely random email
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `user.${randomPart}@${getRandomItem(emailDomains)}`;
  }
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

  // Create users with random data
  const createdUsers = [];
  console.log(`Creating ${NUM_USERS} users...`);
  
  for (let i = 0; i < NUM_USERS; i++) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    const name = generateRandomName();
    const email = generateRandomEmail(name);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        createdAt: new Date(Date.now() - getRandomInt(0, 30 * 24 * 60 * 60 * 1000)), // Random date in the last 30 days
        updatedAt: new Date(),
        favoriteIds: [],
      }
    });
    
    createdUsers.push(user);
    console.log(`Created user: ${user.name} (${user.email})`);
  }

  // Shuffle the image files for more randomness
  const shuffledImageFiles = [...imageFiles].sort(() => Math.random() - 0.5);

  // Create listings with images
  console.log(`Creating ${shuffledImageFiles.length} listings...`);
  
  for (let i = 0; i < shuffledImageFiles.length; i++) {
    const imageFile = shuffledImageFiles[i];
    const imagePath = path.join(listingsDir, imageFile);
    
    // Use local path for development or uncomment the Cloudinary upload for production
    // For now, we'll use the local path format
    // const imageSrc = `/listings/${imageFile}`;
    
    // Uncomment to use Cloudinary upload
    const imageSrc = await uploadImageToCloudinary(imagePath);
    console.log(`Uploaded image to Cloudinary: ${imageSrc}`);
    
    const randomUser = getRandomItem(createdUsers);
    const country = getRandomItem(countries);
    const city = getRandomItem(citiesByCountry[country.value] || ['Unknown City']);
    
    // Create a more randomized price based on category and location
    const basePrice = getRandomInt(30, 300);
    let price = basePrice;
    
    // Luxury properties tend to cost more
    if (['Lux', 'Castles', 'Pools', 'Beachfront', 'Penthouse'].includes(getRandomItem(categories))) {
      price = basePrice * getRandomInt(2, 5);
    }
    
    // Some locations are more expensive
    if (['US', 'JP', 'CH', 'GB'].includes(country.value)) {
      price *= getRandomInt(12, 15) / 10;
    }
    
    // Round to nearest 5
    price = Math.ceil(price / 5) * 5;
    
    const listing = await prisma.listing.create({
      data: {
        title: getRandomItem(titles),
        description: getRandomItem(descriptions),
        imageSrc,
        category: getRandomItem(categories),
        roomCount: getRandomInt(1, 8),
        bathroomCount: getRandomInt(1, 5),
        guestCount: getRandomInt(1, 16),
        locationValue: country.value,
        city,
        price,
        userId: randomUser.id,
        createdAt: new Date(Date.now() - getRandomInt(0, 90 * 24 * 60 * 60 * 1000)), // Random date in the last 90 days
      }
    });
    
    console.log(`Created listing: ${listing.title} in ${city}, ${country.label} ($${listing.price}/night)`);
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