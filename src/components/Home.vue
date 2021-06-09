<template>
  <div>
    <div @click="enterToScene" id="landing-div">
      <p class="text-center">Immersive-AR Web App</p>
      <button id="xr-button" class="basicButton">AR not found</button>
    </div>
  </div>
  
</template>

<script>
import { checkXR } from '../session'
  export default {
    data() {
      return{
        isSessionSupported: false,
      }
    },

    methods: {
      enterToScene() {
        if(this.isSessionSupported){
          this.$router.push('/session');
        }
      },

      async checkSessionSupported () {
        try{
          this.isSessionSupported = await checkXR();
        }catch(e){
          console.log(e);
        }
      },
    },

    mounted(){
      this.checkSessionSupported();
    }
  }
</script>