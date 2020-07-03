const discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const { cpuUsage } = require("process");
const bot = new discord.Client();
bot.commands = new discord.Collection();
// werkt niet :
const swearwords = ['kut', 'Kut', 'kutjes', 'Kutjes', 'Fack', 'fack', 'Fuck', 'fuck', 'facking', 'Facking', 'fucking', 'Fucking']
bot.on('ready', async () => {
    console.log(`Online`)
    var kanaal = bot.channels.find(`id`, '728332786783748278');
    kanaal.send('Bot online');
    function changing_status() {
      let status = ["Prefix: !", "Version 1.0.0", "with Game Events", `Events with ${bot.users.size} user`, `With your tickets!`, `!new`]
      let randomStatus = status[Math.floor(Math.random() * status.length)]
      bot.user.setActivity(randomStatus, { type: "PLAYING"});
    }
    setInterval(changing_status, 5000)
  })
  bot.on("guildMemberAdd", (member) => {
      const welkomkanaal = member.guild.channels.find(`id`, '728332671088066641');
      welkomkanaal.send(`Welkom, ${member}!`);
      var role = member.guild.roles.find(`name`, 'lid');
      member.addRole(role);
  });
  // deze events zullen ervoor zorgen dat er berichten komen als
  bot.on("guildMemberRemove", (member) => {
    const welkomkanaal = member.guild.channels.find(`id`, '728332671088066641');
      welkomkanaal.send(`Jammer dat ${member} de server heeft verlaten...`);
  })
  bot.on("message", async message => {
    if (message.author.bot) return;
  
    if (message.channel.type === "dm") return;
  
    var prefix = config.prefix;
  
    var MessageAray = message.content.split(" ");
  
    var command = MessageAray[0];
  
    var args = MessageAray.slice(1);
  
    var commands = bot.commands.get(command.slice(prefix.length));
  
    if (commands) commands.run(bot, message, args);

    if(command === `${swearwords}`){
      message.delete();
      message.channel.send(`Dat woord is verboden, sorry, ${message.member}`);
    }
    if(command === '<@728334364009693264>'){
      message.reply('Prefix is `!`');
    }
    if(command === '@GameEvent#0580'){
      message.reply('Prefix is `!');
    }
    if(command === `${prefix}help`){
      var helpembed = new discord.RichEmbed()
        .setTitle('Help Embed')
        .setColor('FF0000')
        .setDescription('!help Laat dit zien\n !new Maak een ticket\n !members Laat de membercount zien\n !mentions Krijg een role voor mentions\n !unmentions Haal de mentions role weg')
        .setFooter('commano\'s');
      message.channel.send(helpembed)
    }
    if(command === `${prefix}new`){
      message.delete();
      let topic = args.join(" ");
  
      // let num = randomString({
      // 	length: 4,
      // 	numeric: true,
      // 	letters: false,
      // 	special: false,
      // });
      let id = message.author.id.toString().substr(0, 4) + message.author.discriminator;
      let chan = `ticket-${id}`;
  
      if (message.guild.channels.find(channel => channel.name === chan)) {
        if (config.useEmbeds) {
          const err1 = new Discord.RichEmbed()
            .setColor("#E74C3C")
            .setDescription(`:x: You already have an open ticket.`)
          return message.channel.send(err1)
        } else {
          message.channel.send(`:x: You already have an open ticket.`)
        }
  
      };
  
      message.guild.createChannel(`ticket-${id}`, {
        type: 'text'
      }).then(async c => {
        c.setParent(config.ticketsCat);
        // let supportRole = message.guild.roles.find(`id`, config.supportRole)
        let supportRole = message.guild.roles.get(config.supportRole)
        if (!supportRole) return message.channel.send(":x: No **Support Team** role found.");
  
  
        c.overwritePermissions(message.guild.defaultRole, {
          VIEW_CHANNEL: false,
          SEND_MESSAGES: false
        })
        c.overwritePermissions(message.member, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        c.overwritePermissions(supportRole, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true
        })
        c.setTopic(`${message.author} | ${topic}`);
        if (config.tagHereOnly) {
          await c.send(`@here, a user has created a new ticket.\n`);
        } else {
          await c.send(`<@&${config.supportRole}>, a user has created a new ticket.\n`);
        };
  
        if (config.ticketImage) {
          await c.send(`__**Here's your ticket channel, ${message.author}**__`, {
            files: [`./image.png`]
          })
        } else {
          await c.send(`__**Here's your ticket channel, ${message.author}**__`)
        }
  
        const created = new Discord.RichEmbed()
          .setColor(config.colour)
          .setDescription(`Your ticket (${c}) has been created.\nPlease read the information sent and follow any instructions given.`)
          .setTimestamp();
        const welcome = new Discord.RichEmbed()
          .setColor(config.colour)
          .setDescription(`**Ticket topic:** \`${topic}\`\n\n${config.ticketText}`)
  
  
        if (config.useEmbeds) {
          message.channel.send(created)
          let w = await c.send(welcome)
          await w.pin();
          // c.fetchMessage(c.lastMessageID).delete()
        } else {
          message.channel.send(`Your ticket (${c}) has been created.\nPlease read the information sent and follow any instructions given.`)
          let w = await c.send(`**Ticket topic:** \`${topic}\`\n\n${config.ticketText}`)
          await w.pin()
          // c.fetchMessage(c.lastMessageID).delete()
  
        }
        // log
        if (config.useEmbeds) {
          const embed = new Discord.RichEmbed()
            .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
            .setTitle("New Ticket")
            .setColor(config.colour)
            .setDescription(`\`${topic}\``)
            .addField("Username", message.author, true)
            .addField("Channel", c, true)
            .setFooter(`DiscordTickets`)
            .setTimestamp();
          client.channels.get(config.logChannel).send({
            embed
          })
        } else {
          client.channels.get(config.logChannel).send(`New ticket created by **${message.author.tag} (${message.author.id})**`);
        }
        log.info(`${message.author.tag} created a new ticket (#ticket-${id})`)
      })
  
    }
    if(command === `${prefix}claim`){
      message.delete();
      message.channel.send('This ticket has been claimed by: ' + message.member);
    }
    if(command === `${prefix}unclaim`){
      message.delete();
      message.channel.send(`${message.member} has unclaimed this ticket`);
    }
    if(command === `${prefix}add`){
      message.delete();
    if(!message.channel.name.startsWith('ticket-')) {
      if(config.useEmbeds) {
        const notTicket = new Discord.RichEmbed()
            .setColor("#E74C3C")
            .setDescription(`:x: **This command can only be used within a ticket channel**`)
        return message.channel.send(notTicket);
      } else {
        return message.channel.send(`:x: **This command can only be used within a ticket channel**`)
      }
    }

    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!user) {
      if(config.useEmbeds) {
        const err1 = new Discord.RichEmbed()
            .setColor("#E74C3C")
            .setDescription(`:x: **Unknown user.** Please mention a valid user.`)
            return message.channel.send(err1);
      } else {
        return message.channel.send(`:x: **Unknown user.** Please mention a valid user.`);
      }
    }
    try {
    message.channel.overwritePermissions(user, {
      SEND_MESSAGES: true,
      READ_MESSAGES: true,
      ATTACH_FILES: true
    });
    if(config.useEmbeds) {
      const added = new Discord.RichEmbed()
          .setColor(config.colour)
          .setDescription(`${user} has been added.`)
          message.channel.send(added);
    } else {
       message.channel.send(`${user} has been added.`);
    }
    // log
    if(config.useEmbeds) {
      const embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
        .setTitle("User Added")
        .setColor(config.colour)
        .addField("Username", user, true)
        .addField("Added by", message.author, true)
        .addField("Channel", message.channel, true)
        .setFooter(`DiscordTickets`)
        .setTimestamp();
      client.channels.get(config.logChannel).send({embed})
    } else {
      client.channels.get(config.logChannel).send(`User added to a ticket by **${message.author.tag} (${message.author.id})**`);
    }
    log.info(`${message.author.tag} added a user to a ticket (#${message.channel})`)
  } catch(error) {
    log.error(error);
  }
    }
    if(command === `${prefix}close`){
      message.delete();
      if(!message.channel.name.startsWith('ticket-')) { // // !message.channel.name.length() == 15 &&
        if(config.useEmbeds) {
          const notTicket = new Discord.RichEmbed()
              .setColor("#E74C3C")
              .setDescription(`:x: **This command can only be used within a ticket channel**`)
          return message.channel.send(notTicket);
        } else {
          return message.channel.send(`:x: **This command can only be used within a ticket channel**`)
        }
      } else {
        try {
          message.channel.delete()
          // log
          if(config.useEmbeds) {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${client.user.username} / Ticket Log`, client.user.avatarURL)
              .setTitle("Ticket Closed")
              .setColor(config.colour)
              .addField("Username", message.author, true)
              .addField("Channel", message.channel.name, true)
              .setFooter(`DiscordTickets`)
              .setTimestamp();
            client.channels.get(config.logChannel).send({embed})
          } else {
            client.channels.get(config.logChannel).send(`Ticket closed by **${message.author.tag} (${message.author.id})**`);
          }
          log.info(`${message.author.tag} closed a ticket (#${message.channel.name})`)
  
        } catch(error) {
          log.error(log.colour.red(error));
        }
      }
      if(command === `${prefix}warn`){
        const warns = JSON.parse(fs.readFileSync("./warn.json"));
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply('Tja.. Je kan dit niet doen.')
        var user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!user) return message.reply('Ik heb de gebruiker niet gevonden')
        if(user.hasPermission("BAN_MEMBERS")) return message.reply('Ik kan dit niet doen, deze gebruiker is een stafflid')
        var reason = args.join(" ").slice(22);
        if(!reason) return message.reply('Geef een reden op!');
        if(!warns[user.id]) warns[user.id] = {
          warns: 0
        };

        warns[user.id].warns++;

        fs.writeFile("./warn.json", JSON.stringify(warns), (err) => {
          if(err) console.log(err);
        })
      }
  
    }
    if(command === `${prefix}vip`){
      message.channel.reply('To buy VIP, you need to donate r$50 ||50 robux||!')
    }
    if(command === `${prefix}mentions`){
      
      var MRole = message.guild.roles.find(`name`, "GetTagged");
      message.member.addRole(MRole);
      message.reply('You got your role..')
    }
    if(command === `${prefix}unmentions`){
      var MRole = message.guild.roles.find(`name`, "GetTagged");
      message.member.removeRole(MRole);
      message.reply('Removed your role..')
    }
    if(command === `${prefix}members`){
      var membercount = message.guild.memberCount;
      message.reply(`${membercount}`);
    }
    if(command === `${prefix}giveaway`){
    // Argumenten die we later nodig hebben.
    var item = "";
    var time;
    var winnerCount;
 
    // Nakijken als je perms hebt om dit command te doen.
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Sorry jij kan dit niet doen");
 
    // !giveaway aantalWinnaars seconden itemOmTeWinnen.
 
    // Aantal winnaars opvragen.
    winnerCount = args[0];
    // Tijd hoelang het moet duren.
    time = args[1];
    // Welke prijs men kan winnen.
    item = args.splice(2, args.length).join(' ');
 
    // Verwijder het bericht dat net is gemaakt door de gebruiker.
    message.delete();
 
    // Verval datum berekenen.
    var date = new Date().getTime();
    var dateTime = new Date(date + (time * 1000));
 
    // Maak embed aan.
    var giveawayEmbed = new discord.RichEmbed()
        .setTitle("🎉 **GIVEAWAY** 🎉")
        .setFooter(`Vervalt: ${dateTime}`)
        .setDescription(item);
 
    // Verzend embed en zet de reactie op de popper.
    var embedSend = await message.channel.send(giveawayEmbed);
    embedSend.react("🎉");
 
    // Zet een timeout die na het aantal seconden af gaat.
    setTimeout(function () {
 
        // Argumenten die we nodig hebben.
        var random = 0;
        var winners = [];
        var inList = false;
 
        // Verkrijg de gebruikers die gereageerd hebben op de giveaway.
        var peopleReacted = embedSend.reactions.get("🎉").users.array();
 
        // Hier gaan we al de mensen over gaan en kijken als de bot er tussen staan
        // De bot moeten we uit de lijst weghalen en dan gaan we verder.
        for (var i = 0; i < peopleReacted.length; i++) {
            if (peopleReacted[i].id == bot.user.id) {
                peopleReacted.splice(i, 1);
                continue;
            }
        }
 
        // Hier kijken we na als er wel iemand heeft meegedaan.
        if (peopleReacted.length == 0) {
            return message.channel.send("Niemand heeft gewonnen dus de bot wint.");
        }
 
        // Tijdelijk kijken we na als er te wienig mensen hebben mee gedaan aan de wedstrijd.
        if (peopleReacted.length < winnerCount) {
            return message.channel.send("Er zijn te weinig mensen die mee deden daarom heeft de bot gewonnen.");
        }
 
        // Voor het aantal winnaars dat we eerder hebben opgegeven gaan we een random nummer aanmaken en de user in een array zetten.
        for (var i = 0; i < winnerCount; i++) {
 
            inList = false;
 
            // Aanmaken van een random getal zodat we een user kunnen kiezen.
            random = Math.floor(Math.random() * peopleReacted.length);
 
            // Als een winnaar al voorkomt in de winnaars lijst dan moeten we opnieuw gaan zoeken naar een andere winnaar.
            for (var y = 0; y < winners.length; y++) {
                // Nakijken als de geslecteerde winnaar al in de lijst zit.
                if (winners[y] == peopleReacted[random]) {
                    // We zetten i 1 minder zodat we opnieuw kunnen doorgaan in de lijst.
                    i--;
                    // We zetten dit op true zodat we weten dat deze al in de lijst zit.
                    inList = true;
                    break;
                }
            }
 
            // Zit deze niet in de lijst gaan we deze toevoegen.
            if (!inList) {
                winners.push(peopleReacted[random]);
            }
 
        }
 
        // Voor iedere winnaar gaan we een bericht sturen.
        for (var i = 0; i < winners.length; i++) {
            message.channel.send("Proficiat " + winners[i] + `! Je hebt gewonnen **${item}**.`);
        }
 
    }, 1000 * time);
    }
    });  
  bot.login(process.env.token);