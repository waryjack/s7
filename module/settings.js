export const registerSettings = function() {
    

    // Set defense calculation
    game.settings.register("s7", 'defCalc', {
        name: 'Defense Calculation',
        hint: 'Attribute set to use in defense calculations',
        scope: 'world',
        config: true,
        type: String,
        default: 'three',
        choices: {
            'four': 'Four Attributes',
            'three': 'Three Attributes'
            
        }
    });


    // Register defense divisor

    game.settings.register("s7", "defDiv", {
        name: "Divisor for Defense Calculations",
        hint: "Number to divide the defense calculation by (typically 3 or 4)",
        scope: "world",
        config: true,
        type: Number,
        default:3
    });
    
}