import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

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

export default SearchContextProvider;