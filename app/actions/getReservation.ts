import prisma from "@/app/libs/prismadb";
import { SafeReservation } from "../types";

interface IParams {
   listingId?: string;
   userId?: string;
   authorId?: string;
}

export default async function getReservations(params: IParams) {
   try {
      const { listingId, userId, authorId } = params;

      const query: any = {};

      if (listingId) {
         query.listingId = listingId;
      }

      if (userId) {
         query.userId = userId;
      }

      if (authorId) {
         query.listing = { userId: authorId };
      }

      const reservations = await prisma.reservation.findMany({
         where: query,
         include: {
            listing: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      });

      // Map each reservation with error handling for individual records
      const safeReservations = reservations.reduce<SafeReservation[]>((validReservations, reservation) => {
         try {
            // Skip reservations with null listings that can't be safely processed
            if (!reservation.listing) {
               console.warn(`Reservation ${reservation.id} has a null listing reference`);
               return validReservations;
            }

            // Process valid reservation
            const safeReservation = {
               ...reservation,
               createdAt: reservation.createdAt.toISOString(),
               startDate: reservation.startDate.toISOString(),
               endDate: reservation.endDate.toISOString(),
               listing: {
                  ...reservation.listing,
                  createdAt: reservation.listing.createdAt.toISOString(),
               }
            };
            
            return [...validReservations, safeReservation];
         } catch (error) {
            // Log error and skip problematic reservation
            console.error(`Error processing reservation ${reservation.id}:`, error);
            return validReservations;
         }
      }, []);

      return safeReservations;
   } catch (error: any) {
      throw new Error(error);
   }
}
