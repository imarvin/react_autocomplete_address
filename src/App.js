import React, { createContext, useContext, useState, useEffect, useRef } from "react";
//import useAddressPredictions from "./useAddressPredictions";
import Geocoder from "react-mapbox-gl-geocoder";
import SearchIcon from "@material-ui/icons/Search";
import "./App.scss";

// token for address autocomplete search https://github.com/groinder/react-mapbox-gl-geocoder
//   token is from their demo in https://www.npmjs.com/package/react-map-gl-geocoder
const MAPBOX_TOKEN = "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA";
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

// CONTEXTS
const SearchContext = createContext();
const SearchContextProvider = (props) => {
  // state variables for estated form search
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");

  const providerValue = React.useMemo(() => ({
      address, setAddress,
      city, setCity,
      state, setState,
      zipcode, setZipcode
  }), [address, state, city, zipcode]);

  return (
    <SearchContext.Provider value={providerValue}>
      {props.children}
    </SearchContext.Provider>
  )
}

// COMPONENTS

// nav component with address autocomplete search
const Nav = () => {
  const { setAddress, setCity, setState, setZipcode } = useContext(SearchContext);

  // parse address from api json data
  const parseAddress = data => {
    let city, state, zipcode;
    if (data.context) {
      data.context.forEach((v, i) => {
        if (v.id.indexOf("place") >= 0) {
          city = v.text;
        }
        if (v.id.indexOf("region") >= 0) {
          state = v.short_code.split("-")[1];
        }
        if (v.id.indexOf("postcode") >= 0) {
          zipcode = v.text;
        }
      });
    }

    return {
      street_number: data.address,
      street_name: data.text,
      street_address: `${data.address} ${data.text}`,
      city,
      state,
      zipcode
    };
  };

  const onSelected = (_, item) => {
    const data = parseAddress(item);
    const { street_address, city, state, zipcode } = data;
    setAddress(street_address);
    setCity(city);
    setState(state);
    setZipcode(zipcode);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav__search-wrapper">
          <SearchIcon className="nav__search-icon" />
          <Geocoder
            mapboxApiAccessToken={MAPBOX_TOKEN}
            onSelected={onSelected}
            hideOnSelect={true}
            updateInputOnSelect={true}
            viewport={{}}
            queryParams={{
              country: "us",
              types: "address"
            }}
            className="nav__search"
            placeholder="search"
          >
            <input placeHolder="search" />
          </Geocoder>
        </div>
      </nav>
    </>
  )
};

// search form
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

export default function App() {
  return (
    <div className="App">
      <SearchContextProvider>
        <Nav />
        <main className="main">
          <SearchForm />
        </main>
      </SearchContextProvider>
    </div>
  );
}
