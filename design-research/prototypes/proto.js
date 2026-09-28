// Prototype-only behaviour. No network calls; states are simulated.
(function () {
  var root = document.documentElement
  var ledger = document.getElementById('ledger')
  var checked = document.getElementById('checked')

  function stamp() {
    if (checked) checked.textContent = 'checked ' + new Date().toTimeString().slice(0, 8)
  }

  function setState(state) {
    if (!ledger) return
    var rows = ledger.querySelectorAll('li')
    var up = 0
    rows.forEach(function (li, i) {
      li.classList.remove('is-checking', 'is-down', 'pulse')
      var lbl = li.querySelector('.lbl')
      var ms = li.querySelector('.ms')
      if (state === 'checking') {
        li.classList.add('is-checking'); lbl.textContent = 'Checking'; ms.textContent = '...'
      } else if (state === 'down' && i === 1) {
        li.classList.add('is-down'); lbl.textContent = 'Not responding'; ms.textContent = 'timeout 5 s'
      } else {
        up++; lbl.textContent = 'Live'; ms.textContent = li.dataset.ms + ' ms'
      }
    })
    var foot = document.querySelector('.ledger-foot span')
    if (foot) foot.textContent = state === 'checking' ? 'Checking 4 systems' : up + ' of 4 responding'
    if (state !== 'checking') stamp()
  }

  function recheck() {
    setState('checking')
    var rows = ledger.querySelectorAll('li')
    rows.forEach(function (li, i) {
      setTimeout(function () {
        li.classList.remove('is-checking')
        li.querySelector('.lbl').textContent = 'Live'
        li.querySelector('.ms').textContent = li.dataset.ms + ' ms'
        li.classList.add('pulse')
        if (i === rows.length - 1) {
          document.querySelector('.ledger-foot span').textContent = '4 of 4 responding'
          stamp()
        }
      }, 400 + i * 220)
    })
  }

  document.querySelectorAll('[data-state]').forEach(function (b) {
    b.addEventListener('click', function () { setState(b.dataset.state) })
  })
  var rc = document.getElementById('recheck')
  if (rc) rc.addEventListener('click', recheck)

  var theme = document.getElementById('theme')
  if (theme) {
    var sync = function () {
      var dark = root.getAttribute('data-theme') === 'dark' ||
        (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches)
      theme.textContent = dark ? 'Light theme' : 'Dark theme'
      theme.setAttribute('aria-pressed', String(dark))
    }
    theme.addEventListener('click', function () {
      var dark = theme.getAttribute('aria-pressed') === 'true'
      root.setAttribute('data-theme', dark ? 'light' : 'dark')
      try { localStorage.setItem('theme', dark ? 'light' : 'dark') } catch (e) {}
      sync()
    })
    try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved) } catch (e) {}
    sync()
  }

  var prop = document.getElementById('prop')
  if (prop) prop.addEventListener('click', function () { document.body.classList.toggle('show-proposed') })

  // Work page: live filter over the archive table (prototype data only)
  var q = document.getElementById('q'), cat = document.getElementById('cat')
  var tbody = document.getElementById('rows'), count = document.getElementById('count'), empty = document.getElementById('empty')
  function filter() {
    if (!tbody) return
    var term = (q.value || '').toLowerCase(), c = cat.value, n = 0
    tbody.querySelectorAll('tr').forEach(function (tr) {
      var ok = (!term || tr.textContent.toLowerCase().indexOf(term) > -1) && (!c || tr.dataset.cat === c)
      tr.hidden = !ok; if (ok) n++
    })
    count.textContent = n + ' of ' + tbody.children.length + ' shown'
    empty.hidden = n !== 0
  }
  if (q) { q.addEventListener('input', filter); cat.addEventListener('change', filter) }
  var reset = document.getElementById('reset')
  if (reset) reset.addEventListener('click', function () { q.value = ''; cat.value = ''; filter(); q.focus() })

  // hide prototype controls with ?clean
  if (/[?&]clean/.test(location.search)) { var p = document.getElementById('proto'); if (p) p.hidden = true }
})()
