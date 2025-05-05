"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Itinerary } from "../types";
import { SafeUser } from "@/app/types";
import { MdOutlineLocationOn, MdOutlineCalendarMonth, MdOutlineDirectionsTransit } from "react-icons/md";

interface ItineraryCardProps {
  itinerary: Itinerary;
  currentUser: SafeUser;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ 
  itinerary,
  currentUser
}) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/itineraries/${itinerary.id}`);
  };
  
  const startDate = new Date(itinerary.startDate);
  const endDate = new Date(itinerary.endDate);
  
  const formattedDateRange = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
  
  const destinationNames = itinerary.destinations.map(dest => dest.city).join(", ");
  const firstDestination = itinerary.destinations[0];
  
  const totalActivities = itinerary.destinations.reduce((sum, destination) => {
    return sum + destination.days.reduce((daySum, day) => daySum + day.activities.length, 0);
  }, 0);
  
  const totalTransportations = itinerary.destinations.reduce((sum, destination) => {
    return sum + destination.days.reduce((daySum, day) => daySum + day.transportation.length, 0);
  }, 0);
  
  return (
    <div 
      onClick={handleClick}
      className="
        col-span-1 
        cursor-pointer 
        group 
        bg-white 
        rounded-xl 
        border 
        border-neutral-200
        overflow-hidden 
        transition 
        hover:shadow-md
      "
    >
      <div className="flex flex-col gap-2 w-full">
        <div 
          className="
            aspect-video 
            w-full 
            relative 
            overflow-hidden 
            rounded-t-xl
          "
        >
          <Image
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={itinerary.coverImage}
            alt={itinerary.name}
          />
          <div 
            className="
              absolute 
              top-3 
              right-3 
              px-2 
              py-1 
              rounded-full 
              bg-white 
              font-semibold 
              text-xs 
              uppercase
              shadow-sm
            "
          >
            {itinerary.status === 'planned' ? 'Upcoming' : 'Completed'}
          </div>
        </div>
        <div className="p-4">
          <div className="font-semibold text-lg">{itinerary.name}</div>
          
          <div className="flex items-center gap-1 mt-2 text-neutral-500">
            <MdOutlineLocationOn size={18} />
            <span className="text-sm truncate">{destinationNames}</span>
          </div>
          
          <div className="flex items-center gap-1 mt-2 text-neutral-500">
            <MdOutlineCalendarMonth size={18} />
            <span className="text-sm">{formattedDateRange}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-100 flex gap-4">
            <div className="flex items-center gap-1 text-neutral-500">
              <MdOutlineDirectionsTransit size={18} />
              <span className="text-sm">{totalTransportations} transport</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-500">
              <span className="text-sm font-medium">{totalActivities} activities</span>
            </div>
          </div>
          
          {itinerary.totalBudget && (
            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-neutral-500">Budget:</div>
              <div className="font-semibold text-rose-500">${itinerary.totalBudget}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard; 