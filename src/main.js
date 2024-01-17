import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps';


const app = createApp(App)

app.use(router, )
app.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API_KEY,
  },
})
app.mount('#app')



// window.Game = {
//     initialize: (locationName, color, groupNr, modules, data, beaconRadius, gameData) => {
//         // Logic for storing this data here...
//     // alert("Initalize part")
//     // alert(JSON.parse(JSON.stringify({locationName, color, groupNr, modules, data, beaconRadius, gameData}), null, 3));

//     // alert(JSON.stringify({locationName, color, groupNr, modules, data, beaconRadius, gameData}));
//         // AppBridge.send(Codes.loadingSuccess, {});
//     },
//     receiveBeaconResponse: (uuid) => {
//         alert(`receiveBeacon ${uuid}`)
//     },
//     updateLocation: (lat, long) => {},
//     log: (message) => {
//         // alert("message ")
//     },
//     setGameObject: (gameObject) => {
//         // alert("Setgameobject")
//     },
    // showResults: (results) => {
//         // alert("showresult")
//     }
// };