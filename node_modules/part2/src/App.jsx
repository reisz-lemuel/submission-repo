import { useState, useEffect } from 'react';
import countryService from './services/countries'
import CountryFilter from './components/CountryFilter';
import Content from './components/Content';
import countries from './services/countries';
const App = () => {
  const [filter, setFilter] = useState("");
  const [allCountries, setAllCountries] =useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    countryService.getAllCountries().then((response) => {
      setAllCountries(response.data)
      console.log(response.data)
    });
  },[]);

  const handleFilter = (event) => {
    const newFilter = event.target.value
    const countries = newFilter.trim().length === 0
    ? allCountries
    : allCountries.filter((country) => 
      country.name.common
      .toLowerCase()
      .includes(newFilter.trim().toLowerCase())
     );
    setFilter(newFilter);
    setFilteredCountries(countries);
  }
  const selectCountry = (country) => {
    setFilteredCountries([country])
  }
  return (
    <div>
      <CountryFilter filter={filter} handleFilter={handleFilter}/>
      <Content countries={filteredCountries} selectCountry={selectCountry}/>
    </div>
  )
}

export default App;