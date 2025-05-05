"use client";

import { useCallback } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { 
  Itinerary, 
  Activity, 
  Transportation, 
  Accommodation, 
  ItineraryDay 
} from "@/app/itineraries/types";
import { MdFlight, MdTrain, MdDirectionsBus, MdDirectionsCar, MdDirectionsBoat } from "react-icons/md";
import { BsAirplane } from "react-icons/bs";
import { IoMdBed } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";

interface ItineraryTimelineProps {
  itinerary: Itinerary;
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  // Create a flattened array of all days across all destinations
  const allDays = itinerary.destinations.flatMap(destination => destination.days);
  
  // Sort days by date
  const sortedDays = [...allDays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getTransportIcon = useCallback((type: string) => {
    switch (type) {
      case 'flight':
        return <BsAirplane size={18} />;
      case 'train':
        return <MdTrain size={18} />;
      case 'bus':
        return <MdDirectionsBus size={18} />;
      case 'car':
        return <MdDirectionsCar size={18} />;
      case 'ferry':
        return <MdDirectionsBoat size={18} />;
      default:
        return <MdFlight size={18} />;
    }
  }, []);
  
  const renderTransportation = (item: Transportation, index: number) => {
    return (
      <div key={item.id} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex justify-center items-center w-10 h-10 bg-blue-50 text-blue-500 rounded-full">
            {getTransportIcon(item.type)}
          </div>
          <div>
            <h4 className="font-medium">{item.provider}</h4>
            <p className="text-sm text-neutral-500">
              {item.confirmationCode && `Confirmation: ${item.confirmationCode}`}
            </p>
          </div>
        </div>
        
        <div className="ml-5 pl-5 border-l-2 border-dashed border-blue-200">
          <div className="flex items-start gap-2 mb-1">
            <div className="min-w-[80px] text-sm font-medium">
              {format(parseISO(item.departureTime), "h:mm a")}
            </div>
            <div>
              <p className="font-medium">{item.departureLocation}</p>
              {item.details && item.details.terminal && (
                <p className="text-sm text-neutral-500">
                  Terminal {item.details.terminal}, Gate {item.details.gate}
                </p>
              )}
            </div>
          </div>
          
          <div className="my-2 ml-[40px]">
            <div className="text-sm text-neutral-500">{item.duration}</div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="min-w-[80px] text-sm font-medium">
              {format(parseISO(item.arrivalTime), "h:mm a")}
            </div>
            <div>
              <p className="font-medium">{item.arrivalLocation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAccommodation = (item: Accommodation, index: number) => {
    return (
      <div key={item.id} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex justify-center items-center w-10 h-10 bg-green-50 text-green-500 rounded-full">
            <IoMdBed size={20} />
          </div>
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-neutral-500">{item.location}</p>
          </div>
        </div>
        
        <div className="ml-5 pl-5 border-l-2 border-green-200">
          <div className="flex gap-4 mt-2">
            <div className="w-1/3 aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                fill
                src={item.imageUrl}
                alt={item.name}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-500">Check-in</span>
                <span className="text-sm font-medium">
                  {format(parseISO(item.checkIn), "MMM d, h:mm a")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-500">Check-out</span>
                <span className="text-sm font-medium">
                  {format(parseISO(item.checkOut), "MMM d, h:mm a")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">Price</span>
                <span className="text-sm font-medium">${item.price}</span>
              </div>
              {item.confirmationCode && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-neutral-500">Confirmation</span>
                  <span className="text-sm font-medium">{item.confirmationCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderActivity = (item: Activity, index: number) => {
    return (
      <div key={item.id} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex justify-center items-center w-10 h-10 bg-rose-50 text-rose-500 rounded-full">
            <span className="text-sm font-medium">{item.time}</span>
          </div>
          <div>
            <h4 className="font-medium">{item.name}</h4>
            <p className="text-sm text-neutral-500">{item.location}</p>
          </div>
        </div>
        
        <div className="ml-5 pl-5 border-l-2 border-rose-200">
          <div className="flex gap-4 mt-2">
            <div className="w-1/3 aspect-[4/3] relative rounded-lg overflow-hidden">
              <Image
                fill
                src={item.imageUrl}
                alt={item.name}
                className="object-cover"
              />
              {item.bookingStatus && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center">
                  {item.bookingStatus === 'booked' ? 'Booked' : item.bookingStatus === 'saved' ? 'Saved' : 'Suggested'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-neutral-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">Duration</span>
                <span className="text-sm font-medium">{item.duration}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-neutral-500">Price</span>
                <span className="text-sm font-medium">
                  {item.price === 0 ? 'Free' : `$${item.price}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDayTimeline = (day: ItineraryDay, dayIndex: number) => {
    const date = new Date(day.date);
    const hasEvents = day.activities.length > 0 || day.transportation.length > 0 || day.accommodations.length > 0;
    
    // Combine all events and sort them chronologically
    const allEvents = [
      ...day.transportation.map(t => ({ type: 'transportation', item: t, time: t.departureTime })),
      ...day.accommodations.map(a => ({ type: 'accommodation', item: a, time: a.checkIn })),
      ...day.activities.map(a => ({ type: 'activity', item: a, time: `${a.date}T${a.time}:00` }))
    ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    return (
      <div key={day.date} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex justify-center items-center w-10 h-10 bg-neutral-100 rounded-full">
            <FaRegCalendarAlt size={16} />
          </div>
          <div>
            <h3 className="font-semibold">
              {format(date, "EEEE, MMMM d, yyyy")}
            </h3>
            <p className="text-sm text-neutral-500">
              Day {dayIndex + 1} of your trip
            </p>
          </div>
        </div>
        
        <div className="ml-5 pl-5">
          {hasEvents ? (
            <div>
              {allEvents.map((event, index) => {
                if (event.type === 'transportation') {
                  return renderTransportation(event.item as Transportation, index);
                } else if (event.type === 'accommodation') {
                  return renderAccommodation(event.item as Accommodation, index);
                } else {
                  return renderActivity(event.item as Activity, index);
                }
              })}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg p-4 text-center">
              <p className="text-neutral-500">No events planned for this day yet.</p>
              <p className="text-sm text-neutral-400 mt-1">Free day to explore on your own!</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6">
      {sortedDays.map((day, index) => renderDayTimeline(day, index))}
    </div>
  );
};

export default ItineraryTimeline; 