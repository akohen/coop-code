/* eslint-disable no-undef */
var game = {
  interpreter: function(command, term) {
    const cmd = $.terminal.parse_command(command)
    
    if(cmd.name == 'login') {
      localStorage.removeItem('player_id')
      localStorage.removeItem('player_secret')
      const popup = window.open('https://github.com/login/oauth/authorize?client_id=450a5ae4c4d33ebb6477&redirect_uri=http://localhost:8001/oauth')
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
      const popup = window.open('https://github.com/login/oauth/authorize?client_id=450a5ae4c4d33ebb6477&redirect_uri=http://localhost:8001/oauth/register/'+cmd.args[0])
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
  game.term = $('#console').terminal()
  game.term.focus()
  if(localStorage.getItem('player_id')) {
    game.term.echo('Welcome back!')
    game.term.exec('')
  } else {
    game.term.echo('not logged in, type [[;white;]login] or [[;white;]register] to create an account')
    game.term.set_prompt('>')
  }
})


window.loginCallback = function (err) {
  if(err) {
    game.term.echo(`[[;red;]${err}]`)
    game.term.resume()
    return
  }
  game.player = localStorage.getItem('player_id')
  game.term.set_prompt('')
  game.term.exec('')
  game.term.resume()
}