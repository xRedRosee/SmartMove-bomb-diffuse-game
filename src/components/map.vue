<template>
    <div style="width: 100vw; height: 92vh;">
        <GMapMap :center="{ lat: 51.5719149, lng: 4.768323 }" :zoom="12" map-type-id="terrain"
            style="width: 100%; height:92vh;" :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false
            }">
            <GMapMarker v-for="(location, index) in locations" :key="index"
                :position="{ lat: location.latitude, lng: location.longitude }" :icon='{
                    url: "./smartstone-white.png",
                    scaledSize: {
                        width: 20, height: 40
                    },
                    labelOrigin: { x: 10, y: 25 }

                }' :label="{ text: '' + (index + 1), color: ' white', fontWeight: 'bold', fontSize: '10px' }" />
        </GMapMap>
    </div>
</template>
<script>
export default {
    name: 'Map',
    props: {
        locations: Array,

    },


}
</script>
<style></style>