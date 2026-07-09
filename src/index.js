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
              .setTitle("🔔_the ping role_")
              .addFields({name: "❓_what dose it do_", value: "\n_It give us the right to mension you_"+"\n_when ever we want to_"},
                         {name: "❓_what do I get_", value: "\n_you will get to see our news_"+"\n_and be the first to know about it_"},
               
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

}})

client.login(process.env.TOKEN);