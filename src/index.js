require("dotenv").config();



const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ChannelType,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ActivityType,
    InteractionCallback,
    MessageSearchAuthorType,
    AuditLogEvent,
    PermissionFlagsBits,
    time,
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

require('dotenv').config();

const {REST, Routes, ApplicationCommandOptionType, applicationDirectory, ApplicationWebhookEventStatus, ApplicationCommandType, PermissionOverwriteManager} = require('discord.js');



const commands = [ 


{

  name: "challenge",

  description: "challenge some one",

  options: [{

    name: "person",

    description: "the person you want to challenge",

    type: ApplicationCommandOptionType.Mentionable,

    required: true,



}]},
  {
    
    name: "ban",

    description: "Ban someone",

    default_member_permissions: PermissionFlagsBits.Administrator.toString(),

    options: [
        {
        name: "usermention",

        description: "hi",

        type: ApplicationCommandOptionType.Mentionable,

        required: true,

        
        },
        {
          name: "reason",

          description: "give a reason for the ban",

          type: ApplicationCommandOptionType.String
        },
        
    ],  
    




  },
  { name: "ping",

  description: "mention the ping role",

  options: [{
    name: "message",

    description: "send a message with the ping",

    type: ApplicationCommandOptionType.String

  }]

  }
      




];
const rest = new REST({
    version: 10,
});



rest.setToken(process.env.TOKEN);



(async () => {
   try {

     console.log('Registring slash commands...');

    await rest.put(

       Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
       {body: commands }


    );

    console.log('slash commands has registred successfully!');
    
   } catch (error) {

     console.log(`there was a error the error was: ${error}`);
    
   } 


})();



client.on("clientReady", (c) => {
    console.log(`logged in as ${client.user.tag}`);

    client.user.setActivity({
        
        name: "GTA 6",

        type: ActivityType.Playing

})
});

// Ping role button message

client.on("messageCreate", (msg) => {
   


    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("my_button")
            .setLabel("🔔")
            .setStyle(ButtonStyle.Success)
    );
    
if (msg.content === "button") {

        msg.channel.send({
            embeds: [

              new EmbedBuilder()
              .setTitle("__🔔the ping role__")
              .addFields({name: "__❓what dose it do__", value: "\nIt give us the right to mension you"+"\nwhen ever we want to"},
                         {name: "__❓what do I get__", value: "\nyou will get to see our news"+"\nand be the first to know about it"},
                         {name: "__❓how to get it__", value: "\nto get the" + " " + "<@&1521643199943282851>" + " " + "just click the button down below"},
               ).setColor("Yellow")




            ],

            components: [row]
        });

         msg.delete()

    }

});

// Ping role give and remove from user

client.on("interactionCreate", async (iny) => {

    if (!iny.isButton()) return;

    if (iny.customId === "my_button") {

        const roleId = "1521643199943282851";

        if (!iny.member.roles.cache.has(roleId)) {

            await iny.member.roles.add(roleId);

            await iny.reply({
                content: "🔔 the role <@&1521643199943282851> has been added",
                flags: MessageFlags.Ephemeral
            });

        } else {

            await iny.member.roles.remove(roleId);

            await iny.reply({
                content: "🔕 the role <@&1521643199943282851> has been removed",
                flags: MessageFlags.Ephemeral
            });

        }

    }

});

// ban slash command interaction

client.on("interactionCreate", async (int) => { 

if (int.commandName === "ban") {

    let member = int.options.getMember("usermention");

    if (!member) {
        return int.reply({
            content: "🤔couldn't find user",
            flags: MessageFlags.Ephemeral
        });
    }

    let reason = int.options.getString("reason") || "No reason";

    let embed = new EmbedBuilder()
        .setTitle(`__🚫You just got banned from ${int.guild.name} server__`)
        .addFields({name: "__❓reason__", value: "```" + reason + "```"})
        .setColor("White")
        .setAuthor({name: int.user.globalName, iconURL: int.user.avatarURL()})
        .setThumbnail(int.guild.iconURL())
        .setTimestamp();

    // Try to send DM, but don't crash if DMs are closed

    try {
        await member.send({ embeds: [embed] });
    } catch (err) {
        console.log(`Cannot send DM to ${member.user.tag}`);
    }

    await member.ban({ reason });

    await int.reply({
        content: `✅ تم حظر ${member.user.tag}`,
        flags: MessageFlags.Ephemeral
    });
}

    

});



// ping system

const Users = new Map();

