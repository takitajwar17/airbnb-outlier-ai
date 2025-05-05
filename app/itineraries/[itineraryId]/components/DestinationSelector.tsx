"use client";

import { ItineraryDestination } from "@/app/itineraries/types";
import { MdLocationOn } from "react-icons/md";

interface DestinationSelectorProps {
  destinations: ItineraryDestination[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  destinations,
  selectedIndex,
  onChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex items-center overflow-x-auto">
      {destinations.map((destination, index) => (
        <button
          key={`${destination.city}-${destination.country}`}
          onClick={() => onChange(index)}
          className={`
            flex items-center gap-1 px-3 py-2 rounded-md mr-2 whitespace-nowrap
            transition-all duration-200 min-w-fit
            ${selectedIndex === index
              ? 'bg-rose-500 text-white font-medium'
              : 'hover:bg-neutral-100 text-neutral-700'
            }
          `}
        >
          <MdLocationOn size={18} />
          <span>
            {destination.city}, {destination.country}
          </span>
        </button>
      ))}
    </div>
  );
};

export default DestinationSelector; 