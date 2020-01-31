import React, { useContext, useEffect, useRef, useState } from 'react';
import { SearchContext } from '../contexts/SearchContext';

// token for fetching home data from estated
const ESTATED_TOKEN = process.env.REACT_APP_ESTATED_TOKEN;
// fix for cors problem
const PROXY_URL = "https://cors-anywhere.herokuapp.com/";

// CUSTOM HOOKS
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);
  
    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
};
  
const SearchForm = () => {
    const { address, city, state, zipcode } = useContext(SearchContext);
    const { setAddress, setCity, setState, setZipcode } = useContext(SearchContext);
  
    // state variables for api
    const [query, setQuery] = useState("");
    const [results, setResults] = useState();
    const GET_URL = `${PROXY_URL}https://apis.estated.com/v4/property?token=${ESTATED_TOKEN}&${query}`;
  
    useDidMountEffect(() => {
      console.log('fetch home data', GET_URL);
      fetch(GET_URL, { mode: "cors" })
        .then(res => res.json())
        .then(data => {
          console.log(">> data fetched", data);
          setResults([data]);
        })
        .catch(error => {
          console.log(">> get error,", error);
        });
    }, [GET_URL]);
  
    const handleSubmit = e => {
      e.preventDefault();
      const queryString = new URLSearchParams(new FormData(e.target)).toString();
      console.log("form submit data:", queryString);
      setQuery(queryString);
    };
  
    const handleReset = (e) => {
      e.preventDefault();
      setAddress('');
      setCity('');
      setState('');
      setZipcode('');
    };
  
    return (
      <>
        <form className="form" onSubmit={handleSubmit}>
            <div className="form__field">
                <label htmlFor="address">Street Address:</label>
                <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="form__input"
                id="address"
                name="street_address"
                placeholder="Ex. 123 Broadway"
                aria-required="true"
                required
                />
            </div>
            <div className="form__field">
                <label htmlFor="address">City:</label>
                <input
                type="text"
                value={city}
                className="form__input"
                id="city"
                name="city"
                placeholder="Ex. New York"
                aria-required="true"
                required
                />
            </div>
            <div className="form__field">
                <label htmlFor="address">State:</label>
                <input
                type="text"
                value={state}
                className="form__input"
                id="state"
                name="state"
                placeholder="Ex. NY"
                aria-required="true"
                required
                />
            </div>
            <div className="form__field">
                <label htmlFor="address">Zipcode:</label>
                <input
                type="text"
                value={zipcode}
                className="form__input"
                id="zip"
                name="zip_code"
                placeholder="Ex. 10047"
                />
            </div>
            <div className="form__field">
                <button type="reset" onClick={handleReset} id="clearForm" className="form__button">
                Clear
                </button>
                <button type="submit" className="form__button">
                Search
                </button>
            </div>
        </form>
        <div className="results">
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      </>
    );
  };

export default SearchForm;
