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

client.on("interactionCreate", (iny) => {

if (!iny.isButton()) return;
    
if (iny.customId === "my_button" && !iny.member.roles.cache.has("1521643199943282851") ) {
 


iny.member.roles.add("1521643199943282851")


iny.reply({

  content: "🔔the role" + " " + "<@&1521643199943282851>" + " " + "has been add",

  flags: MessageFlags.Ephemeral


})



} else if (iny.member.roles.cache.has('1521643199943282851')) {

iny.reply({

content: "🔕the role" + " " + "<@&1521643199943282851>" + " " + "has been removed",

    flags: MessageFlags.Ephemeral

})

iny.member.roles.remove("1521643199943282851")}});

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
.setTitle("__🖥️ a Channel has been created!__")
.setDescription("more info")
.setTimestamp()
.setColor("Green")
.addFields(
    {name: "__👤Created by__", value: `${channelAuthor.executor}`},
    {name: "__📝Channel name__", value: channel.name },
     {name: "__🆔Channel Id__", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

}});

// channel Delete Event log

client.on("channelDelete", async (channel) => {
    

let channelId = client.channels.cache.get("1523805053633167575")


const channelLog2 = await channel.guild.fetchAuditLogs({
limit: 1,

type: AuditLogEvent.ChannelDelete,

});



const channelAuthor2 = channelLog2.entries.first();



if (channelAuthor2) {

const embed = new EmbedBuilder()
.setTitle("__🖥️ a Channel has been deleted!__")
.setDescription("more info")
.setTimestamp()
.setColor("Red")
.addFields(
    {name: "__👤Deleted by__", value: `${channelAuthor2.executor}`},
    {name: "__📝Channel name__", value: channel.name },
     {name: "__🆔Channel Id__", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

}});

// message create Event log

client.on("messageCreate", (msg) => {

if (msg.embeds.length > 0) {return;}
    
if (msg.channel.id === "1523805053633167575") {return;}

if (msg.author.bot) {return; }

const embed2 = new EmbedBuilder()
.setTitle("__✍️Message has been created__")
.setDescription("more info")
.addFields({name: "__👤Message Author__", value: `${msg.author}`},{name: "__📄Message content__", value: "```" + msg.content + "```" })
.setTimestamp()
.setColor("Green")

let channelId = client.channels.cache.get("1523805053633167575")

channelId.send({ embeds: [embed2]})

});

// delete message Event log

client.on("messageDelete", async (msg) => {

if (msg.embeds.length > 0) {return;}
    
if (msg.channel.id === "1523805053633167575") {return;}

if (!msg.guild) {return;}


    const deletFech = await msg.guild.fetchAuditLogs({

           limit: 1,

           type: AuditLogEvent.MessageDelete,

    });
    
    const delesionlog = deletFech.entries.first();

    
      if (delesionlog) {
    

const embed3 = new EmbedBuilder()
.setTitle("__🧹Message has been deleted__")
.setDescription("more info")
.addFields({name: "__👤Message Author__", value: `${msg.author}`},{name: "__👤Message deleted by__", value: "<@" + delesionlog.executor.id+ ">"},{name: "__📄Message content__", value: "```" + msg.content + "```" || "nil" })
.setTimestamp()
.setColor("Red")

let channel = client.channels.cache.get("1523805053633167575")

channel.send({ embeds: [embed3]})
        

}});

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

})
client.login(process.env.TOKEN);
