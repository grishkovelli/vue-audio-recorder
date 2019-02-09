# vue-audio-recorder

> Audio recorder for Vue.js. It allows to create, play, download and store records on a server.

#### [Live demo](https://jsfiddle.net/grishkovelli/rb1anxyj/)

![](https://raw.githubusercontent.com/grishkovelli/vue-audio-recorder/master/screenshot.png)

### Features

- Beautiful clean UI
- Download/upload/play record
- Time limit
- Records limit
- A lot of callbacks
- Individual an audio player
- MP3 support

### Tested in (desktop)

- Chrome
- Firefox
- Safari

## Installation

```
npm i vue-audio-recorder --save
```

## AudioRecorder props

| Prop                  | Type     | Description                                                              |
| --------------------- | -------- | ------------------------------------------------------------------------ |
| attempts              | Number   | Number of recording attempts                                             |
| headers               | Object   | HTTP headers                                                             |
| time                  | Number   | Time limit for the record (minutes)                                      |
| bit-rate              | Number   | Default: 128                                                             |
| sample-rate           | Number   | Default: 44100                                                           |
| filename              | String   | Download/Upload filename                                                 |
| upload-url            | String   | URL for uploading                                                        |
| show-download-button  | Boolean  | If it is true show a download button. Default: true                      |
| show-upload-button    | Boolean  | If it is true show an upload button. Default: true                       |
| before-upload         | Function | Callback fires before uploading                                          |
| successful-upload     | Function | Callback fires after successful uploading                                |
| failed-upload         | Function | Callback fires after failure uploading                                   |
| mic-failed            | Function | Callback fires if your microphone doesn't work                           |
| before-recording      | Function | Callback fires after click the record button                             |
| pause-recording       | Function | Callback fires after pause recording                                     |
| after-recording       | Function | Callback fires after click the stop button or exceeding the time limit   |
| select-record         | Function | Callback fires after choise a record. Returns the record                 |

## AudioPlayer props
| Prop                  | Type     | Description                                                     |
| --------------------- | -------- | --------------------------------------------------------------- |
| src                   | String   | Specifies the URL of the audio file                             |

## Usage

```js
    import AudioRecorder from 'vue-audio-recorder'

    Vue.use(AudioRecorder)
```

```js
    methods: {
      callback (data) {
        console.debug(data)
      }
    }
```

```html
  <audio-recorder
    upload-url="YOUR_API_URL"
    :attempts="3"
    :time="2"
    :headers="headers"
    :before-recording="callback"
    :pause-recording="callback"
    :after-recording="callback"
    :select-record="callback"
    :before-upload="callback"
    :successful-upload="callback"
    :failed-upload="callback"/>
```

```html
  <audio-player src="/demo/example.mp3"/>
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## TODO

- Clear record list
- Return WAV format
- Responsive design

## Authors

[Gennady Grishkovtsov](https://www.linkedin.com/in/grishkovtsov/) - Developer

[Olga Zimina](https://www.behance.net/zimin4ik) - UIX Designer
