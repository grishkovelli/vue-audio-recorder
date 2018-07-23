import AudioRecorder from './audio-recorder.vue'

export default {
  install: function (Vue) {
    if (this.installed) {
      return
    }

    this.installed = true

    Vue.component('audio-recorder', AudioRecorder)
  }
}
