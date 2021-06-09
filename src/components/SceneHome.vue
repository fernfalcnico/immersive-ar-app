<template>
  <div id="home">

    <div id="targetDotDiv">
      <span class="targetDot">.</span>
    </div>

    <div id="rotateLeftButtonDiv">
      <div id="rotateLeftButton" class="rotateActionButton">
        <img src="/assets/icons/rotateLeft.svg" alt="Rotate left icon">
      </div>
    </div>

    <div id="rotateRightButtonDiv">
      <div id="rotateRightButton" class="rotateActionButton">
        <img src="/assets/icons/rotateRight.svg" alt="Rotate right icon">
      </div>
    </div>

    <div id="checkButtonDiv" class="confirmActionButtonDiv">
      <div id="checkButton" class="confirmActionButton">
        <img src="/assets/icons/check.svg" alt="Tick icon">
      </div>
    </div>

    <div id="trashButtonDiv" class="confirmActionButtonDiv">
      <div id="trashButton" class="confirmActionButton">
        <img src="/assets/icons/trash.svg" alt="Trash icon">
      </div>
    </div>

    <div id="cancelButtonDiv" class="cancelActionButtonDiv">
      <div id="cancelButton" class="cancelActionButton">
        <img src="/assets/icons/closeIcon.svg" alt="Close icon">
      </div>
    </div>

    <div id="cancelPlaceModelButtonDiv" class="cancelActionButtonDiv">
      <div id="cancelPlaceModelButton" class="cancelActionButton">
        <img src="/assets/icons/closeIcon.svg" alt="Close icon">
      </div>
    </div>

    <div id="home-menu" v-if="!showCatalogue" class="home-menu overlay">
      <div @click="openCatalogue" class="flex-1 text-center py-2">
        <button><img src="/assets/icons/catalogue.svg" alt="catalogue icon"></button>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out origin-top duration-400"
      enter-class="transform opacity-0 scale-90"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition origin-top ease-in duration-200"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-90"
      >


      <Catalogue 
      v-if="showCatalogue"
      v-bind:models="models"
      @close-catalogue="closeCatalogue"
      />

     </transition>
    
  </div>
</template>

<script>
import { onButtonClicked } from '../session'
import Catalogue from './Catalogue.vue'
import Models from '../../objects.json'
export default {  
  data() {
    return {
      showCatalogue: false,
      models:[],
    }
  },

  components: {Catalogue},

  methods: {
    openCatalogue() {
      this.showCatalogue = true;
    },

    closeCatalogue() {
      this.showCatalogue = false;
    }
  },

  mounted(){
    onButtonClicked();
    this.models = Models;
  }

  // beforeRouteEnter(to, from, next) {
  //   if(from.name === null) {
  //     return next({name:'Home'});
  //   }
  //   return next();
  // }
}
</script>