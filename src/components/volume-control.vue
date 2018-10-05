<style lang="scss">
  .ar-volume {
    display: flex;
    align-items: center;
    line-height: 10px;

    &-bar {
      width: 50px;
      height: 6px;
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
</style>

<template>
  <div class="ar-volume">
    <icon-button class="ar-volume__icon" name="volume"/>
    <line-control
      class="ar-volume-bar"
      ref-id="volume"
      :percentage="volume"
      @change-linehead="onChangeLinehead"/>
  </div>
</template>

<script>
  import IconButton  from './icon-button'
  import LineControl from './line-control'

  export default {
    data () {
      return {
        volume: 0.8
      }
    },
    components: {
      IconButton,
      LineControl
    },
    methods: {
      onChangeLinehead (val) {
        this.$emit('change-volume', val)
        this.volume = val
      }
    }
  }
</script>
