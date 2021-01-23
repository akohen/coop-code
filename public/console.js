var game = {
  interpreter: function(command, term) {
    const cmd = $.terminal.parse_command(command)
    if(game.player == undefined) {
      game.player = cmd.name
      command = ''
    } else if(cmd.name == 'login') {
      game.player = cmd.args[0]
      command = ''
    }
    return $.post('/', {cmd: command, player: game.player}).then(e => {
      term.echo(e.data.output,{raw:true})
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
    prompt: function(e) {game.setPrompt(e)},
    greetings: function(callback) {callback("Welcome")},
    onBlur: function() { return false },
    exit: false,
    completion: function(s, e) { return e(game.completion)},
  },
  setPrompt: function(e) {
    e('login>')
  },
  completion: [],
}

jQuery(document).ready(function($) {
  $('#console').terminal(game.interpreter, game.options)
  game.term = $('#console').terminal()
  game.term.focus()
})