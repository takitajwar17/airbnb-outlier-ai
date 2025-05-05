"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import Image from "next/image";
import { Itinerary } from "../types";
import { SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Map from "@/app/components/Map";
import ItineraryHeaderSkeleton from "./components/ItineraryHeaderSkeleton";
import ItineraryTimeline from "./components/ItineraryTimeline";
import DestinationSelector from "./components/DestinationSelector";
import { MdArrowBack, MdOutlineEdit, MdOutlineShare } from "react-icons/md";

interface ItineraryClientProps {
  itinerary: Itinerary;
  currentUser?: SafeUser | null;
}

const ItineraryClient: React.FC<ItineraryClientProps> = ({
  itinerary,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDestinationIndex, setSelectedDestinationIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGoBack = () => {
    router.push("/itineraries");
  };

  const handleEdit = () => {
    router.push(`/itineraries/${itinerary.id}/edit`);
  };

  const handleShare = () => {
    // In a real implementation, this would open a sharing modal
    alert("Sharing functionality would be implemented here");
  };

  const selectedDestination = itinerary.destinations[selectedDestinationIndex];
  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);
  const duration = differenceInDays(endDate, startDate) + 1;

  const formattedDateRange = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
  const allDestinations = itinerary.destinations.map(dest => `${dest.city}, ${dest.country}`).join(" • ");

  return (
    <Container>
      <div className="pt-24 pb-10">
        {isLoading ? (
          <ItineraryHeaderSkeleton />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={handleGoBack}
                className="p-2 rounded-full hover:bg-neutral-100 transition"
              >
                <MdArrowBack size={24} />
              </button>
              <div className="flex-grow">
                <h1 className="text-2xl font-bold">{itinerary.name}</h1>
                <p className="text-neutral-500">{formattedDateRange} • {duration} days</p>
              </div>
              <div className="flex gap-2">
                <Button
                  small
                  outline
                  icon={MdOutlineShare}
                  label="Share"
                  onClick={handleShare}
                />
                <Button
                  small
                  icon={MdOutlineEdit}
                  label="Edit"
                  onClick={handleEdit}
                />
              </div>
            </div>

            <div className="rounded-xl overflow-hidden h-[40vh] mb-8 relative">
              <div className="absolute inset-0 z-10">
                <Map center={[selectedDestination.coordinates.lat, selectedDestination.coordinates.lng]} />
              </div>
              <div className="absolute top-4 left-4 right-4 z-20">
                <DestinationSelector 
                  destinations={itinerary.destinations} 
                  selectedIndex={selectedDestinationIndex}
                  onChange={setSelectedDestinationIndex}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-8/12">
                <div className="mb-6">
                  <Heading title="Your Itinerary" subtitle="Your planned trip day by day" />
                </div>
                <ItineraryTimeline itinerary={itinerary} />
              </div>
              
              <div className="w-full lg:w-4/12">
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden sticky top-24">
                  <div className="aspect-video w-full relative overflow-hidden">
                    <Image
                      fill
                      src={itinerary.coverImage}
                      alt={itinerary.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Trip Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500">Duration</span>
                        <span className="font-medium">{duration} days</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-neutral-100">
                        <span className="text-neutral-500">Destinations</span>
                        <span className="font-medium text-right">{itinerary.destinations.length}</span>
                      </div>
                      
                      {itinerary.totalBudget && (
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">Budget</span>
                          <span className="font-medium">${itinerary.totalBudget}</span>
                        </div>
                      )}
                      
                      {itinerary.currentSpend && (
                        <div className="flex justify-between py-2 border-b border-neutral-100">
                          <span className="text-neutral-500">Spent so far</span>
                          <span className="font-medium">${itinerary.currentSpend}</span>
                        </div>
                      )}
                      
                      {itinerary.totalBudget && itinerary.currentSpend && (
                        <div className="pt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-neutral-500">Budget used</span>
                            <span className="font-medium">
                              {Math.round((itinerary.currentSpend / itinerary.totalBudget) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2.5">
                            <div 
                              className="bg-rose-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (itinerary.currentSpend / itinerary.totalBudget) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default ItineraryClient; 