<template>
    <div class="error-alert-container">
        <div class="alert">
            <img src="../assets/error.svg" class="error-img">
            <p class="error-text"> You don't have {{ errorText }}</p>
            <button class="okay-btn" @click="closeAlert()"> Continue </button>
        </div>
    </div>
</template>
<script>
export default {
    name: "ErrorAlert",
    props: {
        errorText: String,
    },
    methods: {
        closeAlert() {
            document.querySelector(".error-alert-container").style.display = "none";
        }
    }
}
</script>
<style scoped>
.error-alert-container {
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

.error-text {
    font-size: 18px;
    color: black;
    text-align: center;
}

.error-img {
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