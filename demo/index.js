import Vue from 'vue'
import axios from 'axios'
import app from './app'

Vue.prototype.$http = axios

new Vue({
  el: '#app',
  render: h => h(app)
})
