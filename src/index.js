require("dotenv").config();


const Datebase = require("better-sqlite3");

const db = new Datebase("datebase.db");


db.prepare(`
    CREATE TABLE IF NOT EXISTS AgeUsers (
    
    userId TEXT PRIMARY KEY,
    username TEXT,
    age INTEGER
    
)
    

    `).run();



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
    SelectMenuAssertions,
    ComponentsV2Assertions,
    TextDisplayBuilder,
    SeparatorBuilder,
    ContainerBuilder,
    StringSelectMenuBuilder,
    SeparatorComponent,
    time,
    Role,
    MessageFlagsBitField,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    TextInputAssertions
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

// search and sign system

client.on("messageCreate", async (msg) => {

    if (msg.content === "S&S") {

        const TextContainer = new TextDisplayBuilder()
            .setContent("# Choose your actions!");

        const TextContainer2 = new TextDisplayBuilder()
            .setContent("## •You have to apply to the server\n ## •So you can access other server channels");

        const sparetor = new SeparatorBuilder();

        const DeleteButton = new ButtonBuilder()
            .setCustomId("Delete")
            .setEmoji("🗑️")
            .setLabel("Delete my info")
            .setStyle(ButtonStyle.Danger);

        const SearchButton = new ButtonBuilder()
            .setCustomId("MySelfSearch")
            .setEmoji("🔎")
            .setLabel("Show my info")
            .setStyle(ButtonStyle.Primary);

        const SearchAllButton = new ButtonBuilder()
            .setCustomId("AllSearch")
            .setEmoji("👥")
            .setLabel("Show all members info")
            .setStyle(ButtonStyle.Primary);

        const selectMenus = new StringSelectMenuBuilder()
            .setCustomId("menu")
            .setPlaceholder("choose!")
            .addOptions([
                {
                    label: "Sing",
                    description: "Insert your info",
                    value: "1",
                    emoji: "💾"
                },
                {
                    label: "Update your info",
                    description: "Update your old info",
                    value: "2",
                    emoji: "🔃"
                },
                {
                    label: "Search for some one",
                    description: "Search some one info",
                    value: "3",
                    emoji: "🔎"
                },




            ]);

        const ButtonRow = new ActionRowBuilder()
            .addComponents(DeleteButton, SearchButton, SearchAllButton);

        const SelectRow = new ActionRowBuilder()
            .addComponents(selectMenus);

        const Container = new ContainerBuilder()
            .addTextDisplayComponents(TextContainer)
            .addSeparatorComponents(sparetor)
            .addTextDisplayComponents(TextContainer2)
            .addSeparatorComponents(sparetor)
            .addActionRowComponents(SelectRow)
            .addSeparatorComponents(sparetor)
            .addActionRowComponents(ButtonRow);

        await msg.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [Container]
        });
    }

});

// sign

client.on("interactionCreate", async (int) => {

    if (int.isStringSelectMenu()) {

        if (int.customId === "menu") {

            const choice = int.values[0];

            if (choice === "1") {

                const modal = new ModalBuilder()
                    .setCustomId("SignModal")
                    .setTitle("inter your info🔽");

                const NameInput = new TextInputBuilder()
                    .setCustomId("name")
                    .setLabel("Name")
                    .setPlaceholder("ex: Hussam")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short);

                    const AgeInput = new TextInputBuilder()
                    .setCustomId("age")
                    .setLabel("Age")
                    .setPlaceholder("ex: 18")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short);

                const NameRow = new ActionRowBuilder()
                    .addComponents(NameInput)

                const AgeRow = new ActionRowBuilder()
                    .addComponents(AgeInput)

                modal.addComponents(NameRow, AgeRow);

                await int.showModal(modal);

// search

            }

                            if (choice === "3") {

                const modal = new ModalBuilder()
                    .setCustomId("SearchModal")
                    .setTitle("Search someone info🔽");

                const idInput = new TextInputBuilder()
                    .setCustomId("id")
                    .setLabel("Id")
                    .setPlaceholder("ex: 11537238294204")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short);

                const idRow = new ActionRowBuilder()
                    .addComponents(idInput)

                modal.addComponents(idRow);

                await int.showModal(modal);


                }

// update

                    if (choice === "2") {

                const modal = new ModalBuilder()
                    .setCustomId("UpdateModal")
                    .setTitle("Update your info🔽");

                const NewNameInput = new TextInputBuilder()
                    .setCustomId("NewName")
                    .setLabel("change name")
                    .setPlaceholder("ex: Hussam")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short);

                const NewAgeInput = new TextInputBuilder()
                    .setCustomId("NewAge")
                    .setLabel("change Age")
                    .setPlaceholder("ex: 18")
                    .setRequired(true)
                    .setStyle(TextInputStyle.Short);

                const NewNameRow = new ActionRowBuilder()
                    .addComponents(NewNameInput)

                const NewAgeRow = new ActionRowBuilder()
                    .addComponents(NewAgeInput)

                modal.addComponents(NewNameRow, NewAgeRow);

                await int.showModal(modal);

         }

      }

   }  

