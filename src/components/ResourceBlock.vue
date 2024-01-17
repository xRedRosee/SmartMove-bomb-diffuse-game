<template>
    <button class="resource-block" :id="idText">
        <p class="resource-text"> {{ blockText }} </p>
        <div class="resource-icons">
            <div v-for="(resource, index) in resources" :key="'resource-' + index" class="resource-section">
                <img v-if="resource !== `craft`" :src="getResourceImage(resource)" :alt="resource" class="resource-icon"
                    :class="{ 'timer-active': timerActive }" />
                <div v-else>
                    <img src="../assets/wrench.svg" class="craft-image-icon">
                    <img src="../assets/screwdriver.svg" class="craft-image-icon">
                    <img src="../assets/hammer.svg" class="craft-image-icon">
                </div>
                <span v-if="index !== resources.length - 1" class="slash-icon"> / </span>
            </div>
        </div>
        <p v-if="status" class="timer">{{ remainingTime }}</p>
    </button>
</template>
<script>
export default {
    name: 'ResourceBlock',
    props: {
        blockText: String,
        backgroundColor: String,
        idText: String,
        status: Boolean,
        resources: Array,
    },
    data() {
        return {
            remainingTime: '1:00',
            timerActive: false,
        };
    },
    mounted() {
        this.checkIfCraft()
    },
    watch: {
        status(newStatus) {
            if (newStatus) {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        },
    },
    methods: {
        getResourceImage(resource) {
            // Return resource img
            if (resource == "") {
                return;
            } else {
                return `./${resource}.svg`;
            }
        },
        startTimer() {
            if (this.status && this.idText !== "A20041E23F42") {
                this.timerActive = true;
                // Timer if interacted with ResourceBlock
                const countDownDate = new Date().getTime() + 1 * 60 * 1000;
                this.timerInterval = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = countDownDate - now;
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    this.remainingTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                    if (distance < 0) {
                        clearInterval(this.timerInterval);
                        this.remainingTime = '00:00';
                    }
                }, 1000); // Update every second
            }
        },
        stopTimer() {
            clearInterval(this.timerInterval);
            // Reset timer when status becomes false
            this.timerActive = false;
            this.remainingTime = '01:00';
        },
        checkIfCraft() {
            // Update crafting block to different background
            if (this.idText === "A20041E23F42") {
                this.$el.classList.add("cyan");
            }
        }
    },
    beforeUnmount() {
        clearInterval(this.timerInterval);
    },
}
</script>
<style>
.resource-block {
    width: 33%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;
    border: none;
    outline: none;
    background-color: #E2F2CE;
    border-radius: 14px;
    gap: 10px;
    -webkit-box-shadow: inset -6px -6px 6px -2px rgba(0, 0, 0, 0.22);
    box-shadow: inset -6px -6px 6px -2px rgba(0, 0, 0, 0.22);
}

.resource-text {
    color: black;
}

.grey {
    background-color: rgb(41, 41, 41);
}

.cyan {
    background-color: rgb(206, 242, 225);
}


.resource-icons {
    display: flex;
    align-items: center;
}

.resource-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.resource-icon {
    height: 22px;
    margin-inline: 8px;
}

.slash-icon {
    font-size: 22px;
    color: black;
}

.timer {
    color: red;
    font-size: 14px;
    margin: 0;
}

.timer-active {
    opacity: 0.2;
}

.craft-image-icon {
    height: 25px;
}
</style>