<style lang="scss">
  .ar-player {
    width: 380px;
    height: 120px;
    border: 1px solid #E8E8E8;
    border-radius: 24px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    background-color: #FAFAFA;
    font-family: 'Roboto', sans-serif;

    &-bar {
      display: flex;
      align-items: center;
      height: 38px;
      padding: 0 12px;
      margin: 0 5px;
    }

    &-actions {
      width: 55%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    &--compact {
      height: unset;
      flex-direction: row;
      border: 0;
      border-radius: 0;
      background-color: unset;

      & > .ar-player-actions {
        width: unset;

        & > #download,
        & > #upload {
          display: none;
        }
      }

      & > .ar-player-bar {
        border: 1px solid #E8E8E8;
        border-radius: 24px;
        margin: 0 0 0 5px;

        & > .ar-player__progress {
          width: 125px;
        }
      }
    }

    &__progress {
      width: 160px;
      margin: 0 8px;
    }

    &__time {
      color: rgba(84,84,84,0.5);
      font-size: 16px;
      width: 41px;
    }

    &__play {
      width: 45px;
      height: 45px;
      background-color: #FFFFFF;
      box-shadow: 0 2px 11px 11px rgba(0,0,0,0.07);

      &--active {
        fill: white !important;
        background-color: #05CBCD !important;
      }
    }
  }

  @import '../scss/icons';
</style>

<template>
  <div class="ar-player" :class="{'ar-player--compact': compact}">

    <div class="ar-player-actions">
      <icon-button
        id="download"
        class="ar-icon ar-icon__sm"
        name="download"
        @click.native="decorator(download)"/>

      <icon-button
        id="play"
        class="ar-icon ar-icon__lg ar-player__play"
        :name="playBtnIcon"
        :class="{'ar-player__play--active': isPlaying}"
        @click.native="decorator(playback)"/>

      <uploader
        id="upload"
        class="ar-icon ar-icon__sm"
        :record="record"
        :options="uploaderOptions"/>
    </div>

    <div class="ar-player-bar">
      <div class="ar-player__time">{{playedTime}}</div>
      <line-control
        class="ar-player__progress"
        ref-id="progress"
        :percentage="progress"
        @change-linehead="_onUpdateProgress"/>
      <div class="ar-player__time">{{duration}}</div>
      <volume-control @change-volume="_onChangeVolume"/>
    </div>

    <audio :id="playerUniqId" :src="audioSource"></audio>
  </div>
</template>

<script>
  import IconButton    from './icon-button'
  import LineControl   from './line-control'
  import Uploader      from './uploader'
  import VolumeControl from './volume-control'
  import { convertTimeMMSS } from '@/lib/utils'

  export default {
    props: {
      src     : { type: String },
      record  : { type: Object },
      compact : { type: Boolean, default: true },
      uploaderOptions : { type: Object, default: () => new Object }
    },
    data () {
      return {
        isPlaying  : false,
        duration   : convertTimeMMSS(0),
        playedTime : convertTimeMMSS(0),
        progress   : 0
      }
    },
    components: {
      IconButton,
      LineControl,
      Uploader,
      VolumeControl
    },
    mounted: function() {
      this.player = document.getElementById(this.playerUniqId)

      this.player.addEventListener('ended', () => {
        this.isPlaying = false
      })

      this.player.addEventListener('loadeddata', (ev) => {
        this._resetProgress()
        this.duration = convertTimeMMSS(this.player.duration)
      })

      this.player.addEventListener('timeupdate', this._onTimeUpdate)

      this.$eventBus.$on('remove-record', () => {
        this._resetProgress()
      })
    },
    computed: {
      audioSource () {
        let url = this.src || this.record.url
        if (url) {
          return url
        } else {
          this._resetProgress()
        }
      },
      playBtnIcon () {
        return this.isPlaying ? 'pause' : 'play'
      },
      playerUniqId () {
        return `audio-player${this._uid}`
      }
    },
    methods: {
      playback () {
        if (this.isPlaying) {
          this.player.pause()
        } else {
          setTimeout(() => { this.player.play() }, 0)
        }

        this.isPlaying = !this.isPlaying
      },
      download () {
        let link = document.createElement('a')
        link.href = this.record.url
        link.download = 'record.wav'
        link.click()
      },
      decorator (func) {
        if (!this.audioSource) {
          return
        }
        func()
      },
      _resetProgress () {
        if (this.isPlaying) {
          this.player.pause()
        }

        this.duration   = convertTimeMMSS(0)
        this.playedTime = convertTimeMMSS(0)
        this.progress   = 0
        this.isPlaying  = false
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
      _onChangeVolume (val) {
        if (val) {
          this.player.volume = val
        }
      }
    }
  }
</script>
