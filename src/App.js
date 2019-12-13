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

function Map() {
  const [selectedCapital, setSelectedCapital] = useState(null);
  const [temp, setTemp] = useState(null);
 
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

    const handleClick = (event) => {
    const late = event.latLng.lat().toFixed(2);
    const lone = event.latLng.lng().toFixed(2);
    fetch(`http://localhost:5000/darksky/${lone}/${late}`)
        .then(res => res.json())
        .then((data) => this.setState({ temp: data.temperature }))
        .catch(console.log)
      };
    
   const buscatemp = (capital) =>{
    const lat = capital.geometry.coordinates[1]
    const lon = capital.geometry.coordinates[0]  
   
      axios.get(`http://localhost:5000/darksky/${lon}/${lat}`)
    .then(res => {
       const t = res.data;
        setTemp(t.temp)  
       return JSON.stringify(t);
   }) 
       
   }
    
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
          icon={{
            scaledSize: new window.google.maps.Size(25, 25)
          }}
        />
      ))}

      {(selectedCapital )&& (
        
        
        <InfoWindow
          onCloseClick={() => {
            setSelectedCapital(null);
          }}
          position={{
            lng: selectedCapital.geometry.coordinates[0],
            lat: selectedCapital.geometry.coordinates[1],
          }}
          temperatura = {clickOnMarker(selectedCapital)}
          
        >
          
          <div>
            <h2>{selectedCapital.properties.country}</h2>
            <p>{selectedCapital.properties.city}</p>
            <p> Temp: {temp} </p>

          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAcjmpUPjxBN4YtFdzorpA5U2SRiZ1bnds'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}
