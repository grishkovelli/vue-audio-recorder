export default {
  props: {
    filename  : { type: String, default: 'record'   },
    format    : { type: String, default: 'mp3'      },
    headers   : { type: Object, default: () => ({}) },
    uploadUrl : { type: String                      }
  }
}
