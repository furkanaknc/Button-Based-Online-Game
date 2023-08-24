<template>
  <div id="app">
    <NavbarView/>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <ErrorView v-if="error" :msg="error"/>
  <router-view/>
  <FooterView/>
  
</div>
</template>
<script>
import NavbarView from './components/NavbarView.vue';
import FooterView from './components/FooterView.vue';
import { mapGetters } from 'vuex';
import ErrorView from './components/ErrorView.vue';
export default{
  components:{
    NavbarView,
    FooterView,
    ErrorView
},
  computed:{
    ...mapGetters(["error"])
  }
};
</script>

<style>

html,body{
  height: 100%;
  margin: 0;
  padding: 0;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
