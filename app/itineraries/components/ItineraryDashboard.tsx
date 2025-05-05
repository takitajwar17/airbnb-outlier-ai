"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CldImage } from "next-cloudinary";
import { getItineraries } from "../mockData";
import { Itinerary } from "../types";
import { SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import ItineraryCard from "./ItineraryCard";
import ItinerarySkeletonCard from "./ItinerarySkeletonCard";
import { MdAdd } from "react-icons/md";

interface ItineraryDashboardProps {
  currentUser: SafeUser;
}

const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const loadItineraries = async () => {
      try {
        const data = await getItineraries();
        setItineraries(data);
      } catch (error) {
        console.error("Failed to load itineraries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItineraries();
  }, []);

  const handleCreateItinerary = () => {
    router.push("/itineraries/create");
  };

  const upcomingItineraries = itineraries.filter(
    (itinerary) => itinerary.status === "planned" && new Date(itinerary.startDate) > new Date()
  );

  const pastItineraries = itineraries.filter(
    (itinerary) => itinerary.status === "completed" || new Date(itinerary.endDate) < new Date()
  );

  return (
    <div className="pt-24 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Heading title="Your Travel Itineraries" subtitle="Plan and organize your upcoming trips" />
        <div className="mt-4 md:mt-0">
          <Button
            label="Create New Itinerary"
            onClick={handleCreateItinerary}
            icon={MdAdd}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <ItinerarySkeletonCard key={item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {upcomingItineraries.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingItineraries.map((itinerary) => (
                  <ItineraryCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </div>
          )}

          {pastItineraries.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Trips</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastItineraries.map((itinerary) => (
                  <ItineraryCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </div>
          )}

          {upcomingItineraries.length === 0 && pastItineraries.length === 0 && (
            <div className="mt-10 text-center">
              <div className="bg-gray-50 rounded-xl p-8 max-w-xl mx-auto">
                <h3 className="text-lg font-semibold mb-2">No itineraries yet</h3>
                <p className="text-neutral-500 mb-6">
                  Create your first travel itinerary to start planning your dream trip!
                </p>
                <div className="max-w-[200px] mx-auto">
                  <Button
                    label="Create Itinerary"
                    onClick={handleCreateItinerary}
                    icon={MdAdd}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItineraryDashboard; 