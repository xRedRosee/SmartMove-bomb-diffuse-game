<template>
  <Header headerTitle="Bomb Diffuser" headerIntro="Select the mode you want to play."></Header>
  <main class="main-container">
    <div class="button-row">
      <router-link to="/singleplayer" class="router-link">
        <div class="select-button singleplayer">
          <div class="mode-text-container">
            <h3 class="mode-text">Singleplayer</h3>
            <p class="mode-description">Play alone</p>
          </div>
          <div class="select-big-circle right">
            <div class="select-small-circle singleplayer-circle-small">
              <img class="icon-image" src="../../public/singleplayer.svg">
            </div>
          </div>
        </div>
      </router-link>
      <router-link to="/multiplayer" class="router-link">
        <div class="select-button multiplayer">
          <div class="select-big-circle left">
            <div class="select-small-circle multiplayer-circle-small">
              <img class="icon-image" src="../../public/multiplayer.svg">

            </div>
          </div>
          <div class="mode-text-container right-container">
            <h3 class="mode-text"> Multiplayer</h3>
            <p class="mode-description"> Play together</p>
          </div>
        </div>
      </router-link>
    </div>
  </main>
</template>
<script>
import Header from '@/components/Header.vue';

export default {
  name: 'HomeView',
  components: { Header },
}
</script>
<style>
:root {
  --select-box-yellow: #E5B63C;
  --select-box-green: #487E00;
  --text-color: #ffffff;
  --background-color: #FAF8F4;
}

.header-title {
  color: black;
}

.main-container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
}

.button-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.router-link {
  width: 100%;
  display: flex;
  justify-content: center;
}

.select-button {
  position: relative;
  width: 80%;
  height: 15vh;
  padding: 5px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.singleplayer {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-color: var(--select-box-green);
}

.multiplayer {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  background-color: var(--select-box-yellow);

}

.select-big-circle {
  position: absolute;
  width: 50px;
  aspect-ratio: 1/1;
  border-radius: 80% 100% 100% 100%;
  background-color: var(--background-color);
  top: 0;
}

.select-small-circle {
  position: absolute;
  width: 38px;
  aspect-ratio: 1/1;
  border-radius: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.singleplayer-circle-small {
  background-color: var(--select-box-green);
}

.multiplayer-circle-small {
  background-color: var(--select-box-yellow);
}

.right {
  right: 0;
  transform: translate(25%, -10%);
}

.left {
  left: 0;
  transform: translate(-25%, -10%);

}

.mode-text {
  color: var(--text-color);
  font-size: 18px;
  margin: 0;
  padding: 0;

}

.mode-description {
  color: var(--text-color);
  font-size: 12px;
}

.icon-image {
  width: 22px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
