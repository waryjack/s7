// @imports
import { S7 } from "./config.js";
import S7Actor from "./actor/S7Actor.js";


// Init Hook
Hooks.once("init", () => {
    console.log("### S7| Initializing Shadowrun 7-Ish ###");

    CONFIG.s7 = S7;
   
    // Add namespace in global 
    
    game.S7 = {
        S7Actor
    };

    
    // Unregister core sheets
    // Actors.unregisterSheet("core", ActorSheet);
    // Items.unregisterSheet("core", ItemSheet);

    // Register System sheets
  
    // CONFIG settings for entities
    CONFIG.Actor.entityClass = S7Actor;

    // Register system settings
   // registerSettings();
    
    // Register partials templates
   // preloadHandlebarsTemplates();
   
    // Register handlebar helpers
    Handlebars.registerHelper('ife', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("times", function(n, content) {
       let result = "";
       if (n==0 || n == null) return;
       for (let i = 0; i < n; i++) {
           result += content.fn(i)
       }
       
       return result;

    });

    //uppercases; needs work
    Handlebars.registerHelper("proper", function(content) {
        let result = "";

        result = content[0].toUpperCase() + content.substring(1);

        return result;

    });

    Handlebars.registerHelper("minus", function(arg1, arg2) {
        let result = arg1 - arg2;

        return result;
    });

    Handlebars.registerHelper("render", function(arg1){
        
        return new Handlebars.SafeString(arg1);
    });

    // Checks whether a game setting is active
    Handlebars.registerHelper("setting", function(arg){
        return game.settings.get('ewhen', arg); 
    });

    Handlebars.registerHelper("concat", function(...args){
        let result = "";
        for (let a of args) {
            result += a;
        }

        return result;
    });

    Handlebars.registerHelper("and", function(a, b){
        return (a && b); 
    });

    Handlebars.registerHelper("or", function(a, b){
        return (a || b);
    });
});