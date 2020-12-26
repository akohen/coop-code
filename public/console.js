var game = {
  interpreter: function(command, term) {
    const cmd = $.terminal.parse_command(command)
    return $.post('/', {cmd: command}).then(e => {
      term.echo(e.data.output)
      if(e.data.errors) term.echo(`[[;red;]${e.data.errors}]`)
      if(e.data.prompt) {
        const matches = /^(.+)@(.+)>$/.exec(e.data.prompt)
        if(matches) {
          term.set_prompt(`[[;green;]${matches[1]}]@[[;#777;]${matches[2]}]>`)
        } else {
          term.set_prompt(e.data.prompt);
        }
      }
    })
    
  },
  options: {
    prompt: function(e) {game.setPrompt(e)},
    greetings: function(callback) {callback("Welcome to Jovian Week ")},
    onBlur: function() { return false },
    exit: false,
  },
  setPrompt: function(e) {
    e('[[;green;]foo]@[[;#777;]HQ]>')
  },
}

jQuery(document).ready(function($) {
  $('#console').terminal(game.interpreter, game.options)
  game.term = $('#console').terminal()
  game.term.focus()
})