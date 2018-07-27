# vue-audio-recorder

> Audio recorder for Vue.js. It allows to create, play, download and store records on a server

#### [Live demo](https://jsfiddle.net/grishkovelli/rb1anxyj/)

![](https://raw.githubusercontent.com/grishkovelli/vue-audio-recorder/master/screenshot.png)

### Features

- Beautiful clean UI
- Download/upload/play record
- Time limit
- Records limit
- A lot of callbacks

### Tested in

- Chrome
- Firefox
- Safari

## Installation

```
npm i vue-audio-recorder --save
```

## Props

| Prop                  | Type     | Description                                                      |
| --------------------- | -------- | ---------------------------------------------------------------- |
| attempts              | Number   | Number of recording attempts                                     |
| time                  | Number   | Time limit for record in minutes                                 |
| upload-url            | String   | URL for uploading                                                |
| start-record          | Function | It fires after click the record button                           |
| stop-record           | Function | It fires after click the stop button or exceeding the time limit |
| start-upload          | Function | It fires after start uploading                                   |
| attempts-limit        | Function | It fires after exceeding the attempts                            |
| failed-upload         | Function | Is fires after failure uploading                                 |
| mic-failed            | Function | It fires if your microphone doesn't work                         |
| successful-upload     | Function | It fires after successful uploading                              |
| successful-upload-msg | String   | Display the message after successful uploading                   |
| failed-upload-msg     | String   | Display the message after failure uploading                      |

## Usage

```js
  <audio-recorder
    upload-url="YOUR_API_URL"
    :attempts="3"
    :time="2"
    :start-record="callback"
    :stop-record="callback"
    :start-upload="callback"
    :successful-upload="callback"
    :failed-upload="callback"/>
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

## Authors

[Gennady Grishkovtsov](https://www.linkedin.com/in/grishkovtsov/) - Developer

[Olga Zimina](https://www.behance.net/zimin4ik) - UIX Designer
