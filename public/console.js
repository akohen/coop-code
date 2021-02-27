/* eslint-disable no-undef */
var game = {
  update: function() {
    clearTimeout(game.nextUpdate)
    game.nextUpdate = setTimeout(() => game.update(),10000)
    if(!localStorage.getItem('player_id')) return
    $.post('/update', {player: localStorage.getItem('player_id'), secret: localStorage.getItem('player_secret')})
    .then(e => {
      console.log(e.data)
      game.term.echo(e.data.output)
      if(e.data.prompt) {
        const matches = /^(.+)@(.+)>$/.exec(e.data.prompt)
        if(matches) {
          game.term.set_prompt(`[[;green;]${matches[1]}]@[[;#ddd;]${matches[2]}]>`)
        } else {
          game.term.set_prompt(e.data.prompt);
        }
      }
      if(e.data.autocomplete) { game.completion = e.data.autocomplete }
    })
  },
  interpreter: function(command, term) {
    const cmd = $.terminal.parse_command(command)
    
    if(cmd.name == 'login') {
      if(cmd.args[0] == 'local') {
        localStorage.setItem('player_id', cmd.args[1])
        localStorage.setItem('player_secret', cmd.args[2])
        game.update()
        return
      }
      localStorage.removeItem('player_id')
      localStorage.removeItem('player_secret')
      window.open('https://github.com/login/oauth/authorize?client_id='+game.config.github_client_id+'&redirect_uri='+game.config.github_redirect_uri)
      term.echo('Logging in...')
      term.pause()
      return
    } else if(cmd.name == 'logout') {
      localStorage.removeItem('player_id')
      localStorage.removeItem('player_secret')
      game.term.set_prompt('>')
      return 'logged out'
    } else if(cmd.name == 'register') {
      if(!cmd.args[0]) return 'Select your username with [[;white;]register USERNAME]'
      if(!/^[A-Za-z0-9_-]+$/.test(cmd.args[0])) return 'Invalid username. Please use only alphanumeric characters'
      window.open('https://github.com/login/oauth/authorize?client_id='+game.config.github_client_id+'&redirect_uri='+game.config.github_redirect_uri+'/register/'+cmd.args[0])
      term.echo('User registration in progress...')
      term.pause()
      return
    }
    if(!localStorage.getItem('player_id')) return
    return $.post('/', {cmd: command, player: localStorage.getItem('player_id'), secret: localStorage.getItem('player_secret')}).then(e => {
      term.echo(e.data.output)
      if(e.data.errors) term.echo(`[[;red;]${e.data.errors}]`)
      if(e.data.prompt) {
        const matches = /^(.+)@(.+)>$/.exec(e.data.prompt)
        if(matches) {
          term.set_prompt(`[[;green;]${matches[1]}]@[[;#ddd;]${matches[2]}]>`)
        } else {
          term.set_prompt(e.data.prompt);
        }
      }
      if(e.data.autocomplete) {
        game.completion = e.data.autocomplete
      }
    }).fail(e => {
      term.echo(`[[;red;]${e.responseJSON.errors}]`)
      term.resume()
    })
    
  },
  options: {
    greetings: '',
    prompt: '',
    onBlur: function() { return false },
    exit: false,
    completion: function(s, e) { return e(game.completion)},
  },
  completion: [],
}

jQuery(document).ready(function($) {
  $('#console').terminal(game.interpreter, game.options)
  $.get('/config').then(d => game.config = d)
  game.term = $('#console').terminal()
  game.term.focus()
  if(localStorage.getItem('player_id')) {
    game.term.echo('Welcome back!')
    game.update()
  } else {
    game.term.echo('not logged in, type [[;white;]login] or [[;white;]register] to create an account')
    game.term.set_prompt('>')
  }
})


window.loginCallback = function (err) {
  if(err) game.term.echo(`[[;red;]${err}]`)
  if(localStorage.getItem('player_id') && localStorage.getItem('player_secret')) {
    game.term.set_prompt('')
    game.update()
  }
  game.term.resume()
}