import prisma from "@/app/libs/prismadb";
import countries from "world-countries";

export interface IListingParams {
   userId?: string;
   guestCount?: number;
   roomCount?: number;
   bathroomCount?: number;
   startDate?: string;
   endDate?: string;
   locationValue?: string;
   city?: string;
   searchTerm?: string;
   category?: string;
}

export default async function getListings(params: IListingParams) {
   try {
      const {
         userId,
         roomCount,
         guestCount,
         bathroomCount,
         startDate,
         endDate,
         locationValue,
         city,
         searchTerm,
         category,
      } = params;
      let query: any = {};

      if (userId) {
         query.userId = userId;
      }
      if (category) {
         query.category = category;
      }

      if (roomCount) {
         query.roomCount = {
            gte: +roomCount,
         };
      }
      if (guestCount) {
         query.guestCount = {
            gte: +guestCount,
         };
      }

      if (bathroomCount) {
         query.bathroomCount = {
            gte: +bathroomCount,
         };
      }
      
      // Handle semantic search
      if (searchTerm) {
         // If there's a search term, use it to search across both city and country
         const formattedCountries = countries.map(country => ({
            value: country.cca2,
            label: country.name.common.toLowerCase(),
         }));

         // Find countries that match the search term
         const matchingCountries = formattedCountries.filter(country => 
            country.label.includes(searchTerm.toLowerCase())
         );
         
         // Set up OR condition for semantic search
         query.OR = [
            // Search in city field
            {
               city: {
                  contains: searchTerm,
                  mode: 'insensitive',
               }
            }
         ];
         
         // Add country matches if any found
         if (matchingCountries.length > 0) {
            const countryValues = matchingCountries.map(country => country.value);
            query.OR.push({
               locationValue: {
                  in: countryValues
               }
            });
         }
      } else {
         // If no search term, use the specific locationValue and/or city if provided
         if (locationValue) {
            query.locationValue = locationValue;
         }
         if (city) {
            query.city = city;
         }
      }

      if (startDate && endDate) {
         query.NOT = {
            reservations: {
               some: {
                  OR: [
                     {
                        endDate: { gte: startDate },
                        startDate: { lte: startDate },
                     },
                     {
                        startDate: { lte: endDate },
                        endDate: { gte: endDate },
                     },
                  ],
               },
            },
         };
      }

      const listings = await prisma.listing.findMany({
         where: query,
         orderBy: { createdAt: "desc" },
      });
      const safeListings = listings.map((listing) => ({
         ...listing,
         createdAt: listing.createdAt.toISOString(),
      }));

      return safeListings;
   } catch (error: any) {
      throw new Error(error);
   }
}
