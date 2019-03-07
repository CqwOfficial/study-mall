<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button v-on:click="up"></button>
    <button v-on:click="down"></button>
    <HelloWorld :msg="msg"></HelloWorld>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  data() {
    return {
      msg : 15,
    }
  },
  methods: {
    up(){
      this.msg++;
    },
    down(){
      this.msg--;
    }
  },
  components: {
    HelloWorld
  }
}
</script>
