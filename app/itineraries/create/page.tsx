import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import CreateItineraryClient from "./CreateItineraryClient";

const CreateItineraryPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subTitle="Please login to create an itinerary"
          showReset
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <CreateItineraryClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default CreateItineraryPage; 