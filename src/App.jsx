import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  //DEFINE API KEY  
  const API_KEY = '6b74ee54d236dccd7eb5aaf18a008477'

  //WHEN THE COUNTRY IS SELECTED => FETCH THE WEATHER
  useEffect(() => {
    if (selectedCountry && selectedCountry.capital) {
      const capital = selectedCountry.capital[0];
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        })
        .catch((error) => {
          console.error(error);
          setWeather(null);
        });
    }
  }, [selectedCountry]);

  // Add Handlers beside country's name
  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  //Close the handler
  const handleClose = () => {
    setSelectedCountry(null)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const filtered = response.data.filter(c =>
          c.name.common.toLowerCase().includes(query.toLowerCase())
        )
        setCountries(filtered)
        setError(null)

        if (filtered.length === 1) {
          setSelectedCountry(filtered[0])
        } else {
          setSelectedCountry(null)
        }
      })
      .catch(() => {
        setCountries([])
        setError('Country not found or API error')
      })
  }

  return (
    <div>
      <h1>Country's Information</h1>
      <p className="welcome">Welcome to the Country's Information application!</p>

      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search the Country</button>
      </form>

      {error ? <p>{error}</p> : null}

      {/* when a country is selected */}
      {selectedCountry ? (
        <div>
        <div className="info-container">
          <div className="info-country">
            <h2>{selectedCountry.name.common}</h2>
            <p>Capital: {selectedCountry.capital ? selectedCountry.capital.join(', ') : '-'}</p>
            <p>Area: {selectedCountry.area} km²</p>
            <p>Languages: {selectedCountry.languages ? Object.values(selectedCountry.languages).join(', ') : '-'}</p>

          {selectedCountry.flags?.png && (
            <img
              src={selectedCountry.flags.png}
              alt={`Flag of ${selectedCountry.name.common}`}
              width="200"
            />
          )}
          </div>

          {/* weather info */}
          {weather && (
            <div className="info-weather">
              <h3>Weather in {selectedCountry.capital[0]}</h3>
              <p>Temprature: {weather.main.temp} Celsius</p>
              <p>Feels like: {weather.main.feels_like} Celsius</p>
              <p>Condition: {weather.weather[0].description}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather icon"
                width="200"
                height="200"
              />
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          )}
        </div>

            {/* Back button */}
          <div className="back-button">
            <button type="button" onClick={handleClose}>Back to results</button>
          </div>
        </div>
      ) : null}

      {/* search results */}
      {countries.length > 10 ? (
        <p>Too many matches found, please specify more filter!</p>
      ) : countries.length > 1 ? (
        <ul>
          {countries.map(c => (
            <li key={c.name.common}>
              {c.name.common}
              <button
                type="button"
                onClick={() => handleShow(c)}
              >
                Show
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default App
