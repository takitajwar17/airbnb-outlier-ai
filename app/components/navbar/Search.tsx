"use client";

import useCountries from "@/app/hooks/useCountries";
import useSearchModal from "@/app/hooks/useSearch";
import { BiSearch } from "@react-icons/all-files/bi/BiSearch";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Search = () => {
   const searchModal = useSearchModal();
   const params = useSearchParams();
   const { getByValue } = useCountries();

   const locationValue = params?.get("locationValue");
   const city = params?.get("city");
   const searchTerm = params?.get("searchTerm");
   const startDate = params?.get("startDate");
   const endDate = params?.get("endDate");
   const guestCount = params?.get("guestCount");

   const locationLabel = useMemo(() => {
      if (searchTerm) {
         return searchTerm;
      }
      
      if (locationValue) {
         const country = getByValue(locationValue as string)?.label;
         if (city) {
            return `${city}, ${country}`;
         }
         return country;
      }
      return "Anywhere";
   }, [getByValue, locationValue, city, searchTerm]);

   const durationLabel = useMemo(() => {
      if (startDate && endDate) {
         const start = new Date(startDate as string);
         const end = new Date(endDate as string);
         let diff = differenceInDays(end, start);

         if (diff === 0) {
            diff = 1;
         }
         return `${diff} days`;
      }
      return "Any week";
   }, [startDate, endDate]);

   const guestLabe = useMemo(() => {
      if (guestCount) {
         return `${guestCount} guests`;
      }
      return "Add Guests";
   }, [guestCount]);

   return (
      <div
         onClick={searchModal.onOpen}
         className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
      >
         <div className="flex flex-row items-center justify-between">
            <div className="text-sm font-semibold px-6 whitespace-nowrap">{locationLabel}</div>
            <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center whitespace-nowrap">
               {durationLabel}
            </div>
            <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
               <div className="hidden sm:block whitespace-nowrap">{guestLabe}</div>
               <div className="p-2 bg-rose-500 rounded-full text-white">
                  <BiSearch size={18} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Search;