client.on("interactionCreate", async (interaction) => {

if (interaction.commandName !== "ping") return;


    if (Users.has(interaction.user.id)) {

return interaction.reply({content: "wait for"+ "```" + "10m" +"```" + "for next ping",  flags: MessageFlags.Ephemeral })}


const embed4 = new EmbedBuilder()
.setAuthor({
    name: interaction.member.displayName,
    iconURL: interaction.user.displayAvatarURL()
})
.setFooter({text: "🔔pinged by" + " " + interaction.user.username})
.setTimestamp()
.setColor("Yellow")
.setTitle(interaction.options.getString("message") || null )

Users.set(interaction.user.id, true);

try {
   await interaction.channel.send({
    content: "<@&1521643199943282851>",
    embeds: [embed4]
});

    await interaction.reply({
    content: "ping succeed!",
    flags: MessageFlags.Ephemeral
});

await new Promise(resolve => setTimeout(resolve, 600000));
    
    await interaction.user.send({
    embeds: [
        new EmbedBuilder()
            .setTitle(`__🥳You can ping now! in ${interaction.guild} server__`)
            .setDescription("**[Go to server](https://discord.gg/8EvubxT5)**")
            .setThumbnail(interaction.guild.iconURL())
            .setColor("Green")
            .setTimestamp()
    ]
});
} finally {
    Users.delete(interaction.user.id);
}

});

// challeng system

const players = new Map();

const challeng = new Map();

const players2 = new Map();

const players3 = new Set();

const timeout = new Map();



let start = 0


