<template>
  <div class="bg-white">  
      <div class="h-full border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
        <div class="h-40">
          <img class="object-cover shadow-lg rounded-t-lg" :src="'/assets/models/' + model.image" :alt="model.name + 'image'">
        </div>
        <div @click.stop="prepareModelToDrop" class="flex justify-between pt-12 pb-4 px-2">
          <h3 class="text-sm md:text-lg font-medium text-gray-900">{{model.name}}</h3>
          <img src="/assets/icons/arkit.svg" alt="ARkit logo">
        </div>
        
      </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{}
    },

    props:{
      model: Object,
    },

    methods:{
       async prepareModelToDrop(){
         try {
          this.modelIsLoading();
          await loadModel(this.model);
         }catch(error) {
           console.log(error);
         }finally {
          this.modelIsLoaded();
         }
       },

      modelIsLoaded: function(){
        this.$emit("model-is-loaded");
      },

      modelIsLoading: function(){
        this.$emit("model-is-loading");
      },
    },

  }
</script>