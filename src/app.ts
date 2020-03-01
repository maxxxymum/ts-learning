import axios from 'axios';

const form = document.querySelector('form')! as HTMLFormElement;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_MAPS_KEY = 'AIzaSyCak3AYFSUdv0aurGmCuHDMY1EXMMYjr1Q';

type GoogleGeocodingRespone = {
    results: {geometry: {location: {lat: number, lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value;

    axios.get<GoogleGeocodingRespone>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_MAPS_KEY}`
    ).then(response => {
        if (response.data.status !== 'OK') {
            throw new Error('Couldn\'t fetch location!');
        }

        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById('map')!, {
            center: coordinates,
            zoom: 16
          });

          new google.maps.Marker({
            position: coordinates,
            map: map
          });
    }).catch(error => {
        console.error(error);
    });
}

form.addEventListener('submit', searchAddressHandler);