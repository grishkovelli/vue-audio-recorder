<style lang="scss">
  .ar-line-control {
    position: relative;
    height: 8px;
    border-radius: 5px;
    background-color: #E6E6E6;

    &__head {
      position: absolute;
      height: inherit;
      background-color: #616161;
      border-radius: inherit;
    }
  }
</style>

<template>
  <div
    :ref="refId"
    class="ar-line-control"
    @mousedown="onMouseDown">
      <div class="ar-line-control__head" :style="calculateSize"></div>
  </div>
</template>

<script>
  import { calculateLineHeadPosition } from '@/lib/utils'

  export default {
    props: {
      refId         : { type: String },
      eventName     : { type: String },
      percentage    : { type: Number, default: 0 },
      rowDirection  : { type: Boolean, default: true}
    },
    methods: {
      onMouseDown (ev) {
        const seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('change-linehead', seekPos)
        document.addEventListener('mousemove', this.onMouseMove)
        document.addEventListener('mouseup', this.onMouseUp)
      },
      onMouseUp (ev) {
        document.removeEventListener('mouseup', this.onMouseUp)
        document.removeEventListener('mousemove', this.onMouseMove)
        const seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('change-linehead', seekPos)
      },
      onMouseMove (ev) {
        const seekPos = calculateLineHeadPosition(ev, this.$refs[this.refId])
        this.$emit('change-linehead', seekPos)
      }
    },
    computed: {
      calculateSize () {
        const value = this.percentage < 1 ? this.percentage * 100 : this.percentage
        return `${this.rowDirection ? 'width' : 'height'}: ${value}%`
      }
    }
  }
</script>
