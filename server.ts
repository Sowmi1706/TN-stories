import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'tn_stories_db.json');

// Initialize Gemini API client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial Seed Data
const INITIAL_DESTINATIONS = [
  {
    id: "ooty",
    name: "Ooty (Udhagamandalam)",
    tagline: "The Queen of Hill Stations in the Nilgiris",
    district: "The Nilgiris",
    region: "Western Ghats",
    category: "Hill Station",
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Nestled at an elevation of 2,240 meters amidst the Blue Mountains, Ooty enchants travelers with sprawling tea plantations, aromatic eucalyptus groves, colonial heritage bungalows, and the century-old UNESCO Nilgiri Mountain Toy Train.",
    verifiedInfo: {
      idealDuration: "3 - 4 Days",
      bestSeason: "October to June (Pleasant 12°C - 20°C)",
      nearestAirport: "Coimbatore International Airport (88 km)",
      nearestRailway: "Udagamandalam Railway Station (Toy Train) / Mettupalayam (52 km)",
      weatherHighlight: "Crisp mist, morning dew, cool breeze throughout the day",
      localCuisine: ["Ooty Homemade Chocolates", "Fresh Nilgiri Tea", "Varkey Pastries", "Steaming Sambar Vada"],
      cultureHighlights: ["Toda Tribal Settlements", "Botanical Flower Show", "British Colonial Architecture"]
    },
    attractions: [
      "Nilgiri Mountain Railway (Toy Train)",
      "Ooty Lake & Boating",
      "Government Botanical Garden",
      "Doddabetta Peak",
      "Pykara Lake & Waterfalls",
      "Rose Garden",
      "Tea Museum & Factory"
    ],
    estimatedCostPerPerson: 7500,
    rating: 4.8,
    reviewCount: 142,
    availablePackages: [
      {
        id: "ooty-mist-3d",
        name: "Nilgiri Mist & Toy Train Heritage",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 8500,
        inclusions: ["3-Star Mountain Resort", "Private AC Sedan Transfer", "Toy Train Ticket Assistance", "Tea Tasting Pass", "Daily Breakfast"],
        highlights: ["Sunrise from Doddabetta", "Heritage Toy train joyride", "Rowing on Pykara lake"],
        isGroupAvailable: true
      },
      {
        id: "ooty-nature-4d",
        name: "Nilgiri Tea Trails & Wilderness Escape",
        duration: "4 Days / 3 Nights",
        pricePerPerson: 12500,
        inclusions: ["Tea Estate Heritage Bungalow", "Private SUV Transfer", "Guided Nature Walk", "All Meals", "Campfire Evening"],
        highlights: ["Stay inside 100-year tea estate", "Coonoor Sim's Park visit", "Tribal village interaction"],
        isGroupAvailable: false
      }
    ]
  },
  {
    id: "kodaikanal",
    name: "Kodaikanal",
    tagline: "The Princess of Hill Stations & Misty Valleys",
    district: "Dindigul",
    region: "Western Ghats",
    category: "Hill Station",
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Perched along the granite cliffs of the Palani Hills, Kodaikanal is renowned for its star-shaped man-made lake, dense shola forests, cloud-draped Pillar Rocks, and cool mountain breezes that inspire poetic tranquility.",
    verifiedInfo: {
      idealDuration: "3 Days",
      bestSeason: "September to May (Cool and misty)",
      nearestAirport: "Madurai Airport (120 km) / Coimbatore (175 km)",
      nearestRailway: "Kodai Road Railway Station (80 km)",
      weatherHighlight: "Ever-shifting mist, mild sunny afternoons, cozy chilly evenings",
      localCuisine: ["Dindigul Thalappakatti Biryani", "Kodai Cheese & Sourdough", "Fresh Plums & Pears", "Eucalyptus Honey"],
      cultureHighlights: ["Kurinji Flower Lore (blooms once every 12 years)", "Woodcraft & Herb Markets"]
    },
    attractions: [
      "Kodaikanal Star Lake & Cycling Ring",
      "Pillar Rocks Lookout",
      "Coaker's Walk with valley view",
      "Bryant Park",
      "Bear Shola Falls",
      "Silver Cascade Waterfall",
      "Pine Forest"
    ],
    estimatedCostPerPerson: 6900,
    rating: 4.7,
    reviewCount: 98,
    availablePackages: [
      {
        id: "kodai-retreat-3d",
        name: "Princess of Hills Scenic Getaway",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 7800,
        inclusions: ["Valley View Deluxe Hotel", "Private Cab for Sightseeing", "Lake Boating Pass", "Daily Breakfast"],
        highlights: ["Cycle along Kodai lake", "Walk through misty Pine Forest", "Sunset at Coaker's Walk"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "madurai",
    name: "Madurai",
    tagline: "The Ancient Athens of the East & Temple Capital",
    district: "Madurai",
    region: "Southern Pandya",
    category: "Heritage & Temples",
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ],
    description: "One of the world's oldest continuously inhabited cities, Madurai pulses around the iconic Meenakshi Sundareswarar Temple with its 14 towering, intricately sculpted gopurams. Known as Thoonga Nagaram (the city that never sleeps), it blends timeless Dravidian spiritual grandeur with legendary street food.",
    verifiedInfo: {
      idealDuration: "2 - 3 Days",
      bestSeason: "October to March (Pleasant evenings)",
      nearestAirport: "Madurai International Airport (12 km)",
      nearestRailway: "Madurai Junction (In city centre)",
      weatherHighlight: "Warm daytime, breezy festive evenings",
      localCuisine: ["Madurai Famous Jigarthanda", "Kari Dosa", "Bun Parotta & Salna", "Idli with 4 varieties of Chutney"],
      cultureHighlights: ["Evening Chariot procession & Palliyarai Pooja", "Sangam Tamil Literature Heritage", "Madurai Sungudi Sarees"]
    },
    attractions: [
      "Arulmigu Meenakshi Amman Temple & 1000 Pillar Hall",
      "Thirumalai Nayakkar Mahal & Light Show",
      "Gandhi Memorial Museum",
      "Alagar Kovil & Pazhamudircholai",
      "Teppakulam Vandiyur Mariamman Temple",
      "Puthu Mandapam Brass Craft Bazaars"
    ],
    estimatedCostPerPerson: 5800,
    rating: 4.9,
    reviewCount: 215,
    availablePackages: [
      {
        id: "madurai-spiritual-2d",
        name: "Meenakshi Heritage & Temple Trail",
        duration: "2 Days / 1 Night",
        pricePerPerson: 4900,
        inclusions: ["Heritage Star Hotel near Temple", "Special Darshan Assistance", "Guided Palace Walk", "Street Food Walk with Local Foodie Guide", "AC Car Transfer"],
        highlights: ["Night Palliyarai ritual witness", "Thirumalai Nayakkar sound & light", "Tasting authentic Jigarthanda"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "kanyakumari",
    name: "Kanyakumari",
    tagline: "The Southernmost Tip where Three Oceans Meet",
    district: "Kanyakumari",
    region: "Southern Peninsula",
    category: "Coastal & Beach",
    isHiddenGem: false,
    isTrending: false,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Cape Comorin stands proudly at the confluence of the Arabian Sea, Indian Ocean, and Bay of Bengal. Witnessing the sunrise and sunset across the open ocean, alongside the monumental 133-foot Thiruvalluvar Statue and Vivekananda Rock Memorial, is a quintessential Indian pilgrimage.",
    verifiedInfo: {
      idealDuration: "2 Days",
      bestSeason: "October to March",
      nearestAirport: "Trivandrum International Airport (90 km)",
      nearestRailway: "Kanyakumari Railway Station (Cape)",
      weatherHighlight: "Coastal sea breeze, dramatic twilight horizons",
      localCuisine: ["Nanjil Nadu Fish Curry Meals", "Banana Chips & Pazham Pori", "Tender Coconut Halwa", "Filter Kaapi"],
      cultureHighlights: ["Chitra Pournami full moon & sunset alignment", "Maritime trade heritage"]
    },
    attractions: [
      "Vivekananda Rock Memorial & Ferry Ride",
      "133-ft Thiruvalluvar Statue",
      "Sunset Point & Triveni Sangam",
      "Padmanabhapuram Palace (wooden architecture)",
      "Our Lady of Ransom Church",
      "Gandhi Memorial Mandapam",
      "Vattakottai Fort"
    ],
    estimatedCostPerPerson: 5400,
    rating: 4.8,
    reviewCount: 167,
    availablePackages: [
      {
        id: "cape-triveni-2d",
        name: "Southern Confluence & Ocean Sunset Trail",
        duration: "2 Days / 1 Night",
        pricePerPerson: 5200,
        inclusions: ["Ocean-Facing Hotel", "Ferry Priority Tickets", "Padmanabhapuram Palace excursion", "Private AC Cab"],
        highlights: ["Simultaneous sunset & moonrise view", "Vivekananda rock meditation hall", "Historic Vattakottai fort on beach"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "mahabalipuram",
    name: "Mahabalipuram (Mamallapuram)",
    tagline: "UNESCO World Heritage Shore Temple & Monolithic Rock Sculptures",
    district: "Chengalpattu",
    region: "Coromandel Coast",
    category: "Heritage & Temples",
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Built by the 7th-century Pallava dynasty along the Coromandel shoreline, Mamallapuram is a living museum of rock-cut caves, chariot rathas carved out of single boulders, and the iconic 8th-century Shore Temple battered gracefully by oceanic waves.",
    verifiedInfo: {
      idealDuration: "2 Days",
      bestSeason: "November to February",
      nearestAirport: "Chennai International Airport (55 km)",
      nearestRailway: "Chengalpattu Junction (29 km) / Chennai Central (60 km)",
      weatherHighlight: "Crisp morning sea mist, sunny afternoons, pleasant coastal breeze",
      localCuisine: ["Fresh Bay of Bengal Fried Fish", "Prawn Masala with Steamed Rice", "Filter Coffee at beachside shacks"],
      cultureHighlights: ["Mamallapuram Indian Dance Festival (Jan-Feb)", "Generational Stone Sculptor Workshops"]
    },
    attractions: [
      "Shore Temple facing the Bay of Bengal",
      "Pancha Rathas (Five Chariot Monoliths)",
      "Descent of the Ganges (Arjuna's Penance Bas-relief)",
      "Krishna's Butter Ball",
      "Mahabalipuram Lighthouse & Maritime Museum",
      "DakshinaChitra Heritage Village nearby"
    ],
    estimatedCostPerPerson: 4800,
    rating: 4.8,
    reviewCount: 134,
    availablePackages: [
      {
        id: "mamalla-heritage-2d",
        name: "Pallava Sculpture & Coastal Heritage",
        duration: "2 Days / 1 Night",
        pricePerPerson: 4600,
        inclusions: ["Beachfront Boutique Resort", "Certified Archaeological Guide", "Monument Entry Tickets", "AC Sedan from Chennai"],
        highlights: ["Sunrise photography at Shore Temple", "Stone carving masterclass session", "Lighthouse panoramic view"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "thanjavur",
    name: "Thanjavur",
    tagline: "The Cradle of Chola Art & The Grand Brihadisvara Temple",
    district: "Thanjavur",
    region: "Cauvery Delta",
    category: "Heritage & Temples",
    isHiddenGem: false,
    isTrending: false,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
    ],
    description: "The imperial capital of the Cholas, Thanjavur is crowned by the thousand-year-old Brihadisvara Temple (Peruvudaiyar Kovil), an architectural miracle built from 130,000 tonnes of granite. It is also the epicenter of Carnatic music, Bharatanatyam, and gold-foil Thanjavur paintings.",
    verifiedInfo: {
      idealDuration: "2 - 3 Days",
      bestSeason: "October to March",
      nearestAirport: "Tiruchirappalli International Airport (58 km)",
      nearestRailway: "Thanjavur Junction",
      weatherHighlight: "Lush Cauvery delta breeze, cool morning temple courtyards",
      localCuisine: ["Thanjavur Kadappa & Idli", "Ash Gourd Kootu", "Thavala Vadai", "Kumbakonam Degree Coffee"],
      cultureHighlights: ["Thanjavur Art Plates & Gold Foil Paintings", "Thanjavur Dancing Dolls (Thalaiyatti Bommai)"]
    },
    attractions: [
      "Brihadisvara Temple (Big Temple - UNESCO site)",
      "Thanjavur Maratha Palace Complex",
      "Saraswathi Mahal Library (Ancient Palm-leaf manuscripts)",
      "Royal Palace Museum & Bronze Gallery",
      "Schwartz Church",
      "Sangeetha Mahal"
    ],
    estimatedCostPerPerson: 5200,
    rating: 4.9,
    reviewCount: 112,
    availablePackages: [
      {
        id: "chola-heritage-3d",
        name: "Great Living Chola Temples Circuit",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 7200,
        inclusions: ["Heritage Palace Hotel Stay", "Brihadisvara, Gangaikonda Cholapuram & Darasuram tour", "Expert Historian Guide", "Private AC Cab"],
        highlights: ["Sunset circumambulation at Big Temple", "Palm-leaf manuscript demonstration", "Degree coffee trail in Kumbakonam"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "chettinad",
    name: "Chettinad (Karaikudi)",
    tagline: "Palatial Mansions, Rich Antiques & Legendary Gastronomy",
    district: "Sivaganga",
    region: "Southern Pandya",
    category: "Cultural & Culinary",
    isHiddenGem: true,
    isTrending: true,
    isPopular: false,
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Home to the merchant Nattukottai Chettiars, this region comprises 70+ villages brimming with opulent 19th-century mansions featuring Burma teak pillars, Italian marble floors, and Belgian glass mirrors, coupled with India's most celebrated spice-rich cuisine.",
    verifiedInfo: {
      idealDuration: "2 - 3 Days",
      bestSeason: "October to March",
      nearestAirport: "Madurai Airport (85 km) / Trichy (90 km)",
      nearestRailway: "Karaikudi Junction",
      weatherHighlight: "Dry tropical climate with comfortable evenings",
      localCuisine: ["Chettinad Chicken Pepper Masala", "Vellai Paniyaram", "Kavuni Arisi (black rice sweet)", "Seeyam"],
      cultureHighlights: ["Athangudi Handmade Floral Tiles", "Karaikudi Antique Bazaar", "Chettinad Cotton Weaving (Kandangi)"]
    },
    attractions: [
      "Chettinad Palace at Kanadukathan",
      "Athangudi Tile Factories",
      "Karaikudi Muneeswarar Temple & Antique Street",
      "Chidambara Vilas & Heritage Mansions",
      "Kavuni Arisi Cooking Demonstrations",
      "Kandangi Saree Handloom Weaving Centres"
    ],
    estimatedCostPerPerson: 6500,
    rating: 4.9,
    reviewCount: 76,
    availablePackages: [
      {
        id: "chettinad-regal-3d",
        name: "Chettinad Regal Mansion & Culinary Odyssey",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 8900,
        inclusions: ["Stay in restored 1920s Chettinad Mansion", "Traditional Banana Leaf Feasts", "Hands-on Masterclass with Master Chettinad Aachi", "Athangudi tile making workshop"],
        highlights: ["Stay under teak chandeliers & Belgian chandeliers", "Authentic 7-course Chettinad banquet", "Antique hunting in Karaikudi"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "rameshwaram",
    name: "Rameshwaram",
    tagline: "Sacred Island, Corridors of Thousand Pillars & Pamban Bridge",
    district: "Ramanathapuram",
    region: "Southern Peninsula",
    category: "Heritage & Temples",
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Set on Pamban Island connected to mainland India by the engineering marvel of Pamban Sea Bridge, Rameshwaram is one of Hinduism's holiest Char Dham destinations. Its Ramanathaswamy Temple boasts the world's longest pillared corridor.",
    verifiedInfo: {
      idealDuration: "2 Days",
      bestSeason: "October to April",
      nearestAirport: "Madurai Airport (170 km)",
      nearestRailway: "Rameshwaram / Mandapam Railway Station",
      weatherHighlight: "Coastal winds, calm shallow emerald sea waters",
      localCuisine: ["Coastal Fish Curry", "Rameshwaram Halwa", "Hot Vada with Coconut Chutney at temple lanes"],
      cultureHighlights: ["The legend of Ram Setu / Adam's Bridge", "Dhanushkodi ghost town maritime history"]
    },
    attractions: [
      "Ramanathaswamy Temple & 22 Sacred Theerthams",
      "Pamban Rail & Road Bridge",
      "Dhanushkodi Ghost Town & Ram Setu Point",
      "Dr. A.P.J. Abdul Kalam National Memorial",
      "Agni Theertham Beach",
      "Ariyaman Beach water activities"
    ],
    estimatedCostPerPerson: 5900,
    rating: 4.8,
    reviewCount: 155,
    availablePackages: [
      {
        id: "rameshwaram-dhanushkodi-2d",
        name: "Island Sanctuary & Dhanushkodi Safari",
        duration: "2 Days / 1 Night",
        pricePerPerson: 5400,
        inclusions: ["Sea View Hotel", "4x4 Jeep Safari to Dhanushkodi beach point", "Pamban Bridge Photo Stop", "Special Theertham Guide"],
        highlights: ["Ride between the Bay of Bengal & Indian Ocean at Dhanushkodi", "Walking the longest stone pillared corridor", "Tribute at Kalam Memorial"],
        isGroupAvailable: true
      }
    ]
  },
  {
    id: "hogenakkal",
    name: "Hogenakkal Falls",
    tagline: "The Niagara of India & Coracle Rides on the Cauvery",
    district: "Dharmapuri",
    region: "Kongu Nadu",
    category: "Nature & Wildlife",
    isHiddenGem: true,
    isTrending: false,
    isPopular: true,
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Where the sacred Cauvery River cascades over carbonatite rock formations creating clouds of misty spray (Hoge - smoke, Kal - rock), Hogenakkal is famed for thrilling round bamboo coracle boat rides and rejuvenating herbal oil massages.",
    verifiedInfo: {
      idealDuration: "1 - 2 Days",
      bestSeason: "August to February (Post-monsoon water roar)",
      nearestAirport: "Bengaluru International Airport (150 km)",
      nearestRailway: "Dharmapuri (45 km)",
      weatherHighlight: "Refreshing river spray, warm sunny gorge",
      localCuisine: ["Fresh Caught Cauvery Fried River Fish", "Hot Rasam Rice with Village Ghee"],
      cultureHighlights: ["Centuries-old Coracle weaving with bamboo and tar", "Traditional riverside masseurs"]
    },
    attractions: [
      "Main Waterfalls Cascade",
      "Bamboo Coracle (Parisal) River Ride",
      "Carbonatite Rock Canyon",
      "Hanging Bridge Viewpoint",
      "Pennagaram Herbal Oil Massage Ghats"
    ],
    estimatedCostPerPerson: 3800,
    rating: 4.6,
    reviewCount: 64,
    availablePackages: [
      {
        id: "hogenakkal-splash-2d",
        name: "River Gorge & Coracle Adventure",
        duration: "2 Days / 1 Night",
        pricePerPerson: 4200,
        inclusions: ["Riverbank Eco-Resort", "Verified Coracle Boat Operator with Lifejackets", "Freshly Cooked River Meals", "AC Cab Transfer"],
        highlights: ["Coracle spin under the misty spray", "Scenic walk across hanging bridge", "Relaxing riverside retreat"],
        isGroupAvailable: false
      }
    ]
  },
  {
    id: "valparai",
    name: "Valparai & Anamalai Hills",
    tagline: "Hidden Emerald Tea Valleys & Nilgiri Tahr Sanctuary",
    district: "Coimbatore",
    region: "Western Ghats",
    category: "Nature & Wildlife",
    isHiddenGem: true,
    isTrending: true,
    isPopular: false,
    heroImage: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80",
    fallbackImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Approached through 40 exhilarating hairpin bends from Pollachi, Valparai is a secluded haven 3,500 feet high in the Anamalai Hills. Unspoiled by mass tourism, it offers sightings of Lion-tailed macaques, Great hornbills, and the endangered Nilgiri Tahr.",
    verifiedInfo: {
      idealDuration: "3 Days",
      bestSeason: "September to April",
      nearestAirport: "Coimbatore Airport (125 km)",
      nearestRailway: "Pollachi Junction (65 km)",
      weatherHighlight: "Pure mountain mist, lush rainforest rainfall",
      localCuisine: ["Kongu Style Nattu Kozhi Curry", "Elaneer Payasam", "Estate Tea Brew"],
      cultureHighlights: ["Bio-diversity conservation corridors", "Kadar indigenous forest traditions"]
    },
    attractions: [
      "Aliyar Dam & 40 Hairpin Bends Lookout",
      "Sholayar Dam (Asia's second deepest)",
      "Nallamudi Poonjolai Valley View",
      "Chinnakallar Waterfalls (Second wettest place in India)",
      "Monkey Falls & Loam's View Point"
    ],
    estimatedCostPerPerson: 6200,
    rating: 4.9,
    reviewCount: 52,
    availablePackages: [
      {
        id: "valparai-wilderness-3d",
        name: "Anamalai Rainforest & Wild Tea Escape",
        duration: "3 Days / 2 Nights",
        pricePerPerson: 7500,
        inclusions: ["Colonial Planter Bungalow", "Dedicated 4WD Mountain Vehicle", "Certified Naturalist Guide", "Forest Permission Passes"],
        highlights: ["Spotting rare Nilgiri Tahr on rock slopes", "Hairpin bend drive vistas", "Sholayar dam panoramic view"],
        isGroupAvailable: true
      }
    ]
  }
];

const INITIAL_PROMOTION = {
  code: "FIRST10",
  discountPercent: 10,
  minBookingAmount: 3000,
  maxDiscountAmount: 2500,
  active: true,
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  title: "First Adventure Special Offer",
  description: "Welcome to TN Stories! 🎉 Book your first eligible trip and enjoy 10% OFF up to ₹2,500 on bookings above ₹3,000."
};

const INITIAL_SERVICES = {
  accommodations: [
    { id: "acc-heritage", name: "Heritage Palace / Chettinad Mansion Stay", pricePerNight: 4200, rating: 4.9, badge: "Authentic Cultural Luxury" },
    { id: "acc-resort", name: "4-Star Mountain/Coastal Scenic Resort", pricePerNight: 3400, rating: 4.7, badge: "Comfort & Scenic Views" },
    { id: "acc-homestay", name: "Eco Plantation Homestay with Local Host", pricePerNight: 2200, rating: 4.8, badge: "Warm Host & Nature" },
    { id: "acc-standard", name: "Deluxe City Centre Hotel", pricePerNight: 1600, rating: 4.4, badge: "Budget Friendly" }
  ],
  transportations: [
    { id: "tr-sedan", name: "Private AC Sedan (Dzire / Etios) with Chauffeur", pricePerDay: 2400, capacity: "Up to 3 Travellers", badge: "Most Popular for Couples & Solos" },
    { id: "tr-suv", name: "Luxury AC SUV (Toyota Innova Crysta)", pricePerDay: 3800, capacity: "Up to 6 Travellers", badge: "Best for Families & Groups" },
    { id: "tr-tempo", name: "Executive Tempo Traveller (12-Seater AC)", pricePerDay: 5500, capacity: "Up to 12 Travellers", badge: "Group Expeditions" },
    { id: "tr-toy-train", name: "Scenic Heritage Train / Local Coach Assistance", pricePerDay: 850, capacity: "Per Person", badge: "Iconic Experience" }
  ],
  caretakerGuides: [
    {
      id: "assist-caretaker",
      name: "Dedicated Personal Caretaker",
      pricePerDay: 1200,
      description: "Trained assistant for luggage handling, elder care assistance, queue facilitation, and day-to-day comfort.",
      type: "caretaker"
    },
    {
      id: "assist-guide",
      name: "Certified Tamil Nadu Local Heritage Guide",
      pricePerDay: 1500,
      description: "State-certified tourism storyteller fluent in Tamil, English, and Hindi. Unlocks temple architecture secrets and hidden stories.",
      type: "guide"
    },
    {
      id: "assist-both",
      name: "Caretaker + Certified Local Guide Combo",
      pricePerDay: 2300,
      description: "Complete hassle-free package: full travel assistance + deep cultural storytelling with bundle savings.",
      type: "both"
    },
    {
      id: "assist-none",
      name: "No Assistance (Self-Guided Adventure)",
      pricePerDay: 0,
      description: "You'll travel independently at your own pace with our digital guide notes.",
      type: "none"
    }
  ],
  addOns: [
    { id: "add-vip-darshan", name: "Temple Evening Aarti & Priority Darshan Pass", price: 650, unit: "per person", description: "Direct access assistance at prominent temple sanctums without long queues." },
    { id: "add-cooking", name: "Authentic Chettinad Cooking & Spice Masterclass", price: 1100, unit: "per person", description: "2-hour culinary session with traditional Aachi cook, includes recipe book." },
    { id: "add-tea", name: "Nilgiri Organic Tea Tasting & Estate Walk", price: 450, unit: "per person", description: "Learn orthodox tea picking, processing, and sample 5 premium single-estate brews." },
    { id: "add-boat", name: "Pamban Bridge / Mangrove Boat Safari", price: 750, unit: "per person", description: "1.5-hour lifejacket-equipped boat ride with certified boatman." },
    { id: "add-insurance", name: "Travel & Emergency Medical Insurance Cover", price: 299, unit: "per person", description: "Comprehensive ₹5,00,000 accidental & travel delay cover by partner insurer." }
  ]
};

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    destinationId: "ooty",
    bookingId: "TNS-2026-1021",
    customerId: "usr-priya",
    customerName: "Priya Sundaram",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    title: "Mesmerizing Nilgiri Mist & Caring Local Guide!",
    content: "Our family trip to Ooty with TN Stories was unforgettable. The toy train tickets were pre-booked smoothly and our local guide, Murugan, made every temple and botanical stop come alive with stories. The 10% first-booking discount was a wonderful surprise!",
    travelDate: "March 2026",
    companionType: "Family Trip",
    photoUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80",
    isVerifiedBooking: true,
    status: "APPROVED",
    createdAt: "2026-03-24T10:30:00Z"
  },
  {
    id: "rev-2",
    destinationId: "madurai",
    bookingId: "TNS-2026-1054",
    customerId: "usr-karthik",
    customerName: "Karthik Raja",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    title: "Divine Meenakshi Temple Architecture & Flawless Caretaker",
    content: "Traveling with elderly parents can be stressful, but having the caretaker service from TN Stories was the best decision! He helped with wheelchairs, footwear stands, and finding the best Jigarthanda in town. Highly recommended!",
    travelDate: "February 2026",
    companionType: "Family Trip",
    photoUrl: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80",
    isVerifiedBooking: true,
    status: "APPROVED",
    createdAt: "2026-02-18T14:15:00Z"
  },
  {
    id: "rev-3",
    destinationId: "chettinad",
    bookingId: "TNS-2026-1089",
    customerId: "usr-ananya",
    customerName: "Ananya Iyer",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    title: "The Mansion Stay and Culinary Tour Was Like Stepping into Royalty",
    content: "Karaikudi is a hidden treasure. The Athangudi tile demonstration and the authentic pepper chicken feast prepared in front of us made this my favorite trip this year. The booking wizard made choosing our custom vehicle and mansion effortless.",
    travelDate: "January 2026",
    companionType: "Friends Trip",
    photoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    isVerifiedBooking: true,
    status: "APPROVED",
    createdAt: "2026-01-29T16:45:00Z"
  },
  {
    id: "rev-4",
    destinationId: "kanyakumari",
    bookingId: "TNS-2026-1102",
    customerId: "usr-deepak",
    customerName: "Deepak Krishnan",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    title: "Sunset where three seas meet - pure bliss",
    content: "The ferry tickets to Vivekananda Rock were managed without hassle. The ocean view hotel booked through TN Stories gave us front-row seats to the iconic Cape Comorin sunset. Seamless booking workflow!",
    travelDate: "April 2026",
    companionType: "Solo Travel",
    photoUrl: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80",
    isVerifiedBooking: true,
    status: "APPROVED",
    createdAt: "2026-04-05T09:10:00Z"
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "TNS-2026-1021",
    customerId: "usr-priya",
    customerName: "Priya Sundaram",
    customerEmail: "priya.s@example.com",
    customerPhone: "+91 98401 23456",
    destinationId: "ooty",
    destinationName: "Ooty (Udhagamandalam)",
    travelDates: {
      startDate: "2026-03-20",
      returnDate: "2026-03-23",
      durationDays: 3
    },
    travellers: { adults: 2, children: 1, total: 3 },
    companionType: "family",
    arrangementPreference: "curated",
    selectedPackageId: "ooty-mist-3d",
    selectedPackageName: "Nilgiri Mist & Toy Train Heritage",
    caretakerGuidePreference: "guide",
    caretakerGuideCost: 4500,
    selectedServices: {
      sightseeingActivities: [
        { name: "Nilgiri Organic Tea Tasting & Estate Walk", pricePerPerson: 450, total: 1350 }
      ]
    },
    pricing: {
      baseAmount: 25500,
      servicesAmount: 5850,
      subtotal: 31350,
      discountPercent: 10,
      discountAmount: 2500,
      promoCodeApplied: "FIRST10",
      taxAmount: 1442,
      finalPayableAmount: 30292,
      isEstimated: false
    },
    specialRequests: "Child car seat request, vegetarian meals preference.",
    bookingStatus: "COMPLETED",
    paymentStatus: "PAID",
    paymentMethod: "UPI_OR_CARD_ON_ARRIVAL",
    createdAt: "2026-03-01T11:20:00Z",
    updatedAt: "2026-03-24T18:00:00Z"
  }
];

const INITIAL_USERS = [
  {
    id: "usr-arun",
    name: "Arun Kumar",
    email: "arun.kumar@example.com",
    password: "traveler123",
    phone: "+91 98410 99887",
    role: "traveler",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: false,
    createdAt: "2026-04-01T08:00:00Z"
  },
  {
    id: "usr-priya",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    password: "traveler123",
    phone: "+91 98401 23456",
    role: "traveler",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: true,
    createdAt: "2026-02-15T09:30:00Z"
  },
  {
    id: "usr-admin",
    name: "Sowmiya (TN Stories Administrator)",
    email: "admin@tnstories.in",
    password: "admin123",
    phone: "+91 94440 11223",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: false,
    createdAt: "2026-01-01T00:00:00Z"
  }
];

interface DbSchema {
  destinations: any[];
  promotion: any;
  services: any;
  reviews: any[];
  bookings: any[];
  users: any[];
}

// Helper to read and write database
function loadDb(): DbSchema {
  if (!fs.existsSync(DB_PATH)) {
    const data: DbSchema = {
      destinations: INITIAL_DESTINATIONS,
      promotion: INITIAL_PROMOTION,
      services: INITIAL_SERVICES,
      reviews: INITIAL_REVIEWS,
      bookings: INITIAL_BOOKINGS,
      users: INITIAL_USERS
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed: DbSchema = JSON.parse(raw);
    if (parsed.users) {
      let modified = false;
      parsed.users.forEach((u: any) => {
        if (!u.password) {
          u.password = u.role === 'admin' ? 'admin123' : 'traveler123';
          modified = true;
        }
      });
      if (modified) {
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db.json, returning initial data', err);
    return {
      destinations: INITIAL_DESTINATIONS,
      promotion: INITIAL_PROMOTION,
      services: INITIAL_SERVICES,
      reviews: INITIAL_REVIEWS,
      bookings: INITIAL_BOOKINGS,
      users: INITIAL_USERS
    };
  }
}

function saveDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // =================== AUTHENTICATION APIS ===================

  // 1. Customer / Traveler Login
  app.post('/api/auth/customer-login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const db = loadDb();
    const user = db.users.find((u: any) => 
      u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: 'No traveler account found with this email. Please sign up.' });
    }

    if (user.password && user.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid password. Please try again.' });
    }

    // Return sanitized customer profile
    const { password: _, ...safeUser } = user;
    return res.json({
      user: safeUser,
      token: `traveler-token-${user.id}-${Date.now()}`
    });
  });

  // 2. Customer / Traveler Sign Up
  app.post('/api/auth/customer-signup', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const db = loadDb();
    const existing = db.users.find((u: any) => 
      u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      phone: phone?.trim() || '+91 98400 00000',
      role: 'traveler',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      hasCompletedBookings: false,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDb(db);

    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({
      user: safeUser,
      token: `traveler-token-${newUser.id}-${Date.now()}`
    });
  });

  // 3. Dedicated Admin Gateway Login
  app.post('/api/auth/admin-login', (req, res) => {
    const { email, password, securityPasscode } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Admin email and password are required.' });
    }

    const db = loadDb();
    const adminUser = db.users.find((u: any) => 
      u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!adminUser) {
      return res.status(403).json({ error: 'Access denied. Administrator credentials not recognized.' });
    }

    if (adminUser.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Access denied. This portal is strictly restricted to TN Stories administrators. Please use the Customer Login.' 
      });
    }

    if (adminUser.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid administrative password.' });
    }

    const { password: _, ...safeAdmin } = adminUser;
    return res.json({
      admin: safeAdmin,
      token: `admin-session-${adminUser.id}-${Date.now()}`,
      accessLevel: 'SUPER_ADMIN'
    });
  });

  // 4. List registered users / test personas for convenience
  app.get('/api/auth/users', (_req, res) => {
    const db = loadDb();
    const safeUsers = db.users.map((u: any) => {
      const { password: _, ...safe } = u;
      return safe;
    });
    return res.json(safeUsers);
  });

  // API Routes
  // 1. Get Destinations
  app.get('/api/destinations', (req, res) => {
    const db = loadDb();
    let result = [...db.destinations];
    const { category, district, search, hidden } = req.query;

    if (category && category !== 'All') {
      result = result.filter((d: any) => d.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (district && district !== 'All') {
      result = result.filter((d: any) => d.district.toLowerCase() === (district as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter((d: any) =>
        d.name.toLowerCase().includes(q) ||
        d.district.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.attractions.some((a: string) => a.toLowerCase().includes(q))
      );
    }
    if (hidden === 'true') {
      result = result.filter((d: any) => d.isHiddenGem);
    }

    res.json(result);
  });

  // 2. Get Single Destination
  app.get('/api/destinations/:id', (req, res) => {
    const db = loadDb();
    const dest = db.destinations.find((d: any) => d.id === req.params.id);
    if (!dest) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(dest);
  });

  // 3. Admin: Create/Update/Delete Destination
  app.post('/api/destinations', (req, res) => {
    const db = loadDb();
    const newDest = {
      ...req.body,
      id: req.body.id || req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0
    };
    db.destinations.push(newDest);
    saveDb(db);
    res.status(201).json(newDest);
  });

  app.put('/api/destinations/:id', (req, res) => {
    const db = loadDb();
    const idx = db.destinations.findIndex((d: any) => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db.destinations[idx] = { ...db.destinations[idx], ...req.body };
    saveDb(db);
    res.json(db.destinations[idx]);
  });

  app.delete('/api/destinations/:id', (req, res) => {
    const db = loadDb();
    db.destinations = db.destinations.filter((d: any) => d.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 4. Get Services & Packages
  app.get('/api/services', (_req, res) => {
    const db = loadDb();
    res.json(db.services);
  });

  // 5. Promotion Configuration & Eligibility
  app.get('/api/promotions/config', (_req, res) => {
    const db = loadDb();
    res.json(db.promotion);
  });

  app.put('/api/promotions/config', (req, res) => {
    const db = loadDb();
    db.promotion = { ...db.promotion, ...req.body };
    saveDb(db);
    res.json(db.promotion);
  });

  // Independent Backend Promo Eligibility Check
  app.post('/api/promotions/check-eligibility', (req, res) => {
    const { customerEmail, customerId, amount } = req.body;
    const db = loadDb();
    const promo = db.promotion;

    if (!promo.active) {
      return res.json({
        eligible: false,
        reason: 'Promotion is currently inactive',
        discountPercent: 0,
        discountAmount: 0
      });
    }

    // Check date validity
    const today = new Date().toISOString().split('T')[0];
    if (promo.startDate && today < promo.startDate) {
      return res.json({ eligible: false, reason: 'Offer has not started yet', discountPercent: 0, discountAmount: 0 });
    }
    if (promo.endDate && today > promo.endDate) {
      return res.json({ eligible: false, reason: 'Offer has expired', discountPercent: 0, discountAmount: 0 });
    }

    // Minimum booking amount
    const bookingAmt = Number(amount) || 0;
    if (bookingAmt < promo.minBookingAmount) {
      return res.json({
        eligible: false,
        reason: `Minimum booking amount of ₹${promo.minBookingAmount.toLocaleString('en-IN')} required (Current: ₹${bookingAmt.toLocaleString('en-IN')})`,
        discountPercent: 0,
        discountAmount: 0
      });
    }

    // Check if customer already has any confirmed or completed bookings
    const priorBookings = db.bookings.filter((b: any) =>
      (b.customerEmail?.toLowerCase() === customerEmail?.toLowerCase() ||
       b.customerId === customerId) &&
      b.bookingStatus !== 'CANCELLED'
    );

    if (priorBookings.length > 0) {
      return res.json({
        eligible: false,
        reason: 'This discount is reserved exclusively for first-time bookings.',
        discountPercent: 0,
        discountAmount: 0
      });
    }

    // Calculate verified discount
    const calculatedDiscount = Math.round((bookingAmt * promo.discountPercent) / 100);
    const finalDiscount = Math.min(calculatedDiscount, promo.maxDiscountAmount);

    return res.json({
      eligible: true,
      reason: 'Eligible for 10% First Booking Discount!',
      discountPercent: promo.discountPercent,
      discountAmount: finalDiscount,
      maxCapApplied: calculatedDiscount > promo.maxDiscountAmount,
      promoCode: promo.code
    });
  });

  // 6. Bookings API
  app.get('/api/bookings', (req, res) => {
    const db = loadDb();
    const { customerId, customerEmail } = req.query;
    let list = [...db.bookings];
    if (customerId) {
      list = list.filter((b: any) => b.customerId === customerId);
    } else if (customerEmail) {
      list = list.filter((b: any) => b.customerEmail?.toLowerCase() === (customerEmail as string).toLowerCase());
    }
    // Sort latest first
    list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  app.get('/api/bookings/:id', (req, res) => {
    const db = loadDb();
    const booking = db.bookings.find((b: any) => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  });

  // Secure Backend Booking Creation with server-side pricing & promo calculation
  app.post('/api/bookings', (req, res) => {
    const db = loadDb();
    const payload = req.body;

    // Validate required fields
    if (!payload.destinationId || !payload.travelDates?.startDate || !payload.travellers?.adults) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    const dest = db.destinations.find((d: any) => d.id === payload.destinationId);
    if (!dest) {
      return res.status(400).json({ error: 'Invalid destination' });
    }

    // Generate unique reference
    const timestamp = Date.now().toString().slice(-4);
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `TNS-2026-${timestamp}${randomHex}`.slice(0, 16);

    // Calculate pricing on backend
    const adults = Number(payload.travellers.adults) || 1;
    const children = Number(payload.travellers.children) || 0;
    const totalPersons = adults + children;
    const durationDays = Number(payload.travelDates.durationDays) || 3;

    let baseAmount = 0;
    let servicesAmount = 0;

    if (payload.arrangementPreference === 'curated' && payload.selectedPackageId) {
      const pkg = dest.availablePackages?.find((p: any) => p.id === payload.selectedPackageId);
      if (pkg) {
        baseAmount = pkg.pricePerPerson * adults + Math.round(pkg.pricePerPerson * 0.6) * children;
      } else {
        baseAmount = dest.estimatedCostPerPerson * adults;
      }
    } else {
      // Self-planned
      baseAmount = dest.estimatedCostPerPerson * adults;
    }

    // Caretaker / Guide cost
    let assistCost = 0;
    if (payload.caretakerGuidePreference === 'caretaker') {
      assistCost = 1200 * durationDays;
    } else if (payload.caretakerGuidePreference === 'guide') {
      assistCost = 1500 * durationDays;
    } else if (payload.caretakerGuidePreference === 'both') {
      assistCost = 2300 * durationDays;
    }

    // Selected Services cost (accommodation, transport, add-ons)
    if (payload.selectedServices?.accommodation) {
      servicesAmount += (Number(payload.selectedServices.accommodation.pricePerNight) || 0) * Math.max(1, durationDays - 1);
    }
    if (payload.selectedServices?.transportation) {
      servicesAmount += (Number(payload.selectedServices.transportation.pricePerDay) || 0) * durationDays;
    }
    if (Array.isArray(payload.selectedServices?.sightseeingActivities)) {
      for (const act of payload.selectedServices.sightseeingActivities) {
        servicesAmount += (Number(act.pricePerPerson) || 0) * totalPersons;
      }
    }

    const subtotal = baseAmount + servicesAmount + assistCost;

    // Server-Side Independent Promo validation
    let discountAmount = 0;
    let discountPercent = 0;
    let promoCodeApplied = undefined;

    const promo = db.promotion;
    if (promo.active && subtotal >= promo.minBookingAmount) {
      // Check prior bookings for this customer
      const priorCount = db.bookings.filter((b: any) =>
        (b.customerEmail?.toLowerCase() === payload.customerEmail?.toLowerCase() ||
         b.customerId === payload.customerId) &&
        b.bookingStatus !== 'CANCELLED'
      ).length;

      if (priorCount === 0) {
        discountPercent = promo.discountPercent;
        const rawDiscount = Math.round((subtotal * discountPercent) / 100);
        discountAmount = Math.min(rawDiscount, promo.maxDiscountAmount);
        promoCodeApplied = promo.code;
      }
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = Math.round(afterDiscount * 0.05); // 5% GST on tourism packages
    const finalPayableAmount = afterDiscount + taxAmount;

    const newBooking = {
      id: bookingId,
      customerId: payload.customerId || 'usr-guest',
      customerName: payload.customerName || 'Honored Traveler',
      customerEmail: payload.customerEmail || 'traveler@tnstories.in',
      customerPhone: payload.customerPhone || '',
      destinationId: dest.id,
      destinationName: dest.name,
      travelDates: {
        startDate: payload.travelDates.startDate,
        returnDate: payload.travelDates.returnDate || payload.travelDates.startDate,
        durationDays: durationDays
      },
      travellers: {
        adults: adults,
        children: children,
        total: totalPersons
      },
      companionType: payload.companionType || 'family',
      groupDepartureId: payload.groupDepartureId || null,
      arrangementPreference: payload.arrangementPreference || 'curated',
      selectedPackageId: payload.selectedPackageId || null,
      selectedPackageName: payload.selectedPackageName || (dest.availablePackages?.[0]?.name ?? 'Standard Discovery Tour'),
      caretakerGuidePreference: payload.caretakerGuidePreference || 'none',
      caretakerGuideCost: assistCost,
      selectedServices: payload.selectedServices || {},
      pricing: {
        baseAmount,
        servicesAmount,
        assistCost,
        subtotal,
        discountPercent,
        discountAmount,
        promoCodeApplied,
        taxAmount,
        finalPayableAmount,
        isEstimated: false
      },
      specialRequests: payload.specialRequests || '',
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAYMENT_PENDING',
      paymentMethod: payload.paymentMethod || 'UPI_OR_CARD_ON_ARRIVAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);
    saveDb(db);

    res.status(201).json(newBooking);
  });

  // Admin update booking status
  app.put('/api/bookings/:id/status', (req, res) => {
    const db = loadDb();
    const idx = db.bookings.findIndex((b: any) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Booking not found' });

    if (req.body.bookingStatus) db.bookings[idx].bookingStatus = req.body.bookingStatus;
    if (req.body.paymentStatus) db.bookings[idx].paymentStatus = req.body.paymentStatus;
    db.bookings[idx].updatedAt = new Date().toISOString();

    saveDb(db);
    res.json(db.bookings[idx]);
  });

  // 7. Reviews API
  app.get('/api/reviews', (req, res) => {
    const db = loadDb();
    const { destinationId, customerId } = req.query;
    let list = [...db.reviews];
    if (destinationId) {
      list = list.filter((r: any) => r.destinationId === destinationId);
    }
    if (customerId) {
      list = list.filter((r: any) => r.customerId === customerId);
    }
    // Sort latest
    list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  app.post('/api/reviews', (req, res) => {
    const db = loadDb();
    const { destinationId, bookingId, customerId, rating, title, content, travelDate, companionType, photoUrl, customerName, customerAvatar } = req.body;

    if (!destinationId || !rating || !title || !content) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }

    // Check duplicate review for same booking if bookingId provided
    if (bookingId) {
      const existing = db.reviews.find((r: any) => r.bookingId === bookingId && r.customerId === customerId);
      if (existing) {
        return res.status(400).json({ error: 'You have already reviewed this booking. You can edit your existing review.' });
      }
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      destinationId,
      bookingId: bookingId || `TNS-WALKIN-${Date.now()}`,
      customerId: customerId || 'usr-traveler',
      customerName: customerName || 'Verified Traveler',
      customerAvatar: customerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: Math.min(5, Math.max(1, Number(rating))),
      title,
      content,
      travelDate: travelDate || 'Recent Trip',
      companionType: companionType || 'Solo Travel',
      photoUrl: photoUrl || null,
      isVerifiedBooking: Boolean(bookingId),
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.reviews.unshift(newRev);

    // Update destination average rating and count
    const dest = db.destinations.find((d: any) => d.id === destinationId);
    if (dest) {
      const destReviews = db.reviews.filter((r: any) => r.destinationId === destinationId && r.status === 'APPROVED');
      const sum = destReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      dest.rating = Number((sum / destReviews.length).toFixed(1));
      dest.reviewCount = destReviews.length;
    }

    saveDb(db);
    res.status(201).json(newRev);
  });

  app.put('/api/reviews/:id', (req, res) => {
    const db = loadDb();
    const idx = db.reviews.findIndex((r: any) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Review not found' });

    // Authorization check: must be reviewer or admin
    if (req.body.customerId && db.reviews[idx].customerId !== req.body.customerId && req.body.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this review' });
    }

    db.reviews[idx] = {
      ...db.reviews[idx],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Recalculate dest rating
    const destId = db.reviews[idx].destinationId;
    const dest = db.destinations.find((d: any) => d.id === destId);
    if (dest) {
      const destReviews = db.reviews.filter((r: any) => r.destinationId === destId && r.status === 'APPROVED');
      const sum = destReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      dest.rating = Number((sum / destReviews.length).toFixed(1));
      dest.reviewCount = destReviews.length;
    }

    saveDb(db);
    res.json(db.reviews[idx]);
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const db = loadDb();
    const rev = db.reviews.find((r: any) => r.id === req.params.id);
    if (!rev) return res.status(404).json({ error: 'Review not found' });

    db.reviews = db.reviews.filter((r: any) => r.id !== req.params.id);

    // Recalculate dest rating
    const dest = db.destinations.find((d: any) => d.id === rev.destinationId);
    if (dest) {
      const destReviews = db.reviews.filter((r: any) => r.destinationId === rev.destinationId && r.status === 'APPROVED');
      const sum = destReviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      dest.rating = destReviews.length > 0 ? Number((sum / destReviews.length).toFixed(1)) : 5.0;
      dest.reviewCount = destReviews.length;
    }

    saveDb(db);
    res.json({ success: true });
  });

  // 8. Admin Statistics API
  app.get('/api/admin/stats', (_req, res) => {
    const db = loadDb();
    const totalBookings = db.bookings.length;
    const totalRevenue = db.bookings.reduce((sum: number, b: any) => sum + (b.pricing?.finalPayableAmount || 0), 0);
    const activePromos = db.promotion.active ? 1 : 0;
    const totalReviews = db.reviews.length;
    const avgRating = totalReviews > 0 ? (db.reviews.reduce((s: number, r: any) => s + r.rating, 0) / totalReviews).toFixed(1) : "5.0";

    res.json({
      totalBookings,
      totalRevenue,
      activePromos,
      totalReviews,
      avgRating,
      destinationsCount: db.destinations.length
    });
  });

  // 9. AI Travel Concierge Chatbot Endpoint
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const db = loadDb();
    const destinationNames = db.destinations.map((d: any) => `${d.name} (${d.district})`).join(', ');

    const systemInstruction = `You are "Vanakkam Assistant", the friendly and expert AI Travel Concierge for "TN Stories" — the smart tourism and trip booking platform for Tamil Nadu, India.
Your mission is to guide travelers with authentic, practical, culturally rich, and inspiring advice about Tamil Nadu destinations.

Available Destinations in TN Stories Database:
${destinationNames}

Key Platform Features You Can Highlight:
1. Caretaker & Local Certified Guide Services: Travelers can book dedicated elderly/family caretakers (₹1,200/day) and state-certified heritage storytellers (₹1,500/day).
2. Curated vs Custom Trips: Travelers can book all-inclusive packages or customize private vehicles (Sedan, Innova, Tempo) and accommodations.
3. First-Booking Offer: 10% OFF on first eligible booking above ₹3,000 (Use code FIRST10).
4. Authentic regional gastronomy: Recommend Madurai Jigarthanda & Kari Dosa, Chettinad Pepper Chicken & Vellai Paniyaram, Dindigul Biryani, Ooty Homemade Chocolates & Varkey, Kumbakonam Degree Coffee, Kanyakumari fish curry.

Guidelines:
- Start with a warm, courteous Tamil greeting when appropriate (e.g., "Vanakkam! 🙏").
- Provide structured, helpful answers with bullet points for readability.
- Mention ideal months, temple timings/etiquette (traditional modest attire, removing footwear), and travel connectivity (nearest airports/railways).
- If the user asks about booking, invite them to use the "Book Your Trip" button or browse our destinations.
- Keep responses friendly, concise, and informative (around 120-220 words).`;

    try {
      const isRealApiKey = Boolean(
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
        process.env.GEMINI_API_KEY.trim().length > 10
      );

      if (isRealApiKey) {
        // Build conversation parts
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        // Use Promise.race with an 8 second timeout to ensure high responsiveness
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 8000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          }
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        const reply = response.text || "Vanakkam! I'd love to help you explore Tamil Nadu. Could you share what kind of places you enjoy — misty hills, majestic temples, or coastal sunsets?";

        // Identify any mentioned destinations to suggest quick links
        const mentionedDestIds: string[] = [];
        const lowerReply = reply.toLowerCase() + ' ' + message.toLowerCase();
        db.destinations.forEach((d: any) => {
          if (lowerReply.includes(d.id) || lowerReply.includes(d.name.toLowerCase().split(' ')[0])) {
            mentionedDestIds.push(d.id);
          }
        });

        return res.json({
          reply,
          suggestedDestinations: mentionedDestIds.slice(0, 3)
        });
      } else {
        // Fallback intelligent domain engine when API key is pending configuration
        const lower = message.toLowerCase();
        let fallbackReply = "Vanakkam! 🙏 Welcome to TN Stories. ";
        let suggestedDestIds: string[] = ['ooty', 'madurai'];

        if (lower.includes('ooty') || lower.includes('nilgiri') || lower.includes('hill')) {
          fallbackReply += "Ooty and Kodaikanal are our crown hill stations in the Western Ghats! In Ooty, don't miss the UNESCO Nilgiri Mountain Railway (Toy Train), Doddabetta Peak, and sampling fresh homemade chocolates & Varkey. Best season to visit is October to June.";
          suggestedDestIds = ['ooty', 'kodaikanal'];
        } else if (lower.includes('madurai') || lower.includes('temple') || lower.includes('heritage') || lower.includes('meenakshi')) {
          fallbackReply += "Madurai is the cultural capital of Tamil Nadu! The Meenakshi Amman Temple features 14 majestic sculpted gopurams. Temple etiquette requires traditional modest attire (dhotis/saris/kurthas) and removing footwear. Don't leave without tasting famous chilled Madurai Jigarthanda and authentic Kari Dosa!";
          suggestedDestIds = ['madurai', 'thanjavur'];
        } else if (lower.includes('beach') || lower.includes('coast') || lower.includes('kanyakumari') || lower.includes('sunset') || lower.includes('sea')) {
          fallbackReply += "Kanyakumari is where the Arabian Sea, Gulf of Mannar, and Indian Ocean converge! You can view stunning sunrises and sunsets from the same coastline. Take the short ferry ride to the Vivekananda Rock Memorial and the 133-ft Thiruvalluvar Statue.";
          suggestedDestIds = ['kanyakumari', 'mahabalipuram'];
        } else if (lower.includes('caretaker') || lower.includes('guide') || lower.includes('assist')) {
          fallbackReply += "TN Stories offers verified Local Caretakers (₹1,200/day for elderly, family, or solo traveler comfort) and Certified Heritage Guides (₹1,500/day for deep historical storytelling). You can select them directly in Step 5 of our Booking Wizard!";
          suggestedDestIds = ['madurai', 'thanjavur', 'chettinad'];
        } else if (lower.includes('offer') || lower.includes('discount') || lower.includes('promo') || lower.includes('coupon') || lower.includes('first')) {
          fallbackReply += "First-time travelers enjoy a 10% discount up to ₹2,500 on all eligible bookings above ₹3,000! Use code FIRST10 during checkout. Our server automatically verifies eligibility for your account.";
          suggestedDestIds = ['ooty', 'kodaikanal', 'madurai'];
        } else if (lower.includes('food') || lower.includes('cuisine') || lower.includes('eat')) {
          fallbackReply += "Tamil Nadu is a food lover's paradise! Savor Chettinad Pepper Chicken & Vellai Paniyaram in Karaikudi, famous Dindigul Thalappakatti Biryani, Kumbakonam Degree Coffee, hot Kanyakumari fish curries, and Ooty homemade chocolates.";
          suggestedDestIds = ['chettinad', 'madurai', 'kodaikanal'];
        } else {
          fallbackReply += "Tamil Nadu offers a magnificent range of landscapes — from the misty peaks of Ooty and Kodaikanal, to the ancient Chola temples of Thanjavur and Madurai, and coastal wonders like Mahabalipuram and Kanyakumari. You can book customized chauffeured vehicles or all-inclusive tour packages directly on TN Stories!";
          suggestedDestIds = ['ooty', 'madurai', 'mahabalipuram'];
        }

        return res.json({
          reply: fallbackReply,
          suggestedDestinations: suggestedDestIds
        });
      }
    } catch (err: any) {
      console.error('Error generating AI chat response:', err);
      return res.json({
        reply: "Vanakkam! 🙏 I am here to help you plan your journey across Tamil Nadu. Whether you're seeking misty Nilgiri tea trails, ancient Chola architecture in Thanjavur, or coastal serenity in Kanyakumari, feel free to ask me about itineraries, travel tips, and best local foods!",
        suggestedDestinations: ['ooty', 'madurai', 'kanyakumari']
      });
    }
  });

  // Mount Vite or serve static dist
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TN Stories server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
