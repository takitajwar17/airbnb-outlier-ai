import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservation";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return (
         <ClientOnly>
            <EmptyState title="Unauthorized" subTitle="Please Login" />
         </ClientOnly>
      );
   }

   try {
      const reservations = await getReservations({ userId: currentUser.id });

      if (reservations.length === 0) {
         return (
            <ClientOnly>
               <EmptyState
                  title="No trips found"
                  subTitle="Looks like you haven't reserved any trips."
               />
            </ClientOnly>
         );
      }

      // Filter out reservations with null listings before passing to the client
      const validReservations = reservations.filter(reservation => reservation.listing !== null);

      if (validReservations.length === 0) {
         return (
            <ClientOnly>
               <EmptyState
                  title="No valid trips found"
                  subTitle="Some of your trip listings may no longer be available"
               />
            </ClientOnly>
         );
      }

      return (
         <ClientOnly>
            <TripsClient reservations={validReservations} currentUser={currentUser} />
         </ClientOnly>
      );
   } catch (error) {
      console.error("Error fetching trips:", error);
      return (
         <ClientOnly>
            <EmptyState
               title="Something went wrong"
               subTitle="Failed to load your trips. Please try again later."
            />
         </ClientOnly>
      );
   }
};

export default TripsPage;
