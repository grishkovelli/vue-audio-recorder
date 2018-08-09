<style lang="scss">
  .ar {
    width: 420px;
    font-family: 'Roboto', sans-serif;
    border-radius: 16px;
    background-color: #FAFAFA;
    box-shadow: 0 4px 18px 0 rgba(0,0,0,0.17);
    position: relative;
    box-sizing: content-box;

    &-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-records {
      height: 138px;
      padding-top: 1px;
      overflow-y: auto;
      margin-bottom: 20px;

      &__record {
        width: 320px;
        padding: 0 10px;
        margin: 0 auto;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E8E8E8;

        &--selected {
          border: 1px solid #E8E8E8;
          border-radius: 24px;
          background-color: #FFFFFF;
          margin-top: -1px;
          padding: 0 34px;
        }
      }
    }

    &-recorder {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;

      &__duration {
        color: #AEAEAE;
        font-size: 32px;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 16px;
      }

      &__stop {
        position: absolute;
        top: 10px;
        right: -52px;
      }

      &__time-limit {
        position: absolute;
        color: #AEAEAE;
        font-size: 12px;
        top: 128px;
      }

      &__records-limit {
        position: absolute;
        color: #AEAEAE;
        font-size: 12px;
        top: 78px;
      }
    }

    &-spinner {
      display: flex;
      height: 30px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 144px;
      z-index: 10;

      &__dot {
        display: block;
        margin: 0 8px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background: #05CBCD;
        animation-name: blink;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;

        &:nth-child(2) { animation-delay: .2s; }

        &:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0%    { opacity: .2; }
          20%   { opacity: 1; }
          100%  { opacity: .2; }
        }
      }
    }

    &__text {
      color: rgba(84,84,84,0.5);
      font-size: 16px;
    }

    &__blur {
      filter: blur(2px);
      opacity: 0.7;
    }

    &__overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 10;
    }

    &__upload-status {
      text-align: center;
      font-size: 10px;
      padding: 2px;
      letter-spacing: 1px;
      position: absolute;
      bottom: 0;

      &--success {
        color: green;
      }

      &--fail {
        color: red;
      }
    }
  }

  @import '../scss/icons';
</style>

<template>
  <div class="ar">
    <div class="ar__overlay" v-if="isUploading"></div>

    <div class="ar-spinner" v-if="isUploading">
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
      <div class="ar-spinner__dot"></div>
    </div>

    <div class="ar-content" :class="{'ar__blur': isUploading}">
      <div class="ar-recorder">
        <icon-button
          class="ar-icon ar-icon__lg"
          :name="iconButtonType"
          :class="{
            'ar-icon--rec': isRecording,
            'ar-icon--pulse': isRecording && volume > 0.02
          }"
          @click.native="toggleRecorder"/>
        <icon-button
          class="ar-icon ar-icon__sm ar-recorder__stop"
          name="stop"
          @click.native="stopRecorder"/>
      </div>

      <div class="ar-recorder__records-limit" v-if="attempts">Attempts: {{attemptsLeft}}/{{attempts}}</div>
      <div class="ar-recorder__duration">{{recordedTime}}</div>
      <div class="ar-recorder__time-limit" v-if="time">Record duration is limited: {{time}}m</div>

      <div class="ar-records">
        <div
          class="ar-records__record"
          :class="{'ar-records__record--selected': idx === selectedRecord.idx}"
          v-for="(record, idx) in recordList"
          @click="selectRecord(idx, record)">
            <div class="ar__text">Record {{idx + 1}}</div>
            <div class="ar__text">{{record.duration}}</div>
        </div>
      </div>

      <audio-player
        :compact="compact"
        :record="selectedRecord"
        :upload-url="uploadUrl"
        :start-upload="startUpload"
        :successful-upload="successfulUpload"
        :failed-upload="failedUpload"
        @start-upload="onStartUpload"
        @end-upload="onEndUpload"/>

      <div :class="uploadStatusClasses" v-if="uploadStatus">{{message}}</div>
    </div>
  </div>
</template>

<script>
  import AudioPlayer          from './player.vue'
  import IconButton           from './icon-button.vue'
  import Recorder             from '@/lib/recorder.js'
  import { convertTimeMMSS }  from '@/lib/utils.js'

  export default {
    props: {
      attempts  : { type: Number                  },
      compact   : { type: Boolean, default: false },
      time      : { type: Number                  },
      uploadUrl : { type: String                  },

      attemptsLimit    : { type: Function },
      failedUpload     : { type: Function },
      micFailed        : { type: Function },
      startRecord      : { type: Function },
      startUpload      : { type: Function },
      stopRecord       : { type: Function },
      successfulUpload : { type: Function },

      successfulUploadMsg : { type: String, default: 'Upload successful' },
      failedUploadMsg     : { type: String, default: 'Upload fail'       }
    },
    data () {
      return {
        isUploading: false,
        recorder: new Recorder({
          afterStop: () => {
            this.recordList = this.recorder.recordList()

            if (this.stopRecord) {
              this.stopRecord('stop record')
            }
          },
          attempts: this.attempts,
          time: this.time
        }),
        recordList: [],
        selectedRecord: {},
        uploadStatus: null
      }
    },
    components: {
      AudioPlayer,
      IconButton
    },
    methods: {
      toggleRecorder () {
        if (this.attempts && this.recorder.records.length >= this.attempts) {
          return
        }

        if (!this.isRecording || (this.isRecording && this.isPause)) {
          this.recorder.start()
          if (this.startRecord) {
            this.startRecord('start record')
          }
        } else {
          this.recorder.pause()
          if (this.startRecord) {
            this.startRecord('pause record')
          }
        }
      },
      stopRecorder () {
        if (!this.isRecording) {
          return
        }

        this.recorder.stop()
      },
      selectRecord (idx, record) {
        this.selectedRecord = { idx: idx, url: record.url, blob: record.blob }
      },
      onStartUpload () {
        this.isUploading = true
      },
      onEndUpload (status) {
        this.isUploading = false
        this.uploadStatus = status
        setTimeout(() => {this.uploadStatus = null}, 1500)
      }
    },
    computed: {
      attemptsLeft () {
        return this.attempts - this.recorder.records.length
      },
      iconButtonType () {
        return this.isRecording && this.isPause ? 'mic' : this.isRecording ? 'pause' : 'mic'
      },
      isPause () {
        return this.recorder.isPause
      },
      isRecording () {
        return this.recorder.isRecording
      },
      message () {
        return this.uploadStatus === 'success' ? this.successfulUploadMsg : this.failedUploadMsg
      },
      recordedTime () {
        if (this.time && this.recorder.duration >= this.time * 60) {
          this.stopRecorder()
        }
        return convertTimeMMSS(this.recorder.duration)
      },
      uploadStatusClasses () {
        let classes = ['ar__upload-status']
        classes.push(this.uploadStatus === 'success' ? 'ar__upload-status--success' : 'ar__upload-status--fail')
        return classes.join(' ')
      },
      volume () {
        return parseFloat(this.recorder.volume)
      }
    }
  }
</script>

