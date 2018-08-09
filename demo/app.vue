<style lang="scss">
  .toggle {
    cursor: pointer;
    margin: 20px;
  }
</style>

<template>
  <div class="row">
    <div class="toggle" @click="toggle">TOGGLE</div>

    <audio-recorder v-if="showRecorder"
      upload-url="some url"
      :attempts="3"
      :time="2"
      :start-record="callback"
      :stop-record="callback"
      :start-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"/>

    <audio-player :src="mp3" v-if="!showRecorder"/>
  </div>
</template>

<script>
  import AudioPlayer from '../src/components/player'
  import AudioRecorder from '../src/components/recorder'

  export default {
    name: 'app',
    components: {
      AudioPlayer,
      AudioRecorder
    },
    data () {
      return {
        mp3: '/demo/example.mp3',
        showRecorder: true
      }
    },
    methods: {
      callback (msg) {
        console.debug('Event: ', msg)
      },
      toggle () {
        this.showRecorder = !this.showRecorder
      }
    }
  }
</script>
