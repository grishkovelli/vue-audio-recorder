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
      :headers="headers"
      :before-recording="callback"
      :pause-recording="callback"
      :after-recording="callback"
      :select-record="callback"
      :before-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"/>

    <audio-player :src="mp3" v-if="!showRecorder"/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        mp3: '/demo/example.mp3',
        showRecorder: true,
        headers: {
          'X-Custom-Header': 'some data'
        }
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
