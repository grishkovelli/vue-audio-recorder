<style lang="scss">
  .ar-line-control {
    position: relative;

    &__head {
      position: absolute;
      height: inherit;
      background-color: #616161;
      border-radius: inherit;
    }
  }
</style>

<template>
  <div :ref="refId" class="ar-line-control" @mousedown="onMouseDown">
    <div class="ar-line-control__head" :style="{width: percentageWidth}"></div>
  </div>
</template>

<script>
  import { calculateLineHeadPosition } from '../lib/utils.js'

  export default {
    props: {
      refId:      { type: String },
      eventName:  { type: String },
      percentage: { type: Number, default: 0 }
    },
    methods: {
      onMouseDown (ev) {
        let seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('changeLineHead', seekPos)
        document.addEventListener('mousemove', this.onMouseMove)
        document.addEventListener('mouseup', this.onMouseUp)
      },
      onMouseUp (ev) {
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
        let seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('changeLineHead', seekPos)
      },
      onMouseMove (ev) {
        let seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('changeLineHead', seekPos)
      }
    },
    computed: {
      percentageWidth () {
        let width = this.percentage < 1 ? this.percentage * 100 : this.percentage
        return `${width}%`
      }
    }
  }
</script>
