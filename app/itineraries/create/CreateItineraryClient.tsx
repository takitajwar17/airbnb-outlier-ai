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
  const [loadingStep, setLoadingStep] = useState(0);
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
    setLoadingStep(1);
    
    // Simulate a multi-step processing workflow with timeouts
    setTimeout(() => {
      setLoadingStep(2);
      
      setTimeout(() => {
        setLoadingStep(3);
        
        setTimeout(() => {
          setLoadingStep(4);
          
          setTimeout(() => {
            // Generate a unique ID for the new itinerary
            const itineraryId = `itin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            
            setIsLoading(false);
            setLoadingStep(0);
            toast.success("Your AI-powered travel itinerary has been created successfully!");
            
            // Redirect to the specific itinerary page instead of the list
            router.push(`/itineraries/${itineraryId}`);
          }, 1200);
        }, 1000);
      }, 1000);
    }, 1200);
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
  
  // Add a loading indicator component for the budget analysis
  const BudgetAnalysis = () => (
    <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
        <p className="text-sm font-medium text-neutral-700">AI Budget Analysis</p>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-3/4"></div>
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-1/2"></div>
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-5/6"></div>
      </div>
    </div>
  );

  // Add a component for AI-recommended activities
  const RecommendedActivities = ({ destination }: { destination: string }) => (
    <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-neutral-700">AI-Recommended for {destination}</p>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-neutral-500">Analyzing...</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-full"></div>
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-3/4"></div>
        <div className="h-2 bg-neutral-200 rounded animate-pulse w-5/6"></div>
      </div>
    </div>
  );

  // Add loading indicator component
  const LoadingScreen = ({ currentStep }: { currentStep: number }) => {
    const steps = [
      { id: 1, text: "Analyzing your destinations and optimizing your itinerary..." },
      { id: 2, text: "Generating travel routes and calculating optimal visit order..." },
      { id: 3, text: "Finding best accommodation options based on your preferences..." },
      { id: 4, text: "Finalizing personalized itinerary with local recommendations..." }
    ];

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-block p-3 bg-rose-100 rounded-full mb-4">
              <MdOutlineTravelExplore size={32} className="text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Creating Your Itinerary</h2>
            <p className="text-neutral-500">Our AI is crafting your perfect travel experience</p>
          </div>
          
          <div className="space-y-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-3 p-3 rounded-lg ${currentStep >= step.id ? 'bg-rose-50' : 'bg-neutral-50'}`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-neutral-200'
                }`}>
                  {currentStep > step.id ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : currentStep === step.id ? (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  ) : (
                    step.id
                  )}
                </div>
                <div className={`text-sm ${currentStep >= step.id ? 'text-neutral-800 font-medium' : 'text-neutral-400'}`}>
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      {isLoading && <LoadingScreen currentStep={loadingStep} />}
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
                <Heading title="Name your adventure" subtitle="Our AI will create a personalized itinerary based on your trip name" />
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
                <Heading title="Where would you like to explore?" subtitle="Our travel engine will analyze and optimize your multi-city journey" />
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
                      <label className="block text-sm font-medium mb-2">
                        Your intelligent journey route
                        <span className="ml-2 text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">AI Optimized</span>
                      </label>
                      <div className="space-y-4">
                        {destinations.map((dest, index) => (
                          <div key={index} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                            <div className="flex items-center justify-between mb-2">
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
                            
                            {/* Add AI recommendation component */}
                            <RecommendedActivities destination={dest.city} />
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
                <Heading title="When will you travel?" subtitle="Our system will check for seasonal events and local festivals during your dates" />
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
                <Heading title="Final Touches" subtitle="We'll use these preferences to enhance your personalized travel experience" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Cover Image</label>
                    <div className="relative">
                      <div className="border border-neutral-300 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-neutral-50">
                        <MdOutlinePhotoCamera size={24} className="mx-auto mb-2 text-neutral-400" />
                        <p className="text-sm text-neutral-600">Click to upload a cover image</p>
                        <p className="text-xs text-neutral-500 mt-1">(Or use one of our AI-suggested photos below)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">AI-Recommended Visuals</div>
                      <span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full">Smart Selection</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {isLoadingPhotos ? (
                        <div className="col-span-3 py-4 text-center text-neutral-500">
                          <div className="inline-block animate-spin mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                          </div>
                          Curating your perfect travel visuals...
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
                              className="aspect-video relative rounded-lg overflow-hidden cursor-pointer group"
                              onClick={() => selectImageAsPreview(photoUrl)}
                            >
                              <Image
                                fill
                                src={photoUrl}
                                alt={dest.city}
                                className="object-cover transition-transform group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 group-hover:opacity-90 transition-opacity"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                                <div className="text-sm font-medium">{dest.city}</div>
                                <div className="text-xs opacity-80">{dest.country}</div>
                              </div>
                              <div className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] p-1 rounded">
                                AI PICK
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">Discover More Visuals</div>
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
                    <label className="block text-sm font-medium mb-2">Travel Budget & AI Cost Analysis</label>
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
                    <p className="text-xs text-neutral-500 mt-1">
                      Our AI will analyze costs for accommodation, transportation, and activities
                    </p>
                    
                    {/* Add budget analysis component */}
                    <BudgetAnalysis />
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
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Smart Preferences</label>
                      <span className="text-xs bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full">AI Enhanced</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white border border-neutral-200 rounded-lg">
                        <input type="checkbox" id="localCuisine" className="rounded text-rose-500 focus:ring-rose-500" />
                        <label htmlFor="localCuisine" className="text-sm">Prioritize local cuisine experiences</label>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-white border border-neutral-200 rounded-lg">
                        <input type="checkbox" id="hiddenGems" className="rounded text-rose-500 focus:ring-rose-500" />
                        <label htmlFor="hiddenGems" className="text-sm">Discover hidden gems beyond tourist spots</label>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-white border border-neutral-200 rounded-lg">
                        <input type="checkbox" id="culturalEvents" className="rounded text-rose-500 focus:ring-rose-500" />
                        <label htmlFor="culturalEvents" className="text-sm">Include cultural events and activities</label>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-white border border-neutral-200 rounded-lg">
                        <input type="checkbox" id="ecofriendly" className="rounded text-rose-500 focus:ring-rose-500" />
                        <label htmlFor="ecofriendly" className="text-sm">Eco-friendly accommodations and transport</label>
                      </div>
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
                        label={isLoading ? "Creating your AI itinerary..." : "Generate Smart Itinerary"}
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
                      <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                        AI Enhanced
                      </div>
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
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-neutral-700">
                            {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}
                          </div>
                          <div className="text-xs text-neutral-500">AI-optimized route</div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {destinations.map((dest, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                              {dest.city}
                            </span>
                          ))}
                        </div>
                        
                        <div className="pt-3">
                          <div className="text-sm font-medium text-neutral-700 mb-2">AI Travel Insights</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                              </div>
                              <p className="text-xs text-neutral-600">Best time to visit destinations identified</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                                </svg>
                              </div>
                              <p className="text-xs text-neutral-600">Budget-optimized accommodations</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                </svg>
                              </div>
                              <p className="text-xs text-neutral-600">Local experiences and attractions</p>
                            </div>
                          </div>
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