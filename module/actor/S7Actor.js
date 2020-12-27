export default class S7Actor extends Actor {

    attrib_list = ["body","agility","reaction","strength","willpower","logic","intuition","charisma","essence","magic"];
    skill_list = ["acting","astral","athletics","biotech","close_combat","conjuring","cracking","electronics","enchanting", "engineering","exotic_weapons","firearms","influence","outdoors","perception","piloting","sorcery","stealth"];

    /**
     * @override
     */

    prepareBaseData() {
        super.prepareBaseData();
        console.warn("prepareBaseData running");

    
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        switch(actorData.type) {
            case "character": this._prepareCharacterData(actorData); break;
            case "vehicle": this._prepareVehicleData(actorData); break;
            case "spirit": this._prepareSpiritData(actorData); break;
        }

    }

    _prepareCharacterData(actorData) {

        console.warn("prepareCharacterData running");
        super.prepareDerivedData();

        const data = actorData;

        this._prepAttsAndSkills(data);

        this._prepMonitors(data);

        this._prepInitiative(data);

        this._prepDefenses(data);
        
        
    }

    _prepAttsAndSkills(data) {
        console.warn("prepping atts and skills");
        let atts = data.data.attributes;
        let skills = data.data.skills;

            // Populate Attribute Totals
            for (let attr in atts) {
        
                let aval = 0;
                aval = atts[attr].base + atts[attr].mod;
                atts[attr].value = aval;
            }
    
            // Populate Skill Totals
            for (let skill in skills) {
                let sval = 0;
                sval = skills[skill].base + skills[skill].mod;
                // console.warn("Sval: ", sval);
                skills[skill].value = sval;
            }
    
    
            setProperty(this, "data.data.attributes", atts);
            setProperty(this, "data.data.skills", skills);
    
            // Toggle Magic attribute and skill visibility
            setProperty(this, "data.data.skills.astral.hidden", !data.data.awakened);
            setProperty(this, "data.data.skills.conjuring.hidden", !data.data.awakened);
            setProperty(this, "data.data.skills.enchanting.hidden", !data.data.awakened);
            setProperty(this, "data.data.skills.sorcery.hidden", !data.data.awakened);
            setProperty(this, "data.data.attributes.magic.hidden", !data.data.awakened);
    }

    /**
     * 
     * @param {*} data - the data component to set initiative 
     */

    _prepInitiative(data) {
        console.warn("prepping initiative");
         //prep initiative value
         let meatScore = (data.data.attributes.reaction.value + data.data.attributes.intuition.value + data.data.miscmods.ms_initscore);
         let matrixScore = (data.data.attributes.intuition.value + data.data.miscmods.mx_initscore);
         let astralScore = (data.data.attributes.intuition.value * 2 + data.data.miscmods.as_initscore);
         let matrixDice = 3 + data.data.miscmods.mx_initdice;
         let astralDice = 2 + data.data.miscmods.as_initdice;
         let meatDice = 1 + data.data.miscmods.ms_initdice;       

         let initmode = this.data.data.initiative.current_mode;
         let initcurrscore = this.data.data.initiative.current;
         let initcurrdice = this.data.data.initiative.dice;
         let initdicetext = this.data.data.initiative.dicetext;
 
         if(initmode == "" || initmode == "meatspace") {
             initmode = "meatspace";
             initcurrscore = meatScore;
             initcurrdice = meatDice;
             initdicetext = meatDice + "D6";
         } else if (initmode == "astral") {
             initmode = "astral";
             initcurrscore = astralScore;
             initcurrdice = astralDice;
             initdicetext = astralDice + "D6";
         } else {
             initmode = "matrix";
             initcurrscore = matrixScore;
             initcurrdice = matrixDice;
             initdicetext = matrixDice + "D6";
         }

         console.warn("Init Dice Text: ", initdicetext);

         let modInit = {
            current_mode: initmode,
            current: initcurrscore,
            dice: initcurrdice,
            dicetext:initdicetext,
            meatspace:{
               dice:meatDice,
               score:meatScore,
               misc:0
            },
            matrix:{
                dice:matrixDice,
                score:matrixScore,
                misc:0
            },
            astral:{
                dice:astralDice,
                score:astralScore,
                misc:0
            }
        }

        setProperty(this, "data.data.initiative", modInit);

         console.warn("initiative prepped");
    }

    _prepMonitors(data){
        console.warn("prepping monitors");
        let atts = data.data.attributes;
        let physMon = data.data.monitor.physical;
        let stunMon = data.data.monitor.stun;
        let ofMon = data.data.monitor.overflow;   

        // Prepare monitors
        let physMax = Math.floor(atts.body.value/2) + 8 + data.data.miscmods.physmon;
        let stunMax = Math.floor(atts.willpower.value/2) + 8 + data.data.miscmods.stunmon;
        let oflowMax = atts.body.value + data.data.miscmods.overflowdmg;

        // Set max values
        physMon.max = physMax;
        stunMon.max = stunMax;
        ofMon.max = oflowMax;

        physMon.value = Math.max(0, physMax - physMon.damage);
        stunMon.value = Math.max(0, stunMax - stunMon.damage);
        ofMon.value = Math.max(0, oflowMax - ofMon.damage);

        // Calculate wound mods
        let pWp = Math.max(0, Math.floor(physMon.damage / 3) - data.data.miscmods.wound_tolerance);
        let sWp = Math.max(0, Math.floor(stunMon.damage / 3) - data.data.miscmods.wound_tolerance);

        physMon.wp = pWp;
        stunMon.wp = sWp;

        // Set the final objects
        setProperty(this, "data.data.monitor.physical", physMon);
        setProperty(this, "data.data.monitor.stun", stunMon);
        setProperty(this, "data.data.monitor.overflow", ofMon);
    }

    _prepDefenses(data) {
        let atts = data.data.attributes;
        let physDef = Math.floor((atts.agility.value + atts.reaction.value + atts.intuition.value)/3);
        let socDef = Math.floor((atts.charisma.value + atts.willpower.value + atts.essence.value)/3);
        let mentDef = Math.floor((atts.logic.value + atts.intuition.value + atts.willpower.value)/3);
        let astDef = Math.floor((atts.essence.value + atts.willpower.value + atts.magic.value)/3);

        setProperty(this, "data.data.defenses.physical", physDef);
        setProperty(this, "data.data.defenses.social", socDef);
        setProperty(this, "data.data.defenses.mental", mentDef);
        setProperty(this, "data.data.defenses.astral", astDef);
    }
    
    setInitiativeMode(initMode) {
        const actorData = duplicate(this.data);
        actorData.data.initiative.current_mode = initMode;
        actorData.data.initiative.current = actorData.data.initiative[initMode].score;
        actorData.data.initiative.dice = actorData.data.initiative[initMode].dice;
        actorData.data.initiative.dicetext = actorData.data.initiative[initMode].dice + "D6";

        this.update(actorData);
    }

    adjustDamage(type, change){
        const actorData = duplicate(this.data);

        const monitor = duplicate(actorData.data.monitor);

        if (change == "add") {
            monitor[type].damage = Math.min(monitor[type].max, monitor[type].damage+1);
            monitor[type].value = Math.max(0, monitor[type].max - monitor[type].damage);
        } else {
            monitor[type].damage = Math.max(0, monitor[type].damage - 1);
            monitor[type].value = Math.min(monitor[type].max, monitor[type].value + 1);
        }
        
        // setProperty(this, "data.data.monitor", monitor);

        actorData.data.monitor = monitor;

        this.update(actorData);
       // this.sheet.render(true);
        console.warn(this.data.data.monitor);

    }

    basicRoll(stat) {
        const actorData = duplicate(this.data);
        let template = CONFIG.s7.DIALOG.BASICROLL;
        let stdAttr = "";

        if (stat in actorData.data.skills) {
            stdAttr = actorData.data.skills[stat].attribute;
        }
        

        let dialogData = {
            atts: actorData.data.attributes,
            skills: actorData.data.skills,
            stat,
            stdAttr
        }
        renderTemplate(template, dialogData).then((dlg) => {
            new Dialog({
                title:"Basic Roll", // figure this out at some point...not localized right
                content: dlg,
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: "Roll!",
                     callback: (html) => {
                            let suffix = "";
                            let attr = html.find("#selected_attr").val();
                            let skill = html.find("#selected_skill").val();
                            let attVal = dialogData.atts[attr].value;
                            let skillVal = dialogData.skills[skill].value;
                            let otherMods = Number(html.find("#othermods").val());
                            let adv = html.find("#adv").val();
                            let rollForm = (attVal + skillVal + otherMods) + "d6";
                            
                            if (adv == "adv") { 
                                suffix = ">cs3";
                            } else if (adv == "dis") {
                                suffix = ">cs5";
                            } else {
                                suffix = ">cs4";
                            }

                            rollForm += suffix;
                            
                            console.warn("Formula: ", rollForm);

                            let basicRoll = new Roll(rollForm);
                           
                            basicRoll.roll().toMessage();
                        }
                    },
                    close: {
                     icon: '<i class="fas fa-times"></i>',
                     label: "Cancel",
                     callback: () => { console.log("Clicked Cancel"); return; }
                    }
                   },
                default: "close"
            }).render(true);

        });

    }
    

}