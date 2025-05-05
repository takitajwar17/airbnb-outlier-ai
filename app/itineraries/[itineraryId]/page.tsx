import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ItineraryClient from "./ItineraryClient";
import { getItineraryById } from "../mockData";

interface IParams {
  itineraryId?: string;
}

const ItineraryPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();
  const itinerary = await getItineraryById(params.itineraryId || "");

  if (!itinerary) {
    return (
      <ClientOnly>
        <EmptyState title="Itinerary not found" subTitle="Try another itinerary" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ItineraryClient itinerary={itinerary} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ItineraryPage; 