function initMessageBox () {
    window.message = function () {
      const el = document.createElement('div')
      el.className = 'messageBox'
      const _instance = {
        info: function (text, duration = 3.5) {
          const i = document.createElement('i')
          i.className = 'fa fa-info-circle la-lg message-icon-info'
          el.appendChild(i)
          const span = document.createElement('span')
          span.innerHTML = text
          el.appendChild(span)
          document.body.appendChild(el)
          setTimeout(function () {
            document.body.removeChild(el)
          }, duration * 1000)
        },
        warning: function (text, duration = 3.5) {
          const i = document.createElement('i')
          i.className = 'fa fa-exclamation-triangle la-lg message-icon-warning'
          el.appendChild(i)
          const span = document.createElement('span')
          span.innerHTML = text
          el.appendChild(span)
          document.body.appendChild(el)
          setTimeout(function () {
            document.body.removeChild(el)
          }, duration * 1000)
        }
      }
      return _instance
    }
  }