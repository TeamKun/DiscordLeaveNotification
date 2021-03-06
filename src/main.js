const Discord = require('discord.js')
const config = require('config')
const i18n = require("i18n")
const {format} = require('util')
const template = require('string-placeholder')

const client = new Discord.Client()

i18n.configure({
  locales: ['en', 'ja'],
  defaultLocale: config.locale,
  directory: __dirname + '/../locales',
})

client.on('ready', () => {
  console.log(i18n.__('log.login', {user: client.user.tag}))
})

client.on('guildMemberRemove', async member => {
  await Promise.all(config.channels.map(channelData => {
    return (async () => {
      if (member.guild.id !== channelData.guild)
        return
      const channel = client.channels.resolve(channelData.channel)
      channel.send(template(
        channelData.message,
        {
          guild: member.guild.name,
          nickname: member.displayName,
          name: member.user.tag,
          id: member.user.id
        }
      ))
    })()
  }))
})

client.login(config.token)