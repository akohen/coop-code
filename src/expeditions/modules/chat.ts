import { Context, ExpeditionModule } from "../../typings";

export const chat:ExpeditionModule = {
  commands: new Map([
    ['chat', {
      run:(ctx:Context, args?:string) => {
        if(!args) throw new Error('You need to set a message to send')
        const message = `[${new Date().toUTCString().substring(17,22)}]${ctx.player.name}: `+args
        for(const player of ctx.expedition.players) {
          const prev = ctx.expedition.variables.get('_chat_messages_'+player)
          if(prev) {
            ctx.expedition.variables.set('_chat_messages_'+player,prev+'\n'+message)
          } else {
            ctx.expedition.variables.set('_chat_messages_'+player, message)
          }
        }
        return undefined
      },
      help:() => 'Send a text message to other connected players',
    }],
    ['_auto_chat', {
      run:(ctx:Context) => {
        if(!ctx.expedition.variables.has('_chat_messages_'+ctx.player.name)) return
        const messages = ctx.expedition.variables.get('_chat_messages_'+ctx.player.name)
        ctx.expedition.variables.delete('_chat_messages_'+ctx.player.name)
        return messages?.toString()
      },
      isAvailable: () => false,
    }],
  ])
}