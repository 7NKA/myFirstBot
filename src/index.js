require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    MessageFlags,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ActivityType,
    InteractionCallback,
    MessageSearchAuthorType,
    AuditLogEvent,
    PermissionFlagsBits,
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

  name: "delete-messages",

  description: "delete",

  options: [{

    name: "delete",

    description: "number of the messages",

    type: ApplicationCommandOptionType.Number,

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

  description: "mention the ping role"

  }
      




];
const rest = new REST({
    version: 10,
});

console.log(rest);
console.log(typeof rest.setToken);

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

client.on("interactionCreate", (int) => {

if (int.customId === "my_button" && !int.member.roles.cache.has("1521643199943282851") ) {
 


int.member.roles.add("1521643199943282851")


int.reply({

  content: "the role" + " " + "<@&1521643199943282851>" + " " + "has been add",

  flags: MessageFlags.Ephemeral


})



} else if (int.member.roles.cache.has('1521643199943282851')) {

int.reply({

content: "the role" + " " + "<@&1521643199943282851>" + " " + "has been removed",

    flags: MessageFlags.Ephemeral

})

int.member.roles.remove("1521643199943282851")}});

// ban slash command interaction

client.on("interactionCreate", async (int) => { 

if (int.commandName === "ban")
     {

      let member = int.options.getMember("usermention");

    

let reason = int.options.getString("reason");
 
let embed = new EmbedBuilder()
.setTitle(`لقد تلقيت حظر من سيرفر${int.guild.name}`)
.addFields({name:"سبب الباند", value:"```" + reason + "```" })
.setColor("White")
.setTimestamp()

await member.send({ embeds: [embed]})   




      await member.ban({ reason })

      

     



      int.reply({
        
        content: `تم حظر ${member}`,
    

        flags: MessageFlags.Ephemeral})
    }

})

// channel Create Event log

client.on("channelCreate", async (channel) => {


let channelId = client.channels.cache.get("1523805053633167575")


const channelLog = await channel.guild.fetchAuditLogs({
limit: 1,

type: AuditLogEvent.ChannelCreate,

});

const channelAuthor = channelLog.entries.first();



if (channelAuthor) {

const embed = new EmbedBuilder()
.setTitle("🖥️ a Channel has been created!")
.setTimestamp()
.setColor("Green")
.addFields(
    {name: "👤created by", value: channelAuthor.executor.tag},
    {name: "📝channel name", value: channel.name },
     {name: "🆔channel Id", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

}});

// channel Delete Event log

client.on("channelDelete", async (channel) => {
    

let channelId = client.channels.cache.get("1523805053633167575")


const channelLog = await channel.guild.fetchAuditLogs({
limit: 1,

type: AuditLogEvent.ChannelDelete,

});

const channelAuthor = channelLog.entries.first();



if (channelAuthor) {

const embed = new EmbedBuilder()
.setTitle("🖥️ a Channel has been deleted!")
.setTimestamp()
.setColor("Red")
.addFields(
    {name: "👤deleted by", value: channelAuthor.executor.tag},
    {name: "📝channel name", value: channel.name },
     {name: "🆔channel Id", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

}});

// message create Event log

client.on("messageCreate", (int) => {

if (int.channel.id === "1523805053633167575") {return;}

if (int.author.bot) {return; }

const embed2 = new EmbedBuilder()
.setTitle("✍️Message has been created")
.addFields({name: "🧑‍🦰Message Author", value: int.author.tag},{name: "📄Message content", value: "```" + int.content + "```" })
.setTimestamp()
.setColor("Green")

let channelId = client.channels.cache.get("1523805053633167575")

channelId.send({ embeds: [embed2]})

});

// delete message Event log

client.on("messageDelete", async (msg) => {

if (msg.channel.id === "1523805053633167575") {return;}

if (!msg.guild) {return;}


    const deletFech = await msg.guild.fetchAuditLogs({

           limit: 1,

           type: AuditLogEvent.MessageDelete,

    });
    
    const delesionlog = deletFech.entries.first();

    
      if (delesionlog) {
    

const embed3 = new EmbedBuilder()
.setTitle("🧹Message has been deleted")
.addFields({name: "🧑Message deleted by", value: delesionlog.executor.tag},{name: "📄Message content", value: "```" + msg.content + "```" || "nil" })
.setTimestamp()
.setColor("Red")

let channel = client.channels.cache.get("1523805053633167575")

channel.send({ embeds: [embed3]})
        

}});

client.on("interactionCreate", (int) => {

if (int.commandName === "ping") {


const embed4 = new EmbedBuilder()
.setAuthor({
    name: int.member.displayName,
    iconURL: int.user.displayAvatarURL()
})
.setFooter({text: "pinged by" + " " + int.user.tag})
.setTimestamp()
.setColor("Yellow")

    int.reply({ embeds: [ embed4 ], 
               
               content: "<&1521643199943282851>"}
             
        )
}

})
client.login(process.env.TOKEN);
