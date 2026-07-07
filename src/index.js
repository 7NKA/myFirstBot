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
              .setTitle("the ping role")
              .addFields({name: "what dose it do?", value: "\nIt give us the right to mension you"+"\nwhen ever we want to"},
                         {name: "what do I get?", value: "\nyou will get to see our news"+"\nand be the first to know about it"},
               
               ).setColor("Yellow")




            ],

            components: [row]
        });

         msg.delete()

    }

});

client.on("interactionCreate", async (int) => {

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

int.member.roles.remove("1521643199943282851") 


} else if (int.commandName === "delete-messages") {


        const amount = int.options.getNumber("delete");

        const messages = await int.channel.messages.fetch({
            limit: amount
        });

        if (messages.size > 0) {

            await int.channel.bulkDelete(messages, true);

            return int.reply({
                content: `تم حذف ${messages.size} من الرسائل`,
                ephemeral: true,
            });

        }

        return int.reply({
            content: "لا توجد رسائل لحذفها.",
            ephemeral: true,
        });
    
    } else if (int.commandName === "ban")
     {

      let member = int.options.getMember("usermention");

    

let reason = int.options.getString("reason");
 
let embed = new EmbedBuilder().setTitle(`لقد تلقيت حظر من سيرفر${int.guild.name}`).addFields({name:"سبب الباند", value:"```" + reason + "```" })

await member.send({ embeds: [embed]})   




      await member.ban({ reason })

      

     



      int.reply({
        
        content: `تم حظر ${member}`,
    

        ephemeral: true})
    }

});

client.on("channelDelete", (channel) => {

let channelId = client.channels.cache.get("1523805053633167575")

const embed = new EmbedBuilder()
.setTitle("🖥️ a Channel has been deleted!")
.setTimestamp()
.setColor("Red")
.addFields(
    
    {name: "📝channel name", value: channel.name },
     {name: "🆔channel Id", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

});

client.on("channelCreate", (channel) => {

let channelId = client.channels.cache.get("1523805053633167575")

const embed = new EmbedBuilder()
.setTitle("🖥️ a Channel has been created!")
.setTimestamp()
.setColor("Green")
.addFields(
    
    {name: "📝channel name", value: channel.name },
     {name: "🆔channel Id", value: "```" + channel.id + "```"})

if (channelId) {channelId.send({ embeds: [embed]})}

});




client.login(process.env.TOKEN);