// sign system

    if (int.isModalSubmit()) {

        if (int.customId === "SignModal") {

         const name = int.fields.getTextInputValue("name")
  
         const age = int.fields.getTextInputValue("age")

         const check = db.prepare(`
            
            SELECT * FROM AgeUsers

            WHERE userId = ?
            `).get(int.user.id)
            
            if (check) {return int.reply({content: "❌You have already signed before!", flags: MessageFlags.Ephemeral});
            
            
            }

         db.prepare(`
            INSERT INTO AgeUsers(
            
            userId,
            username,
            age
            
            
            )
            VALUES (?, ?, ?)
            `).run(
                 int.user.id,
                 name,
                 age
            );

        await int.reply({content: "✅You have been signed successfully", flags: MessageFlags.Ephemeral})


        }

    }

// search system

                if (int.customId === "SearchModal") {

if (int.member.permissions.has(PermissionFlagsBits.Administrator)) {
                
             const idInput = int.fields.getTextInputValue("id") 

            const user =  db.prepare(`
                SELECT * FROM AgeUsers
                
                WHERE userId = ?

                `).get(idInput)

                if (user) {

                int.reply({embeds: [new EmbedBuilder().setColor("White")
                    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4a3fRsnjuGAy4UjGdc3gj7FRBSQw3mg15T33a7ZIpQ&s=10")
                    .setTitle("__🧾User info__")
                    .addFields({name: "Name", value: `${user.username}`},
                        {name: "Age", value: `${user.age}`}
                    )
                
                
                
                ], flags: MessageFlags.Ephemeral})} else {int.reply({content: "❌Didn't find any member with the this id", flags: MessageFlags.Ephemeral})}
    
        } else {int.reply({content: "❌You don't have the premission for that", flags: MessageFlags.Ephemeral})}
    
    }

// update info system

          if (int.isModalSubmit()) {


           if (int.customId === "UpdateModal") {

        const newname = int.fields.getTextInputValue("NewName")

        const newage =  int.fields.getTextInputValue("NewAge")

             const user =  db.prepare(`
                SELECT * FROM AgeUsers
                
                WHERE userId = ?

                `).get(int.user.id)

                if (user) {

                db.prepare(`
                    
                    UPDATE AgeUsers

                    SET username = ?,  age = ?
                    WHERE userId = ?
            
                    
                    
                    
                    
                    `).run(
                      newname,
                      newage,
                      int.user.id
                    )

                  await int.reply({content:"✅Info has been updated successfully", flags: MessageFlags.Ephemeral})
                    
                    } else {int.reply({content:"❌You don't have any info to update", flags: MessageFlags.Ephemeral})}





           }

        } 

});

client.on("interactionCreate", async (int) => {

// delete info system

     if (int.customId === "Delete") {

                const user =  db.prepare(`
                SELECT * FROM AgeUsers
                
                WHERE userId = ?
                `).get(int.user.id)

                if (user) {

db.prepare(`
    
    DELETE FROM AgeUsers
    
    WHERE userId = ?
    `).run(int.user.id)

     int.reply({content: "✅Your info got deleted successfully", flags: MessageFlags.Ephemeral})



     } else {return int.reply({content: "❌You don't have any info to delete", flags: MessageFlags.Ephemeral})}
    }

// self Search system

    if (int.customId === "MySelfSearch") {
            const user =  db.prepare(`
                
                SELECT * FROM AgeUsers
                
                WHERE userId = ?

                `).get(int.user.id)

                if (user) {

                int.reply({embeds: [new EmbedBuilder().setColor("White")
                    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4a3fRsnjuGAy4UjGdc3gj7FRBSQw3mg15T33a7ZIpQ&s=10")
                    .setTitle("__🧾Your info__")
                    .addFields({name: "Name", value: `${user.username}`},
                        {name: "Age", value: `${user.age}`}
                    )
                
                
                
                ], flags: MessageFlags.Ephemeral})} else {int.reply({content: "❌Didn't find any info about you", flags: MessageFlags.Ephemeral})}

    }
      
                if (int.customId === "AllSearch") {

            const users = db.prepare(`
                
                SELECT * FROM AgeUsers
                `).all();

                let member = {};

              
                    
              let  felids = []

              let number = 0

                 users.forEach(user => {number += 1 ,felids.push({name: number+ "-" + " " + " " +`${user.username}`, value: `${user.age}`},)

                })

                   if (users.length > 0) {

                      const embed = new EmbedBuilder()
                      .setTitle("__👥All members__")
                      .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM4a3fRsnjuGAy4UjGdc3gj7FRBSQw3mg15T33a7ZIpQ&s=10")
                      .setColor("White")
                     .addFields(felids)

                    
                        int.reply({embeds: [embed], flags: MessageFlags.Ephemeral})
                    

                } else {

                    const embeda = new EmbedBuilder()
                      .setColor("White")
                     .setDescription("👥No Members yet")

                     int.reply({embeds: [embeda], flags: MessageFlags.Ephemeral})

                }

            }

})



client.login(process.env.TOKEN)