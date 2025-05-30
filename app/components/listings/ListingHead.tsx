"use client";
import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import Image from "next/image";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
   title: string;
   imageSrc: string;
   locationValue: string;
   id: string;
   currentUser?: SafeUser | null;
   city?: string;
}

const ListingHead: React.FC<ListingHeadProps> = ({
   title,
   imageSrc,
   locationValue,
   id,
   currentUser,
   city,
}) => {
   const { getByValue } = useCountries();
   const location = getByValue(locationValue);

   return (
      <>
         <Heading 
            title={title} 
            subtitle={city 
               ? `${city}, ${location?.label}`
               : location?.label
            } 
         />
         <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
            <Image alt={title} src={imageSrc} fill className="object-cover w-full" />
            <div className="absolute top-5 right-5">
               <HeartButton listingId={id} currentUser={currentUser} />
            </div>
         </div>
      </>
   );
};

export default ListingHead;
