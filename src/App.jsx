import React, { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return

    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        const filtered = response.data.filter (c =>
        c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setCountries(filtered)
    setError(null)
  })
      .catch(() => {
        setCountries([])
        setError('Country not found or API error')
      })
  }

  return (
    <div className="app">
      <h1>Country's Information</h1>
      <p>Welcome to the Country's Information application!</p>

      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search the Country</button>
      </form>

      {error ? <p>{error}</p> : null}

      {countries.length > 10 ? (
        <p>Too many matches found, specify another filter!</p>
      ) : countries.length > 1 ? (
        <ul>
          {countries.map(c => (
            <li key={c.name.common}>{c.name.common}</li>
          ))}
        </ul>
      ) : countries.length === 1 ? (
        <div>
          <h2>{countries[0].name.common}</h2>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area} km²</p>
          <p>Languages: {Object.values(countries[0].languages).join(', ')}</p>
          <img
            src={countries[0].flags.png}
            alt={`Flag of ${countries[0].name.common}`}
            width="150"
          />
        </div>
      ) : null}
    </div>
  )
}

export default App
