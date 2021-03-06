// @imports
import { S7 } from "./config.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import S7ActorSheet from "./sheets/actor/S7ActorSheet.js";
import S7Actor from "./actor/S7Actor.js";
import S7ItemSheet from "./sheets/item/S7ItemSheet.js";
import { registerSettings } from "./settings.js";

// Init Hook
Hooks.once("init", () => {
    console.log("### S7| Initializing Shadowrun 7-Ish ###");

    CONFIG.s7 = S7;
   
    // Add namespace in global 
    
    game.S7 = {
        S7Actor,
        S7ActorSheet,
        S7ItemSheet,
        registerSettings
    };

    
    // Unregister core sheets
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    // Register System sheets
    Actors.registerSheet("s7", S7ActorSheet, { types:["character", "vehicle"], makeDefault:true });
    Items.registerSheet("s7", S7ItemSheet, {makeDefalt:true});

    // CONFIG settings for entities
    CONFIG.debug.hooks = true;
    CONFIG.Actor.entityClass = S7Actor;
    // CONFIG.Item.entityClass = S7Item;

    // Register system settings
   registerSettings();
    
    // Register partials templates
    preloadHandlebarsTemplates();
   
   
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

    // uppercaser
    Handlebars.registerHelper("upper", function(content) {
        let result = "";
        result = content.toUpperCase();
        return result;
    });

    //proper cases; needs work
    Handlebars.registerHelper("proper", function(content) {

        if (!content) return;
            
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

    // From Smilligan's Shadowrun 5E - hopefully usable
    Handlebars.registerHelper('concatStrings', function (...args) {
        return args.filter(a => typeof a === 'string').join('');
    });

    // Work sometimes....
    Handlebars.registerHelper("concat", function(...args){
        let result = "";
        for (let a of args) {
            result += String(a);
        }

        return result;
    });

    Handlebars.registerHelper("and", function(a, b){
        return (a && b); 
    });

    Handlebars.registerHelper("or", function(a, b){
        return (a || b);
    });

    Handlebars.registerHelper("initial", function(content) {
        let result = content[0];
        return result;
    });
});


// Add the necessary tooltip toggles

Hooks.on('renderChatMessage', (app, html) => {

    html.on('click', '.taskroll-msg', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });
 
     html.on('click', '.taskroll-info', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });

});
