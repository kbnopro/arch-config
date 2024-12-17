const configOptions = {
  'time': {
    // See https://docs.gtk.org/glib/method.DateTime.format.html
    'format': "%H:%M",
    'interval': 5000,
    'dateFormat': "%d/%m",
    'dateFormatLong': "%A, %d/%m",
    'dateInterval': 5000
  }
}


globalThis.configOptions = configOptions

export default configOptions
