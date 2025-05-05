import { Country, State, City, ICity } from 'country-state-city';

// Define the return type for our formatted cities
export interface FormattedCity {
  city: string;
  country: string; 
  coordinates: { 
    lat: number;
    lng: number;
  };
  searchField: string;
}

// Format a city from the package format to our app format
const formatCity = (city: ICity, countryCode: string): FormattedCity => {
  const country = Country.getCountryByCode(countryCode);
  return {
    city: city.name,
    country: country?.name || 'Unknown',
    coordinates: {
      lat: parseFloat(city.latitude || '0'),
      lng: parseFloat(city.longitude || '0')
    },
    searchField: `${city.name.toLowerCase()}, ${country?.name.toLowerCase() || ''}`
  };
};

const useCities = () => {
  // Get all countries
  const getAllCountries = () => {
    return Country.getAllCountries();
  };
  
  // Get all cities for a country
  const getCitiesByCountry = (countryCode: string): FormattedCity[] => {
    const cities = City.getCitiesOfCountry(countryCode) || [];
    return cities.map(city => formatCity(city, countryCode));
  };
  
  // Search cities across all countries (computationally expensive)
  const searchCities = (query: string, limit: number = 10): FormattedCity[] => {
    query = query.toLowerCase().trim();
    
    // Return empty array for empty query
    if (query.length === 0) return [];
    
    const results: FormattedCity[] = [];
    
    // Get all countries to search through
    const countries = Country.getAllCountries();
    
    // For each country, search cities until we find enough matches
    for (const country of countries) {
      if (results.length >= limit) break;
      
      // Get cities for this country
      const cities = City.getCitiesOfCountry(country.isoCode) || [];
      
      // Find cities that match the query
      const matchingCities = cities.filter(city => 
        city.name.toLowerCase().includes(query)
      );
      
      // Add matching cities to results
      for (const city of matchingCities) {
        if (results.length >= limit) break;
        results.push(formatCity(city, country.isoCode));
      }
    }
    
    return results;
  };
  
  // Get popular cities (predefined list of major cities)
  const getPopularCities = (): FormattedCity[] => {
    const popularCities = [
      { name: 'London', countryCode: 'GB' },
      { name: 'New York', countryCode: 'US' },
      { name: 'Paris', countryCode: 'FR' },
      { name: 'Tokyo', countryCode: 'JP' },
      { name: 'Sydney', countryCode: 'AU' },
      { name: 'Rome', countryCode: 'IT' },
      { name: 'Barcelona', countryCode: 'ES' },
      { name: 'Dubai', countryCode: 'AE' },
      { name: 'Singapore', countryCode: 'SG' },
      { name: 'Hong Kong', countryCode: 'HK' }
    ];
    
    const results: FormattedCity[] = [];
    
    for (const popularCity of popularCities) {
      const cities = City.getCitiesOfCountry(popularCity.countryCode) || [];
      const city = cities.find(c => c.name === popularCity.name);
      
      if (city) {
        results.push(formatCity(city, popularCity.countryCode));
      }
    }
    
    return results;
  };
  
  // COMPLETELY SIMPLIFIED - only returns search results for non-empty queries
  const searchWithSuggestions = (query: string, limit: number = 10): FormattedCity[] => {
    // Ensure query is trimmed
    const trimmedQuery = query.trim();
    
    // For empty queries, return popular cities
    if (trimmedQuery.length === 0) {
      return getPopularCities().slice(0, limit);
    }
    
    // For any non-empty query, ONLY return exact search matches
    return searchCities(trimmedQuery, limit);
  };
  
  return {
    getAllCountries,
    getCitiesByCountry,
    searchCities,
    getPopularCities,
    searchWithSuggestions
  };
};

export default useCities; 