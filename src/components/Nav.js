import React, { useContext } from 'react';
import Geocoder from "react-mapbox-gl-geocoder";
import SearchIcon from "@material-ui/icons/Search";
import { SearchContext } from '../contexts/SearchContext';

// token for address autocomplete search https://github.com/groinder/react-mapbox-gl-geocoder
//   token is from their demo in https://www.npmjs.com/package/react-map-gl-geocoder
const MAPBOX_TOKEN = "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA";

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

  export default Nav;
