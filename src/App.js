import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow,
    
} from "react-google-maps";
import * as capitalData from "./data/capitals.json";
import mapStyles from "./mapStyles";
import axios from 'axios';
import Geocode from 'react-geocode';

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDPDmmOae3HvK1VGfKIu_fZEADkcfzh8gc");

// set response language. Defaults to english.
Geocode.setLanguage("es");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
//Geocode.setRegion("es");

// Enable or disable logs. Its optional.
Geocode.enableDebug();

function Map() {
  const [selectedCapital, setSelectedCapital] = useState(null);
  const [temp, setTemp] = useState(null);
  const [season, setSeason] = useState(null);
 
    useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedCapital(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
    
    // get the season taking month of the year and latitude, consider equator as south
    const getSeason = (latitude) =>{
        const d = new Date()
        let s= ['Summer', 'Autumn', 'Winter', 'Spring'][Math.floor((d.getMonth() / 12 * 4)) % 4]
        if (latitude>0){  //north hemisphere
            s = ['Winter', 'Spring', 'Summer', 'Autumn'][Math.floor((d.getMonth() / 12 * 4)) % 4]
        }
      return s; 
    }

    const handleClick = (event) => {
    const late = event.latLng.lat().toFixed(2);
    const lone = event.latLng.lng().toFixed(2);
    // Get address from latidude & longitude.
    Geocode.fromLatLng(late.toString(), lone.toString()).then(  
        response => {
        const aCs = response.results[0].address_components;
        const obj = aCs.filter((aC) => aC.types[0] =='country');
        const countryCode = obj[0]['short_name'];
        const geometryClicked = capitalData.features.filter(
              (item) => item.id === countryCode) //Extract the countrycode 
        const lat = geometryClicked[0]['geometry']['coordinates'][1]
        const lon = geometryClicked[0]['geometry']['coordinates'][0]  
        const season = getSeason(lat);
        setSeason(season)    
        fetch(`http://localhost:5000/darksky/${lon}/${lat}`)
        .then(res => res.json())
        .then((data) => {
            setTemp(data.temp)  ;
            setSelectedCapital(geometryClicked[0]);                   
        })         
        .catch(console.log)       
        },
        error => {
          console.error(error);
         }
       );
    };  
    
  /*  
    const clickOnMarker = (selectedCapital) =>{
    const lat = selectedCapital.geometry.coordinates[1]
    const lon = selectedCapital.geometry.coordinates[0]  
   axios.get(`http://localhost:5000/darksky/${lon}/${lat}`,{ 'Content-Type': 'application/json',crossdomain: true })
    .then(res => {
       const t = res.data;   
        setTemp(t.temp)  
       return t.temp;

   })
   
};
   */ 
  return (
    <GoogleMap
      onClick={(e) => handleClick(e)}
      defaultZoom={2}
      defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
      defaultOptions={{ styles: mapStyles, 
                        disableDefaultUI: true,
                        mapTypeId: 'terrain',//google.maps.MapTypeId.TERRAIN,
                        scrollwheel: false,
                        gestureHandling: 'none',
          }}      
      >
        {(selectedCapital )&& (
        
        <InfoWindow
          onCloseClick={() => {
            setSelectedCapital(null);
          }}
          position={{
            lng: selectedCapital.geometry.coordinates[0],
            lat: selectedCapital.geometry.coordinates[1],
          }}
          //temperatura = {clickOnMarker(selectedCapital)}
        >
          
          <div>
            <h2>Country: {selectedCapital.properties.country}</h2>
            <p>Capital: {selectedCapital.properties.city}</p>
            <p> Temperature: {temp} </p>
            <p> Season: {season} </p>

          </div>
        </InfoWindow>
      )}
      
       /*   
      {capitalData.features.map(capital => (
        <Marker
          key={capital.properties.id}
          position={{
            lat: capital.geometry.coordinates[1],
            lng: capital.geometry.coordinates[0]
          }}
           onClick={() => {
            setSelectedCapital(capital);                   
          }}
          visible= {false} //true if wanna see markers
          icon={{    
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}
      */

      
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDPDmmOae3HvK1VGfKIu_fZEADkcfzh8gc'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}
