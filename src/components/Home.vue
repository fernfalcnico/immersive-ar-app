<template>
  <div>
    <div @click="enterToScene" id="landing-div">
      <p class="text-center">Immersive-AR Web App</p>
      <button id="xr-button" class="basicButton">AR not found</button>
    </div>
  </div>
  
</template>

<script>
  export default {
    data() {
      return{}
    },

    methods: {
      enterToScene() {
        this.$router.push('/session');
      }
    }
  }
</script>