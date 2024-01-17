<template>
    <div class="header">
        <h1 class="header-title">{{ headerTitle }}</h1>
        <p class="header-intro">{{ headerIntro }}</p>
    </div>
</template>
<script>
export default {
    name: 'Header',
    props: {
        headerTitle: String,
        headerIntro: String,

    },

}
</script>
<style scoped>
    .header {
        width: 100%;
        height: 12%;
        background-color: #64a70a;
        position: absolute;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 0 0 20px 20px;
    }
    .header-title {
        color: white;
        font-weight: bold;
        font-size: 25px;
    }
    .header-intro {
        color: white;
    }
</style>