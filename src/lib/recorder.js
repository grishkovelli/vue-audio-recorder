import WavEncoder from './wav-encoder'
import { convertTimeMMSS } from './utils'

export default class {
  constructor (options = {}) {
    this.afterStop = options.afterStop
    this.micFailed = options.micFailed

    this.bufferSize = 4096
    this.records    = []
    this.samples    = []

    this.isPause      = false
    this.isRecording  = false

    this.duration = 0
    this.volume   = 0

    this._duration = 0
  }

  start () {
    navigator.mediaDevices.getUserMedia({audio: true})
                          .then(this._micCaptured.bind(this))
                          .catch(this._micError.bind(this))
    this.isPause = false
    this.isRecording = true
  }

  stop () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    let encoder = new WavEncoder({
      bufferSize: this.bufferSize,
      sampleRate: this.context.sampleRate,
      samples: this.samples
    })

    let audioBlob = encoder.getData()
    let audioUrl = URL.createObjectURL(audioBlob)

    this.samples = []

    this.records.push({
      blob: audioBlob,
      url: audioUrl,
      duration: convertTimeMMSS(this.duration)
    })

    this.isPause = false
    this.isRecording = false
    this._duration = 0
    this.duration = 0

    if (this.afterStop) {
      this.afterStop()
    }
  }

  pause () {
    this.stream.getTracks().forEach((track) => track.stop())
    this.input.disconnect()
    this.processor.disconnect()
    this.context.close()

    this._duration = this.duration
    this.isPause = true
  }

  recordList () {
    return this.records
  }

  lastRecord () {
    return this.records.slice(-1)
  }

  _micCaptured (stream) {
    this.context = new AudioContext()
    this.input = this.context.createMediaStreamSource(stream)
    this.processor = this.context.createScriptProcessor(this.bufferSize, 1, 1)
    this.duration = this._duration
    this.stream = stream

    this.processor.onaudioprocess = (ev) => {
      let sample = ev.inputBuffer.getChannelData(0)
      let sum    = 0.0

      for (let i = 0; i < sample.length; ++i) {
        sum += sample[i] * sample[i]
      }

      this.duration = parseFloat(this._duration) + parseFloat(this.context.currentTime.toFixed(2))
      this.volume = Math.sqrt(sum / sample.length).toFixed(2)
      this.samples.push(new Float32Array(sample))
    }

    this.input.connect(this.processor)
    this.processor.connect(this.context.destination)
  }

  _micError (error) {
    if (this.micFailed) {
      this.micFailed(error)
    }
  }
}
