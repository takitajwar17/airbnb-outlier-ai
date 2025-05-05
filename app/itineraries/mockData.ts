import { Itinerary, TripStatus } from './types';

export const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: '1',
    name: 'Summer in Europe',
    status: 'planned' as TripStatus,
    startDate: '2024-07-15',
    endDate: '2024-07-28',
    createdAt: '2024-04-10T12:30:45Z',
    userId: 'user123',
    totalBudget: 5000,
    currentSpend: 3200,
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    destinations: [
      {
        city: 'Paris',
        country: 'France',
        coordinates: {
          lat: 48.8566,
          lng: 2.3522
        },
        startDate: '2024-07-15',
        endDate: '2024-07-19',
        days: [
          {
            date: '2024-07-15',
            accommodations: [
              {
                id: 'acc1',
                listingId: 'list1',
                name: 'Charming Apartment near Eiffel Tower',
                location: 'Champ de Mars, Paris, France',
                checkIn: '2024-07-15T15:00:00Z',
                checkOut: '2024-07-19T11:00:00Z',
                price: 780,
                imageUrl: 'https://images.unsplash.com/photo-1556784344-ad913a7a0b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                confirmationCode: 'BKNG12345'
              }
            ],
            transportation: [
              {
                id: 'trans1',
                type: 'flight',
                provider: 'Air France',
                departureTime: '2024-07-15T08:30:00Z',
                arrivalTime: '2024-07-15T10:45:00Z',
                departureLocation: 'JFK Airport, New York',
                arrivalLocation: 'Charles de Gaulle Airport, Paris',
                price: 850,
                duration: '7h 15m',
                confirmationCode: 'AF123456',
                details: {
                  flightNumber: 'AF123',
                  terminal: '2E',
                  gate: 'G20',
                  class: 'Economy'
                }
              }
            ],
            activities: [
              {
                id: 'act1',
                name: 'Eiffel Tower Visit',
                description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris',
                location: 'Champ de Mars, Paris, France',
                date: '2024-07-15',
                time: '16:00',
                duration: '2h',
                price: 25,
                category: 'Sightseeing',
                imageUrl: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7,
                bookingStatus: 'booked'
              }
            ]
          },
          {
            date: '2024-07-16',
            accommodations: [],
            transportation: [],
            activities: [
              {
                id: 'act2',
                name: 'Louvre Museum Tour',
                description: 'Explore one of the world\'s largest art museums and see the Mona Lisa',
                location: 'Rue de Rivoli, Paris, France',
                date: '2024-07-16',
                time: '10:00',
                duration: '4h',
                price: 17,
                category: 'Museum',
                imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                bookingStatus: 'booked'
              },
              {
                id: 'act3',
                name: 'Seine River Cruise',
                description: 'Romantic evening cruise on the Seine River',
                location: 'Port de la Conférence, Paris, France',
                date: '2024-07-16',
                time: '19:00',
                duration: '1h 30m',
                price: 35,
                category: 'Cruise',
                imageUrl: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.6,
                bookingStatus: 'booked'
              }
            ]
          }
        ]
      },
      {
        city: 'Rome',
        country: 'Italy',
        coordinates: {
          lat: 41.9028,
          lng: 12.4964
        },
        startDate: '2024-07-20',
        endDate: '2024-07-24',
        days: [
          {
            date: '2024-07-20',
            accommodations: [
              {
                id: 'acc2',
                listingId: 'list2',
                name: 'Historic Apartment near Colosseum',
                location: 'Via dei Fori Imperiali, Rome, Italy',
                checkIn: '2024-07-20T14:00:00Z',
                checkOut: '2024-07-24T10:00:00Z',
                price: 650,
                imageUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.6
              }
            ],
            transportation: [
              {
                id: 'trans2',
                type: 'flight',
                provider: 'Alitalia',
                departureTime: '2024-07-19T22:15:00Z',
                arrivalTime: '2024-07-20T00:30:00Z',
                departureLocation: 'Charles de Gaulle Airport, Paris',
                arrivalLocation: 'Leonardo da Vinci Airport, Rome',
                price: 210,
                duration: '2h 15m',
                confirmationCode: 'AZ789012',
                details: {
                  flightNumber: 'AZ789',
                  terminal: '1',
                  gate: 'B12',
                  class: 'Economy'
                }
              }
            ],
            activities: [
              {
                id: 'act4',
                name: 'Colosseum Tour',
                description: 'Explore the ancient Roman Colosseum with a guided tour',
                location: 'Piazza del Colosseo, Rome, Italy',
                date: '2024-07-20',
                time: '15:00',
                duration: '2h 30m',
                price: 45,
                category: 'Historical',
                imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                bookingStatus: 'booked'
              }
            ]
          }
        ]
      },
      {
        city: 'Barcelona',
        country: 'Spain',
        coordinates: {
          lat: 41.3851,
          lng: 2.1734
        },
        startDate: '2024-07-25',
        endDate: '2024-07-28',
        days: [
          {
            date: '2024-07-25',
            accommodations: [
              {
                id: 'acc3',
                listingId: 'list3',
                name: 'Modern Apartment in Gothic Quarter',
                location: 'Barri Gòtic, Barcelona, Spain',
                checkIn: '2024-07-25T15:00:00Z',
                checkOut: '2024-07-28T11:00:00Z',
                price: 480,
                imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9
              }
            ],
            transportation: [
              {
                id: 'trans3',
                type: 'train',
                provider: 'Renfe',
                departureTime: '2024-07-24T20:00:00Z',
                arrivalTime: '2024-07-25T09:45:00Z',
                departureLocation: 'Roma Termini, Rome',
                arrivalLocation: 'Barcelona Sants, Barcelona',
                price: 180,
                duration: '13h 45m',
                confirmationCode: 'RNF456789',
                details: {
                  trainNumber: 'AVE7843',
                  carriage: '12',
                  seat: '45D',
                  class: 'First Class'
                }
              }
            ],
            activities: [
              {
                id: 'act5',
                name: 'Sagrada Familia Visit',
                description: 'Visit Antoni Gaudí\'s masterpiece, the Sagrada Familia basilica',
                location: 'Carrer de Mallorca, Barcelona, Spain',
                date: '2024-07-25',
                time: '14:00',
                duration: '2h',
                price: 32,
                category: 'Architecture',
                imageUrl: 'https://images.unsplash.com/photo-1583779457094-32f849ded302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                bookingStatus: 'booked'
              }
            ]
          },
          {
            date: '2024-07-26',
            accommodations: [],
            transportation: [],
            activities: [
              {
                id: 'act6',
                name: 'Park Güell Tour',
                description: 'Explore the colorful mosaic wonderland of Park Güell',
                location: 'Carrer d\'Olot, Barcelona, Spain',
                date: '2024-07-26',
                time: '10:00',
                duration: '2h',
                price: 14,
                category: 'Park',
                imageUrl: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7,
                bookingStatus: 'booked'
              },
              {
                id: 'act7',
                name: 'Tapas and Wine Tour',
                description: 'Evening culinary tour through Barcelona\'s best tapas bars',
                location: 'La Rambla, Barcelona, Spain',
                date: '2024-07-26',
                time: '19:00',
                duration: '3h',
                price: 75,
                category: 'Food & Drink',
                imageUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                bookingStatus: 'booked'
              }
            ]
          },
          {
            date: '2024-07-27',
            accommodations: [],
            transportation: [],
            activities: [
              {
                id: 'act8',
                name: 'Barceloneta Beach Day',
                description: 'Relax at Barcelona\'s famous beach and enjoy the Mediterranean',
                location: 'Barceloneta Beach, Barcelona, Spain',
                date: '2024-07-27',
                time: '11:00',
                duration: '5h',
                price: 0,
                category: 'Beach',
                imageUrl: 'https://images.unsplash.com/photo-1504387103978-e4ee71416c38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.5,
                bookingStatus: 'saved'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Japan Adventure',
    status: 'planned' as TripStatus,
    startDate: '2024-09-10',
    endDate: '2024-09-22',
    createdAt: '2024-03-20T08:15:30Z',
    userId: 'user123',
    totalBudget: 7000,
    currentSpend: 4500,
    coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    destinations: [
      {
        city: 'Tokyo',
        country: 'Japan',
        coordinates: {
          lat: 35.6764,
          lng: 139.6500
        },
        startDate: '2024-09-10',
        endDate: '2024-09-16',
        days: [
          {
            date: '2024-09-10',
            accommodations: [
              {
                id: 'acc4',
                listingId: 'list4',
                name: 'Modern Studio in Shibuya',
                location: 'Shibuya, Tokyo, Japan',
                checkIn: '2024-09-10T16:00:00Z',
                checkOut: '2024-09-16T10:00:00Z',
                price: 920,
                imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7
              }
            ],
            transportation: [
              {
                id: 'trans4',
                type: 'flight',
                provider: 'Japan Airlines',
                departureTime: '2024-09-09T22:30:00Z',
                arrivalTime: '2024-09-10T14:45:00Z',
                departureLocation: 'JFK Airport, New York',
                arrivalLocation: 'Narita Airport, Tokyo',
                price: 1200,
                duration: '14h 15m',
                confirmationCode: 'JL123456',
                details: {
                  flightNumber: 'JL006',
                  terminal: '1',
                  gate: '23',
                  class: 'Economy'
                }
              }
            ],
            activities: [
              {
                id: 'act9',
                name: 'Shibuya Crossing Experience',
                description: 'Experience the famous Shibuya Crossing, the busiest intersection in the world',
                location: 'Shibuya, Tokyo, Japan',
                date: '2024-09-10',
                time: '18:00',
                duration: '1h',
                price: 0,
                category: 'Urban Exploration',
                imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                bookingStatus: 'saved'
              }
            ]
          }
        ]
      },
      {
        city: 'Kyoto',
        country: 'Japan',
        coordinates: {
          lat: 35.0116,
          lng: 135.7681
        },
        startDate: '2024-09-16',
        endDate: '2024-09-22',
        days: [
          {
            date: '2024-09-16',
            accommodations: [
              {
                id: 'acc5',
                listingId: 'list5',
                name: 'Traditional Ryokan in Gion',
                location: 'Gion District, Kyoto, Japan',
                checkIn: '2024-09-16T15:00:00Z',
                checkOut: '2024-09-22T10:00:00Z',
                price: 1250,
                imageUrl: 'https://images.unsplash.com/photo-1578469645735-46214effb4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9
              }
            ],
            transportation: [
              {
                id: 'trans5',
                type: 'train',
                provider: 'Japan Railways',
                departureTime: '2024-09-16T10:30:00Z',
                arrivalTime: '2024-09-16T13:10:00Z',
                departureLocation: 'Tokyo Station, Tokyo',
                arrivalLocation: 'Kyoto Station, Kyoto',
                price: 140,
                duration: '2h 40m',
                confirmationCode: 'JR752431',
                details: {
                  trainNumber: 'Nozomi 223',
                  carriage: '7',
                  seat: '12D',
                  class: 'Green Car'
                }
              }
            ],
            activities: [
              {
                id: 'act10',
                name: 'Fushimi Inari Shrine Visit',
                description: 'Explore the iconic red torii gates at Fushimi Inari Shrine',
                location: 'Fushimi Ward, Kyoto, Japan',
                date: '2024-09-17',
                time: '09:00',
                duration: '3h',
                price: 0,
                category: 'Temple/Shrine',
                imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                bookingStatus: 'saved'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Weekend in New York',
    status: 'completed' as TripStatus,
    startDate: '2024-02-23',
    endDate: '2024-02-25',
    createdAt: '2024-01-10T15:45:12Z',
    userId: 'user123',
    totalBudget: 1500,
    currentSpend: 1450,
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    destinations: [
      {
        city: 'New York',
        country: 'United States',
        coordinates: {
          lat: 40.7128,
          lng: -74.0060
        },
        startDate: '2024-02-23',
        endDate: '2024-02-25',
        days: [
          {
            date: '2024-02-23',
            accommodations: [
              {
                id: 'acc6',
                listingId: 'list6',
                name: 'Luxury Studio in Manhattan',
                location: 'Midtown, New York, USA',
                checkIn: '2024-02-23T15:00:00Z',
                checkOut: '2024-02-25T11:00:00Z',
                price: 650,
                imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8
              }
            ],
            transportation: [],
            activities: [
              {
                id: 'act11',
                name: 'Broadway Show - Hamilton',
                description: 'Watch the acclaimed Broadway musical Hamilton',
                location: 'Richard Rodgers Theatre, New York, USA',
                date: '2024-02-23',
                time: '19:00',
                duration: '2h 45m',
                price: 250,
                category: 'Entertainment',
                imageUrl: 'https://images.unsplash.com/photo-1561121693-484a4003d118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.9,
                bookingStatus: 'booked'
              }
            ]
          },
          {
            date: '2024-02-24',
            accommodations: [],
            transportation: [],
            activities: [
              {
                id: 'act12',
                name: 'Central Park Bike Tour',
                description: 'Guided bike tour through New York\'s iconic Central Park',
                location: 'Central Park, New York, USA',
                date: '2024-02-24',
                time: '10:00',
                duration: '2h',
                price: 45,
                category: 'Outdoor',
                imageUrl: 'https://images.unsplash.com/photo-1517736996305-a8d5ff8b3d2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.7,
                bookingStatus: 'booked'
              },
              {
                id: 'act13',
                name: 'Metropolitan Museum of Art',
                description: 'Visit one of the world\'s most renowned art museums',
                location: 'Fifth Avenue, New York, USA',
                date: '2024-02-24',
                time: '14:00',
                duration: '3h',
                price: 25,
                category: 'Museum',
                imageUrl: 'https://images.unsplash.com/photo-1532003464938-9229961c5eb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                rating: 4.8,
                bookingStatus: 'booked'
              }
            ]
          }
        ]
      }
    ]
  }
];

export const getItineraries = () => {
  return new Promise<Itinerary[]>((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ITINERARIES);
    }, 1500);
  });
};

export const getItineraryById = (id: string) => {
  return new Promise<Itinerary | undefined>((resolve) => {
    setTimeout(() => {
      const itinerary = MOCK_ITINERARIES.find(item => item.id === id);
      resolve(itinerary);
    }, 1200);
  });
}; 