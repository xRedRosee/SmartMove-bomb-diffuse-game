<template>
    <div class="collect-alert-container">
        <div class="alert">
            <p class="collected-text"> You have succesfully collected</p>
            <img :src="collectedItemImg" class="collected-img">
            <button class="okay-btn" @click="closeAlert()"> Continue </button>
        </div>
    </div>
</template>
<script>
export default {
    name: "CollectAlert",
    props: {
        collectedItemImg: String
    },
    methods: {
        closeAlert() {
            document.querySelector(".collect-alert-container").style.display = "none";
        }
    }
}
</script>
<style scoped>
.collect-alert-container {
    background-color: rgba(0, 0, 0, 0.4);
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
}

.alert {
    background-color: #FAF8F4;
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding-block: 10px;
    border-radius: 10px;
}

.collected-text {
    font-size: 18px;
    color: black;
    text-align: center;
}

.collected-img {
    height: 42px;
}

.okay-btn {
    outline: none;
    border: none;
    background-color: #64a70a;
    color: white;
    font-size: 16px;
    border-radius: 20px;
    padding: 7px;
    width: 30%;
    display: flex;
    align-items: center;
    text-decoration: none;
    justify-content: center;
}
</style>