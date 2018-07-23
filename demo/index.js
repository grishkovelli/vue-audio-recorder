import Vue from 'vue'
import axios from 'axios'
import AudioRecorder from '../src/audio-recorder'

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  el: '#app',
  components: {AudioRecorder},
  methods: {
    callback (msg) {
      console.debug('Event: ', msg)
    }
  }
})
