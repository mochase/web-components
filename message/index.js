function initMessage () {
  var sum = 0
  return function (text, conf) {
    const _defaults = {
      duration: 3.5,
      type: 'info'
    }
    const {duration, type} = Object.assign({}, _defaults, conf)
    if (sum > 5) {
      return
    }
    var node = _generateNode(text, type)
    document.body.appendChild(node)
    sum ++
    setTimeout(function () {
      node.classList.add('showOut')
      setTimeout(function () {
        document.body.removeChild(node)
        sum --
      }, 300)
    }, duration * 1000)
  }
  
  function _generateNode (text, type = 'info') {
    var target = document.createElement('div')
    target.className = 'messageBox'
    var i = document.createElement('i')
    if (type === 'info') {
      i.className = 'fa fa-info-circle la-lg message-icon-info'
    } else {
      i.className = 'fa fa-exclamation-triangle la-lg message-icon-warning'
    }
    target.appendChild(i)
    var span = document.createElement('span')
    span.innerHTML = text.toString()
    span.className = 'message-text'
    target.appendChild(span)
    target.classList.add('showIn')
    return target
  }
}