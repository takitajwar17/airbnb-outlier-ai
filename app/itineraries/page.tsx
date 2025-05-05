import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from '@/app/components/ClientOnly';
import Container from '@/app/components/Container';
import EmptyState from '@/app/components/EmptyState';
import ItineraryDashboard from './components/ItineraryDashboard';

const ItinerariesPage = async () => {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorized"
          subTitle="Please login to view your itineraries"
          showReset
        />
      </ClientOnly>
    );
  }
  
  return (
    <ClientOnly>
      <Container>
        <ItineraryDashboard currentUser={currentUser} />
      </Container>
    </ClientOnly>
  );
};

export default ItinerariesPage; 