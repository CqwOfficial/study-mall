import Test from  './test.vue'

const test = {
  install: (Vue) => {
    Vue.component('Test', Test);
  }
}
export default test