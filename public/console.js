var game = {
  interpreter: function(command, term) {
    const cmd = $.terminal.parse_command(command)
    if(cmd.name == 'login') {
      game.player = cmd.rest
      command = ''
    }
    return $.post('/', {cmd: command, player: game.player}).then(e => {
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
    }).fail(e => {
      term.echo(`[[;red;]${e.responseJSON.errors}]`)
      term.resume()
    })
    
  },
  options: {
    prompt: function(e) {game.setPrompt(e)},
    greetings: function(callback) {callback("Welcome to Jovian Week ")},
    onBlur: function() { return false },
    exit: false,
  },
  setPrompt: function(e) {
    e('[[;green;]foo]@[[;#ddd;]HQ]>')
  },
}

jQuery(document).ready(function($) {
  $('#console').terminal(game.interpreter, game.options)
  game.term = $('#console').terminal()
  game.term.focus()
})