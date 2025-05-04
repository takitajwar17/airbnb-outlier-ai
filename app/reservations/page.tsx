import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservation";
import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
   const currentUser = await getCurrentUser();

   if (!currentUser) {
      return (
         <ClientOnly>
            <EmptyState title="Unauthorized" subTitle="Please login" />
         </ClientOnly>
      );
   }

   try {
      const reservations = await getReservations({
         authorId: currentUser?.id,
      });

      if (reservations.length === 0) {
         return (
            <ClientOnly>
               <EmptyState
                  title="No reservations found"
                  subTitle="Looks like you have no reservations on your properties"
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
                  title="No valid reservations found"
                  subTitle="There may be issues with some of your property listings"
               />
            </ClientOnly>
         );
      }

      return (
         <ClientOnly>
            <ReservationsClient reservations={validReservations} currentUser={currentUser} />
         </ClientOnly>
      );
   } catch (error) {
      console.error("Error fetching reservations:", error);
      return (
         <ClientOnly>
            <EmptyState
               title="Something went wrong"
               subTitle="Failed to load reservations. Please try again later."
            />
         </ClientOnly>
      );
   }
};

export default ReservationsPage;
