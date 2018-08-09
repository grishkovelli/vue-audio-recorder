import AudioPlayer from './components/player.vue'
import AudioRecorder from './components/recorder.vue'

const components = {
  AudioPlayer,
  AudioRecorder,

  install (Vue) {
    if (this.installed) {
      return
    }

    this.installed = true

    Vue.component('audio-player', AudioPlayer)
    Vue.component('audio-recorder', AudioRecorder)
  }
}

export default components

export { AudioPlayer, AudioRecorder }
