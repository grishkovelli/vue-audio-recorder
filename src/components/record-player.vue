<style lang="scss">
  .ar-player {
    width: 100%;
    height: 120px;
    border: 1px solid #E8E8E8;
    border-radius: 24px;
    background-color: #FAFAFA;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &-actions {
      width: 55%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    &-volume {
      display: flex;
      align-items: center;
      line-height: 10px;

      &-bar {
        width: 50px;
        height: 8px;
        background: #E6E6E6;
        border-radius: 4px;
        position: relative;
      }

      &__icon {
        fill: #747474;
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 0;
        padding: 0;
        background-color: unset;
        margin-right: 3px;
      }
    }

    &-bar {
      display: flex;
      align-items: center;
      margin-bottom: 2px;
    }

    &--active {
      background-color: white;
    }

    &__progress {
      width: 160px;
      height: 8px;
      border-radius: 5px;
      background-color: #E6E6E6;
      margin: 0 8px;
    }

    &__time {
      color: rgba(84,84,84,0.5);
      font-size: 16px;
      width: 41px;
    }
  }
</style>

<template>
  <div class="ar-player" :class="{'ar-player--active': record.url}">
    <div class="ar-player-bar">

      <div class="ar-player__time">{{playedTime}}</div>

      <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @changeLineHead="_onUpdateProgress"/>

      <div class="ar-player__time">{{duration}}</div>

      <div class="ar-player-volume">
        <icon-button class="ar-player-volume__icon" name="volume"/>
        <line-control
          class="ar-player-volume-bar"
          ref-id="volume"
          :percentage="volume"
          @changeLineHead="_onUpdateVolume"/>
      </div>
    </div>

    <div class="ar-player-actions">
      <icon-button name="download" @click.native="download"/>
      <icon-button
        size="lg"
        :name="playBtnIcon"
        :class="{'ar-icon-button--clicked': isPlaying}"
        @click.native="playback"/>
      <icon-button name="save" @click.native="upload"/>
    </div>

    <audio id="audio-recorder-player" :src="record.url"></audio>
  </div>
</template>

<script>
  import IconButton from './icon-button.vue'
  import LineControl from './line-control.vue'
  import { convertTimeMMSS } from '../lib/utils.js'

  export default {
    props: {
      uploadUrl:        { type: String   },
      record:           { type: Object   },
      startUpload:      { type: Function },
      successfulUpload: { type: Function },
      failedUpload:     { type: Function }
    },
    data () {
      return {
        isPlaying: false,
        duration: convertTimeMMSS(0),
        playedTime: convertTimeMMSS(0),
        progress: 0,
        volume: 0.8
      }
    },
    components: {
      IconButton,
      LineControl
    },
    mounted: function() {
      this.player = document.getElementById('audio-recorder-player')

      this.player.addEventListener('ended', () => {
        this.isPlaying = false
      })

      this.player.addEventListener('loadeddata', (ev) => {
        this._resetProgress()
        this.duration = convertTimeMMSS(this.player.duration)
      })

      this.player.addEventListener('timeupdate', this._onTimeUpdate)
    },
    computed: {
      playBtnIcon () {
        return this.isPlaying ? 'pause' : 'play'
      }
    },
    methods: {
      playback () {
        if (!this.record.url) {
          return
        }

        if (this.isPlaying) {
          this.player.pause()
        } else {
          setTimeout(() => { this.player.play() }, 0)
        }

        this.isPlaying = !this.isPlaying
      },
      upload () {
        if (!this.record.url) {
          return
        }

        if (this.startUpload) {
          this.startUpload()
        }

        this.$emit('on-start-upload')

        let data = new FormData()
        data.append('audio', this.record.blob, 'my-record')

        this.$http.post(this.uploadUrl, data, {
          headers: {'Content-Type': `multipart/form-data; boundary=${data._boundary}`}
        }).then(resp => {
          this.$emit('on-end-upload', 'success')
          if (this.successfulUpload) {
            this.successfulUpload(resp)
          }
        }).catch(error => {
          this.$emit('on-end-upload', 'fail')
          if (this.failedUpload) {
            this.failedUpload(error)
          }
        })
      },
      download () {
        if (!this.record.url) {
          return
        }

        let link = document.createElement('a')
        link.href = this.record.url
        link.download = 'record.wav'
        link.click()
      },
      _resetProgress () {
        this.isPlaying = false
        this.progress = 0
      },
      _onTimeUpdate () {
        this.playedTime = convertTimeMMSS(this.player.currentTime)
        this.progress = (this.player.currentTime / this.player.duration) * 100
      },
      _onUpdateProgress (pos) {
        if (pos) {
          this.player.currentTime = pos * this.player.duration
        }
      },
      _onUpdateVolume (val) {
        if (val) {
          this.player.volume = val
          this.volume = val
        }
      }
    }
  }
</script>
