"use client";

import qs from "query-string";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import useSearchModal from "@/app/hooks/useSearch";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";

enum STEPS {
   LOCATION = 0,
   DATE = 1,
   INFO = 2,
}

const SearchModal = () => {
   const router = useRouter();
   const searchModal = useSearchModal();
   const params = useSearchParams();

   const [step, setStep] = useState(STEPS.LOCATION);

   const [location, setLocation] = useState<CountrySelectValue>();
   const [city, setCity] = useState('');
   const [searchTerm, setSearchTerm] = useState('');
   const [guestCount, setGuestCount] = useState(1);
   const [roomCount, setRoomCount] = useState(1);
   const [bathroomCount, setBathroomCount] = useState(1);
   const [dateRange, setDateRange] = useState<Range>({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
   });

   const onBack = useCallback(() => {
      setStep((value) => value - 1);
   }, []);

   const onNext = useCallback(() => {
      setStep((value) => value + 1);
   }, []);

   const onSubmit = useCallback(async () => {
      if (step !== STEPS.INFO) {
         return onNext();
      }

      let currentQuery = {};

      if (params) {
         currentQuery = qs.parse(params.toString());
      }

      // Prepare query parameters
      const updatedQuery: any = {
         ...currentQuery,
         guestCount,
         roomCount,
         bathroomCount,
      };
      
      // If we have a search term (from the combined city/country input), use it
      if (searchTerm) {
         updatedQuery.searchTerm = searchTerm;
      } else {
         // Otherwise use the country selector and city input separately
         if (location) {
            updatedQuery.locationValue = location.value;
         }
         if (city) {
            updatedQuery.city = city;
         }
      }

      if (dateRange.startDate) {
         updatedQuery.startDate = formatISO(dateRange.startDate);
      }

      if (dateRange.endDate) {
         updatedQuery.endDate = formatISO(dateRange.endDate);
      }

      const url = qs.stringifyUrl(
         {
            url: "/",
            query: updatedQuery,
         },
         { skipNull: true }
      );

      setStep(STEPS.LOCATION);
      searchModal.onClose();
      router.push(url);
   }, [
      step,
      searchModal,
      location,
      city,
      searchTerm,
      router,
      guestCount,
      roomCount,
      dateRange,
      onNext,
      bathroomCount,
      params,
   ]);

   const actionLabel = useMemo(() => {
      if (step === STEPS.INFO) {
         return "Search";
      }

      return "Next";
   }, [step]);

   const secondaryActionLabel = useMemo(() => {
      if (step === STEPS.LOCATION) {
         return undefined;
      }

      return "Back";
   }, [step]);

   let bodyContent = (
      <div className="flex flex-col gap-8">
         <Heading title="Where do you wanna go?" subtitle="Find the perfect location!" />
         <div className="w-full relative mb-4">
            <input
               id="searchTerm"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search for any location..."
               className="peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 border-neutral-300 focus:border-neutral-800"
            />
         </div>
         <div className="flex flex-col gap-1">
            <div className="font-semibold text-neutral-600 text-center">-- OR --</div>
            <div className="text-sm text-neutral-500 text-center mb-4">Specify exact location</div>
         </div>
         <CountrySelect
            value={location}
            onChange={(value) => setLocation(value as CountrySelectValue)}
         />
         <div className="w-full relative">
            <input
               id="city"
               value={city}
               onChange={(e) => setCity(e.target.value)}
               placeholder="Enter city..."
               className="peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed pl-4 border-neutral-300 focus:border-neutral-800"
            />
         </div>
      </div>
   );

   if (step === STEPS.DATE) {
      bodyContent = (
         <div className="flex flex-col gap-8">
            <Heading title="When do you plan to go?" subtitle="Make sure everyone is free!" />
            <Calendar onChange={(value) => setDateRange(value.selection)} value={dateRange} />
         </div>
      );
   }

   if (step === STEPS.INFO) {
      bodyContent = (
         <div className="flex flex-col gap-8">
            <Heading title="More information" subtitle="Find your perfect place!" />
            <Counter
               onChange={(value) => setGuestCount(value)}
               value={guestCount}
               title="Guests"
               subTitle="How many guests are coming?"
            />
            <hr />
            <Counter
               onChange={(value) => setRoomCount(value)}
               value={roomCount}
               title="Rooms"
               subTitle="How many rooms do you need?"
            />
            <hr />
            <Counter
               onChange={(value) => {
                  setBathroomCount(value);
               }}
               value={bathroomCount}
               title="Bathrooms"
               subTitle="How many bahtrooms do you need?"
            />
         </div>
      );
   }

   return (
      <Modal
         isOpen={searchModal.isOpen}
         title="Filters"
         actionLabel={actionLabel}
         onSubmit={onSubmit}
         secondaryActionLabel={secondaryActionLabel}
         secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
         onClose={searchModal.onClose}
         body={bodyContent}
      />
   );
};

export default SearchModal;
