const { red, green, yellow, blue, magenta } = require('./theme')

module.exports = {
  STATUS_COLORS: {
    '2': green,
    '3': blue,
    '4': yellow,
    '5': red,
    '9': red
  },
  STATUS_COLORS_FALLBACK: magenta
}
