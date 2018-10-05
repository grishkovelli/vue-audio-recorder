<style lang="scss">
  @import '../scss/icons';
</style>

<template>
  <icon-button name="save" @click.native="upload"/>
</template>

<script>
  import IconButton from './icon-button'

  export default {
    props: {
      options : { type: Object },
      record  : { type: Object }
    },
    components: {
      IconButton
    },
    methods: {
      upload () {
        if (!this.record.url) {
          return
        }

        this.$eventBus.$emit('start-upload')

        if (this.options.startUpload) {
          this.options.startUpload()
        }

        let data = new FormData()
        data.append('audio', this.record.blob, 'my-record')

        let headers = Object.assign(this.options.headers, {})
        headers['Content-Type'] = `multipart/form-data; boundary=${data._boundary}`

        this.$http.post(this.options.uploadUrl, data, { headers: headers }).then(resp => {
          this.$eventBus.$emit('end-upload', 'success')

          if (this.options.successfulUpload) {
            this.options.successfulUpload(resp)
          }
        }).catch(error => {
          this.$eventBus.$emit('end-upload', 'fail')

          if (this.options.failedUpload) {
            this.options.failedUpload(error)
          }
        })
      }
    }
  }
</script>
