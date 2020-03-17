<style lang="scss">
  .toggle {
    cursor: pointer;
    margin: 20px;
    border-radius: 50px;
    padding: 5px 20px;
    background-color: white;
    font-weight: bold;
    border: 1px solid #05CBCD;
    color: #747474;
    &:hover {
      background-color: #05CBCD;
    }
  }
</style>

<template>
  <div class="row">
    <button class="toggle" @click="toggle">TOGGLE</button>

    <audio-recorder v-if="showRecorder"
      upload-url="some url"
      filename="ninja"
      format="wav"
      :attempts="3"
      :time="2"
      :headers="headers"
      :before-recording="callback"
      :pause-recording="callback"
      :after-recording="callback"
      :select-record="callback"
      :before-upload="callback"
      :successful-upload="callback"
      :failed-upload="callback"
      :bit-rate="192"/>

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