client.on("interactionCreate", async (int) => {

if (!int.isChatInputCommand) return;

if (int.commandName === "challenge") {

const name = int.options.getUser("person")

    if (challeng.get("playIdd") === int.user.id) {return await int.reply({content: `❌ You have already sent a challeng to ${name}
        wait for him to reply first` ,
flags: MessageFlags.Ephemeral


})} else {

     

// var

const player = int.options.getUser("person")



const Yes = new ButtonBuilder().setCustomId("challenge_button_yes").setLabel("✅").setStyle(ButtonStyle.Success)

const No = new ButtonBuilder().setCustomId("challenge_button_no").setLabel("❌").setStyle(ButtonStyle.Danger)

const row = new ActionRowBuilder().addComponents(Yes, No)

const Embede = new EmbedBuilder().setColor("White")


.setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5B5gXSuH5yBpbAGYnHqbud2TrKrJXeM-JC5ydzrvLA&s=10")
.setTitle("__❗Some one has challenged you__")
.setDescription(`From: ${int.guild} server`)
.setTimestamp()
.addFields(
    {name: "__🤔Who is it__", value: `•${int.user.globalName}`},
     {name: "__🎮Game type__", value: "chairs game"},
    {name: "__💢How to Deny it__", value: "•just click the ❌ button down below"},
    {name: "__👍How to accept it__", value: "•just click the ✅ button down below"});

    if (!player) {return int.reply({content: "❌ i didn't find any one with that user"})}

    if (player.id === int.user.id) {return int.reply({content: "❌ You can't challeng your self", flags: MessageFlags.Ephemeral})}

    if (player.bot) {return int.reply({content: "❌ You can't challeng a bot", flags: MessageFlags.Ephemeral})}

    
     const msg = await player.send({ embeds: [Embede], components: [row] })

     timeout.set("time", true)

const Timeout = setTimeout(async () => {

    if (!timeout.has("time")) return;

     challeng.delete("playIdd")



    await msg.edit({
        embeds: [
            new EmbedBuilder()
                .setTitle("❌challeng expierd")
                .setColor("Red")
                .setTimestamp()
        ],
        components: []
    });
}, 60000);

    await int.reply({content: "✅challeng has been sent",
                flags: MessageFlags.Ephemeral

                
    });

challeng.set("playIdd", int.user.id)


}
    
    

    players.set("playId", int.user.id)

    players.set("play", int.user.globalName)







}
       if (int.customId === "challenge_button_no") {

timeout.delete("time")

  challeng.delete("playIdd")

    return int.update({
        embeds: [
            new EmbedBuilder()
                .setTitle("❌ denied successfully")
                .setColor("Red")
                .setTimestamp()
        ],
        components: []
    });


  
    await int.reply({content: "✅challeng has been sent",
                flags: MessageFlags.Ephemeral

                
    });



   

    players.set("playId", int.user.id)

    players.set("play", int.user.globalName)

    players.get("players")





}
    if (int.isButton) {


    

if (int.customId === "challenge_button_yes") {

    timeout.delete()

    await players2.set("player", int.user.id)


    client.guilds.cache.first().channels.create({



    name: `${int.user.globalName} vs ${players.get("play")}`,

type: ChannelType.GuildText,

parent: "1525311378922016839"

       })

    return int.update({
        embeds: [
            new EmbedBuilder()
                .setTitle("✅ accepted successfully")
                .setColor("Green")
        ],
        components: []
    });
}



    if (int.customId === "ready") {

    


     if (players3.has(int.user.id)) {

        start -= 1

              await int.update({

 

content: "<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">" + " " +  " " + "👥"+"("+start+"/"+"2"+")",

embeds: [new EmbedBuilder()
    .setTitle("<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">")
    .setColor("Green")
    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5B5gXSuH5yBpbAGYnHqbud2TrKrJXeM-JC5ydzrvLA&s=10")
    .addFields({name: "❓__What's the game about__", value: "\n•You have to be the first one click the button\n"},
        {name: "❓__When will the game is goning to start__", value: "\n•When the both of you click the 🎮 button\n"}
    )



],

components: [ new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("🎮").setCustomId("ready").setStyle(ButtonStyle.Success))]})

     players3.delete(int.user.id)
        
  await int.followUp({content: "❌not ready", flags: MessageFlags.Ephemeral})
     
        
     

     } else {

           players3.add(int.user.id) 

           start += 1

                const em = await int.update({

 

content: "<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">" + " " +  " " + "👥"+"("+start+"/"+"2"+")",

embeds: [new EmbedBuilder()
    .setTitle("<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">")
    .setColor("Green")
    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5B5gXSuH5yBpbAGYnHqbud2TrKrJXeM-JC5ydzrvLA&s=10")
    .addFields({name: "❓__What's the game about__", value: "\n•You have to be the first one click the button\n"},
        {name: "❓__When will the game is goning to start__", value: "\n•When the both of you click the 🎮 button\n"}
    )



],

components: [ new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("🎮").setCustomId("ready").setStyle(ButtonStyle.Success))]})

            await int.followUp({content: "✅ready", flags: MessageFlags.Ephemeral})


    

      if (start === 2) {

         let time = 5

        
        for (let index = 1; index <= 5; index++) {
            
            time -= 1

           int.channel.send("⏳Game is starting in" + " "+ time + "...")
        
           await new Promise(resolve => setTimeout(resolve, 2000));
        

        const messages = await int.channel.messages.fetch({ limit: 1});

        await int.channel.bulkDelete(messages, true);

        if (start !== 2) {

   const message = int.followUp("😭Game just canceled")

        await new Promise(resolve => setTimeout(resolve, 3000));

        int.channel.delete();

        challeng.delete("playId")

        break;
        }

        }

    await em.edit({

 

content: "<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">" + " " +  " " + "👥"+"("+start+"/"+"2"+")",

embeds: [new EmbedBuilder()
    .setTitle("<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">")
    .setColor("Green")
    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5B5gXSuH5yBpbAGYnHqbud2TrKrJXeM-JC5ydzrvLA&s=10")
    .addFields({name: "❓__What's the game about__", value: "\n•You have to be the first one click the button\n"},
        {name: "❓__When will the game is goning to start__", value: "\n•When the both of you click the 🎮 button\n"}
    )



],

components: [ new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("➖").setCustomId("ready").setStyle(ButtonStyle.Danger).setDisabled(true))]})

        const row =  new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("chair")
                .setLabel("🪑")
                .setDisabled(true)
        )
    
const b = await int.followUp({
    content: "Be ready!",
    components: [row]
});

await new Promise(resolve => setTimeout(resolve, 3000));

await b.edit({  content: "🚨CLICK NOW🚨",
    components: [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setCustomId("chair")
                .setLabel("🪑")
                .setDisabled(false)
        )
    ]
});



      }


      }



      
    }          if (int.customId === "chair") {
    
        
        await int.reply({  content: " ",
    components: [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("chair")
                .setLabel("🪑")
                .setDisabled(true)
        )
    ]
})

     
        
       const messages = await int.channel.messages.fetch({ limit: 2});

        int.channel.bulkDelete(messages, true);



       await int.channel.send(`🥳${int.user} Has won the round`)
    

      await new Promise(resolve => setTimeout(resolve, 3000));

     int.channel.send("The challeng has been ended, channel is deleteing in 3s")

      
     await new Promise(resolve => setTimeout(resolve, 3000));

     int.channel.delete();
    
    }

  }


    })

client.on("channelCreate", (channel) => {if (channel.parent.name === "Challenges") {
    
    const Row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("🎮").setCustomId("ready").setStyle(ButtonStyle.Success))
    
    channel.send({

 

content: "<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">" + " " + " "+ "👥"+"("+start+"/"+"2"+")",

embeds: [new EmbedBuilder()
    .setTitle("<@" + players2.get("player") + ">" + " " + "vs" + " " + "<@" + players.get("playId") + ">")
    .setColor("Green")
    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK5B5gXSuH5yBpbAGYnHqbud2TrKrJXeM-JC5ydzrvLA&s=10")
    .addFields({name: "❓__What's the game about__", value: "\n•You have to be the first one click the button\n"},
        {name: "❓__When will the game is goning to start__", value: "\n•When the both of you click the 🎮 button\n"}
    )



],

components: [Row]


 } ) } })
client.login(process.env.TOKEN);
