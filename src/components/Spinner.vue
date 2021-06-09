<template>
  <div v-if="show" class="fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center">
    <div class="w-12 h-12 border-4 border-teal-600 rounded-full loader"></div>
  </div>
  
</template>

<script>
  export default {
    data(){
      return{
        show: false
      }
    },

    props:{
      showProp: Boolean
    },

    watch:{
      showProp:{
        handler: function(){
          this.show = this.showProp;
        }
      }
    }
    
  }
</script>