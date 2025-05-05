"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { SafeUser } from "@/app/types";
import Container from "@/app/components/Container";
import Heading from "@/app/components/Heading";
import Button from "@/app/components/Button";
import Map from "@/app/components/Map";
import { searchPhotos } from "@/app/services/unsplash";
import useCities, { FormattedCity } from "@/app/hooks/useCities";
import { 
  MdArrowBack, 
  MdOutlineAddLocation, 
  MdCalendarMonth, 
  MdOutlineTravelExplore,
  MdOutlinePhotoCamera,
  MdLocationPin,
  MdPersonAdd
} from "react-icons/md";

interface CreateItineraryClientProps {
  currentUser: SafeUser;
}

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

const CreateItineraryClient: React.FC<CreateItineraryClientProps> = ({
  currentUser
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { searchWithSuggestions, getPopularCities } = useCities();
  
  // Form states
  const [tripName, setTripName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<{
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  }[]>([]);
  const [currentDestination, setCurrentDestination] = useState({
    city: "",
    country: "",
    coordinates: { lat: 0, lng: 0 }
  });
  const [searchResults, setSearchResults] = useState<{
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  }[]>([]);
  const [imagePreview, setImagePreview] = useState("/images/placeholder.jpg");
  
  // Unsplash photo states
  const [destinationPhotos, setDestinationPhotos] = useState<{[key: string]: UnsplashPhoto[]}>({});
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  
  // Add debounce for search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch photos for destinations when they change
  useEffect(() => {
    const fetchDestinationPhotos = async () => {
      if (destinations.length === 0) return;
      
      setIsLoadingPhotos(true);
      const newPhotos: {[key: string]: UnsplashPhoto[]} = {...destinationPhotos};
      
      // Only fetch photos for destinations that don't have photos yet
      for (const destination of destinations) {
        const key = destination.city;
        if (!newPhotos[key]) {
          try {
            const photos = await searchPhotos(key, 1, 3);
            if (photos.length > 0) {
              newPhotos[key] = photos;
              
              // Set the first destination's photo as default image preview if not set
              if (imagePreview === "/images/placeholder.jpg" && photos.length > 0) {
                setImagePreview(photos[0].urls.regular);
              }
            }
          } catch (error) {
            console.error(`Error fetching photos for ${key}:`, error);
          }
        }
      }
      
      setDestinationPhotos(newPhotos);
      setIsLoadingPhotos(false);
    };
    
    fetchDestinationPhotos();
  }, [destinations, destinationPhotos, imagePreview]);
  
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push("/itineraries");
    }
  };
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handleDestinationSearch = (query: string) => {
    // Update the search query state
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout to debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      // Get either popular cities or search results based on query
      const trimmedQuery = query.trim();
      
      if (trimmedQuery.length === 0) {
        // For empty query, show popular cities
        const popularResults = getPopularCities().map(city => ({
          city: city.city,
          country: city.country,
          coordinates: { lat: city.coordinates.lat, lng: city.coordinates.lng }
        }));
        setSearchResults(popularResults.slice(0, 5));
      } else {
        // For any search query, only show matching cities
        console.log("Searching for:", trimmedQuery); // Debug log
        const results = searchWithSuggestions(trimmedQuery, 7);
        console.log("Search results:", results.length); // Debug log
        
        if (results.length === 0) {
          console.log("No results found for:", trimmedQuery); // Debug log
        }
        
        const formattedResults = results.map((result: FormattedCity) => ({
          city: result.city,
          country: result.country,
          coordinates: { lat: result.coordinates.lat, lng: result.coordinates.lng }
        }));
        
        setSearchResults(formattedResults);
      }
    }, 300); // 300ms debounce
  };
  
  // Load popular cities only once when component mounts - with proper dependencies
  useEffect(() => {
    // Only load popular cities once on initial mount
    const popularResults = getPopularCities().map(city => ({
      city: city.city,
      country: city.country,
      coordinates: { 
        lat: city.coordinates.lat, 
        lng: city.coordinates.lng
      }
    }));
    
    console.log("Setting initial popular cities");
    setSearchResults(popularResults.slice(0, 5));
    
    // The empty dependency array ensures this only runs once on component mount
  }, []);

  const addDestination = (destination: typeof currentDestination) => {
    // Add the destination to the list
    setDestinations([...destinations, destination]);
    
    // Reset the current destination
    setCurrentDestination({ city: "", country: "", coordinates: { lat: 0, lng: 0 } });
    
    // Clear the search query and results
    setSearchQuery("");
    setSearchResults([]);
    
    // Cancel any pending search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };
  
  const removeDestination = (index: number) => {
    const newDestinations = [...destinations];
    newDestinations.splice(index, 1);
    setDestinations(newDestinations);
  };
  
  const handleCreateItinerary = () => {
    setIsLoading(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Itinerary created successfully!");
      router.push("/itineraries");
    }, 1500);
  };
  
  // Function to set the selected image as the preview
  const selectImageAsPreview = (photoUrl: string) => {
    setImagePreview(photoUrl);
  };

  // Function to search for photos for a specific query
  const handlePhotoSearch = async (query: string) => {
    try {
      setIsLoadingPhotos(true);
      const photos = await searchPhotos(query, 1, 3);
      setIsLoadingPhotos(false);
      
      if (photos.length > 0) {
        // Update the destination photos and set first one as preview
        const newPhotos = {...destinationPhotos};
        newPhotos[query] = photos;
        setDestinationPhotos(newPhotos);
        setImagePreview(photos[0].urls.regular);
      }
    } catch (error) {
      setIsLoadingPhotos(false);
      console.error(`Error searching photos for ${query}:`, error);
    }
  };
  
  return (
    <Container>
      <div className="pt-24 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-full hover:bg-neutral-100 transition"
          >
            <MdArrowBack size={24} />
          </button>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">Create New Itinerary</h1>
            <p className="text-neutral-500">
              {step === 1 && "Start planning your dream trip"}
              {step === 2 && "Select your destinations"}
              {step === 3 && "Choose your dates"}
              {step === 4 && "Add finishing touches"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-neutral-200'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-neutral-200'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-neutral-200'}`}></div>
              <div className={`w-3 h-3 rounded-full ${step >= 4 ? 'bg-rose-500' : 'bg-neutral-200'}`}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          {step === 1 && (
            <div className="p-6">
              <div className="mb-8">
                <Heading title="Name your trip" subtitle="Give your itinerary a memorable name" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Trip Name</label>
                    <input
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                      placeholder="Summer in Europe"
                      className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-8">
                    <div className="w-full">
                      <Button
                        label="Next: Choose Destinations"
                        onClick={handleNext}
                        disabled={!tripName}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="h-full flex items-center justify-center">
                    <div className="p-4 bg-neutral-50 rounded-xl w-full max-w-xs">
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                        <Image
                          fill
                          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                          alt="Trip inspiration"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-neutral-500">
                          Your journey begins with a name. Make it memorable!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="p-6">
              <div className="mb-8">
                <Heading title="Where are you going?" subtitle="Add the destinations you'll visit on your trip" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Search for a destination</label>
                    <div className="relative">
                      <input
                        value={searchQuery}
                        onChange={(e) => handleDestinationSearch(e.target.value)}
                        placeholder="Type a city or country name (e.g. Paris)"
                        className="w-full p-3 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <MdLocationPin size={20} className="absolute left-3 top-3.5 text-neutral-400" />
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="mt-2 bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-md max-h-60 overflow-y-auto z-10 relative">
                        {searchResults.map((result, index) => (
                          <div 
                            key={`${result.city}-${index}`}
                            className="p-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                            onClick={() => {
                              // Set the selected destination
                              setCurrentDestination(result);
                              
                              // Update the search input with the selected destination
                              setSearchQuery(`${result.city}, ${result.country}`);
                              
                              // Clear search results immediately
                              setSearchResults([]);
                              
                              // Cancel any pending search to prevent results from reappearing
                              if (searchTimeoutRef.current) {
                                clearTimeout(searchTimeoutRef.current);
                                searchTimeoutRef.current = null;
                              }
                              
                              console.log("Selected destination:", result.city, result.country);
                            }}
                          >
                            <div className="font-medium">{result.city}</div>
                            <div className="text-sm text-neutral-500">{result.country}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-neutral-500 mt-1">
                      Type at least 2 characters to see suggestions
                    </div>
                  </div>
                  
                  {currentDestination.city && (
                    <div className="mb-4">
                      <button
                        onClick={() => addDestination(currentDestination)}
                        className="w-full p-2 flex items-center justify-center gap-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 border border-rose-200"
                      >
                        <MdOutlineAddLocation size={20} />
                        <span>Add {currentDestination.city} to your trip</span>
                      </button>
                    </div>
                  )}
                  
                  {destinations.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-2">Your destinations</label>
                      <div className="space-y-2">
                        {destinations.map((dest, index) => (
                          <div key={index} className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-8 h-8 bg-rose-100 text-rose-500 rounded-full">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{dest.city}</div>
                                <div className="text-sm text-neutral-500">{dest.country}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeDestination(index)}
                              className="text-neutral-400 hover:text-rose-500 p-1"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-8">
                    <div className="flex-1">
                      <Button
                        outline
                        label="Back"
                        onClick={handleGoBack}
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        label="Next: Select Dates"
                        onClick={handleNext}
                        disabled={destinations.length === 0}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="h-[400px] bg-neutral-100 rounded-lg overflow-hidden">
                    <Map center={currentDestination.city ? [currentDestination.coordinates.lat, currentDestination.coordinates.lng] : undefined} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="p-6">
              <div className="mb-8">
                <Heading title="When will you travel?" subtitle="Choose the dates for your trip" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <MdCalendarMonth size={20} className="absolute left-3 top-3.5 text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full p-3 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <MdCalendarMonth size={20} className="absolute left-3 top-3.5 text-neutral-400" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-8">
                    <div className="flex-1">
                      <Button
                        outline
                        label="Back"
                        onClick={handleGoBack}
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        label="Next: Final Details"
                        onClick={handleNext}
                        disabled={!startDate || !endDate}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="bg-neutral-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4">Trip Overview</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center w-10 h-10 bg-rose-100 text-rose-500 rounded-full">
                          <MdOutlineTravelExplore size={20} />
                        </div>
                        <div>
                          <div className="font-medium">{tripName}</div>
                          <div className="text-sm text-neutral-500">
                            {startDate && endDate ? (
                              `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`
                            ) : (
                              "Select your travel dates"
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-neutral-200">
                        <div className="text-sm font-medium mb-2">Destinations</div>
                        <div className="space-y-2">
                          {destinations.map((dest, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-6 h-6 flex items-center justify-center bg-neutral-200 rounded-full text-xs">
                                {index + 1}
                              </div>
                              <div>{dest.city}, {dest.country}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="p-6">
              <div className="mb-8">
                <Heading title="Final Details" subtitle="Add the finishing touches to your itinerary" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                    <div className="relative">
                      <div className="border border-neutral-300 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-neutral-50">
                        <MdOutlinePhotoCamera size={24} className="mx-auto mb-2 text-neutral-400" />
                        <p className="text-sm text-neutral-600">Click to upload a cover image</p>
                        <p className="text-xs text-neutral-500 mt-1">(Or use one of our suggestions below)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">Suggested Photos</div>
                    <div className="grid grid-cols-3 gap-2">
                      {isLoadingPhotos ? (
                        <div className="col-span-3 py-4 text-center text-neutral-500">
                          Loading photos...
                        </div>
                      ) : (
                        destinations.slice(0, 3).map((dest, index) => {
                          const photos = destinationPhotos[dest.city] || [];
                          const photoUrl = photos.length > 0 
                            ? photos[0].urls.regular 
                            : `/images/placeholder.jpg`;
                          
                          return (
                            <div 
                              key={index} 
                              className="aspect-video relative rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => selectImageAsPreview(photoUrl)}
                            >
                              <Image
                                fill
                                src={photoUrl}
                                alt={dest.city}
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                                {dest.city}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">Search for Photos</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="E.g. beach, mountain, adventure"
                        className="flex-grow p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handlePhotoSearch((e.target as HTMLInputElement).value);
                          }
                        }}
                      />
                      <Button 
                        label="Search" 
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="E.g. beach, mountain, adventure"]') as HTMLInputElement;
                          if (input) handlePhotoSearch(input.value);
                        }}
                        small
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Travel Budget (optional)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="5000"
                        className="w-full p-3 pl-6 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-neutral-500">$</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Travel Companions (optional)</label>
                    <div className="relative">
                      <input
                        placeholder="Add email addresses"
                        className="w-full p-3 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <MdPersonAdd size={20} className="absolute left-3 top-3.5 text-neutral-400" />
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>
                  
                  <div className="flex gap-2 mt-8">
                    <div className="flex-1">
                      <Button
                        outline
                        label="Back"
                        onClick={handleGoBack}
                      />
                    </div>
                    <div className="flex-1">
                      <Button
                        label={isLoading ? "Creating..." : "Create Itinerary"}
                        onClick={handleCreateItinerary}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        fill
                        src={imagePreview}
                        alt="Trip Cover"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{tripName}</h3>
                      <p className="text-neutral-500 text-sm mb-3">
                        {startDate && endDate ? (
                          `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`
                        ) : (
                          "Select your travel dates"
                        )}
                      </p>
                      
                      <div className="space-y-3 pt-3 border-t border-neutral-100">
                        <div className="text-sm text-neutral-700">
                          {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {destinations.map((dest, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                              {dest.city}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CreateItineraryClient; 