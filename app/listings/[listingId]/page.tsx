import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservation";
import { SafeReservation } from "@/app/types";

interface IParams {
   listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
   try {
      const listing = await getListingById(params);
      
      if (!listing) {
         return (
            <ClientOnly>
               <EmptyState title="Listing not found" subTitle="The listing you are looking for does not exist or has been removed" />
            </ClientOnly>
         );
      }
      
      let reservations: SafeReservation[] = [];
      try {
         reservations = await getReservations(params);
         // Filter out any reservations with null listings
         reservations = reservations.filter(reservation => reservation.listing !== null);
      } catch (error) {
         console.error("Error fetching reservations for listing:", error);
         // Continue without reservations if they fail to load
      }
      
      const currentUser = await getCurrentUser();

      return (
         <ClientOnly>
            <ListingClient listing={listing} currentUser={currentUser} reservations={reservations} />
         </ClientOnly>
      );
   } catch (error) {
      console.error("Error loading listing page:", error);
      return (
         <ClientOnly>
            <EmptyState title="Something went wrong" subTitle="Failed to load the listing. Please try again later." />
         </ClientOnly>
      );
   }
};

export default ListingPage;
