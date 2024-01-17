<template>
    <div class="endscreen-overlay">
        <article class="endscreen-container">
            <h1 class="endscreen-title"> {{ endscreenTitle }} </h1>
            <p class="endscreen-text"> {{ endscreenText }}</p>
            <img src="../assets/time-bomb.png" alt="bomb endscreen" class="bomb-image">
            <p v-if="diffusedInTime" class="diffuse-time"> Time: {{ diffuseTime }}</p>
            <img :src="endScreenImg" alt="image end screen" class="endscreen-image">
            <router-link to="/" v-if="this.diffusedInTime == true" class="endscreen-button"> Continue </router-link>
            <router-link to="/" v-else class="endscreen-button"> Try again </router-link>
        </article>
    </div>
</template>
<script>
export default {
    name: 'EndScreen',
    props: {
        endscreenTitle: String,
        endscreenText: String,
        endScreenImg: String,
        diffuseTime: String,
        diffusedInTime: Boolean
    }
}
</script>
<style scoped>
.endscreen-overlay {
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.endscreen-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.endscreen-title {
    font-weight: bold;
    font-size: 24px;
    color: white;
}

.endscreen-text {
    font-weight: bold;
    font-size: 16px;
    color: white;
    text-align: center;
}

.bomb-image {
    height: 128px;
}

.diffuse-time {
    font-size: 16px;
    color: white;
    text-align: center;
}

.endscreen-image {
    height: 200px;
}

.endscreen-button {
    outline: none;
    border: none;
    background-color: #64a70a;
    color: white;
    font-size: 20px;
    border-radius: 20px;
    padding: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
    justify-content: center;
}
</style>