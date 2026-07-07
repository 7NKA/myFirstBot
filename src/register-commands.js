require('dotenv').config();

const {REST, Routes, ApplicationCommandOptionType, applicationDirectory, ApplicationWebhookEventStatus, ApplicationCommandType, PermissionFlagsBits, PermissionOverwriteManager} = require('discord.js');


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
        }
    ],
    




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


