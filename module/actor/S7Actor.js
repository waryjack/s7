/**
 * @imports
 */
import S7Messenger from "../dialogs/S7Messenger.js";

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
        let stunMax = Math.floor(atts.willpower.value/2) + 12 + data.data.miscmods.stunmon;
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
        let skills = data.data.skills;
        let rangedDef = Math.floor((atts.agility.value + atts.reaction.value + atts.intuition.value + skills.firearms.value)/4);
        let meleeDef = Math.floor((atts.agility.value + atts.reaction.value + atts.intuition.value + skills.close_combat.value)/4);
        let socDef = Math.floor((atts.charisma.value + atts.willpower.value + atts.essence.value + skills.influence.value)/4);
        let mentDef = Math.floor((atts.logic.value + atts.intuition.value + atts.willpower.value + skills.perception.value)/4);
        let astDef = Math.floor((atts.essence.value + atts.willpower.value + atts.magic.value + skills.sorcery.value)/4);

        setProperty(this, "data.data.defenses.ranged", rangedDef);
        setProperty(this, "data.data.defenses.melee", meleeDef);
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

    adjustArmor() {

        let activeArmor = this.items.filter(item => {return item.type=="armor" && item.data.data.equipped;});
        
        if (!Array.isArray(activeArmor) || !activeArmor.length) {
            ui.notifications.warn("Natural armor does not degrade.");
            return;
        }

        let itemData = activeArmor[0].data;

        let armorId = itemData._id;

        console.warn("Actor class activeArmor, id ", activeArmor, armorId);
       
        itemData.data.current_rating = Math.max(0, itemData.data.current_rating - 1); 

        this.getOwnedItem(armorId).update(itemData);
    }

    specialRoll(att1, att2, rollname) {
        console.warn("Att1, Att2", att1, att2);
        const actorData = duplicate(this.data);
        let template = CONFIG.s7.DIALOG.BASICROLL;

        let dialogData = {
            dialogName: rollname,
            atts: actorData.data.attributes,
            skills: actorData.data.skills,
            att1:att1,
            att2:att2,
            skill:"none",
            isItem:true,
            itemEffect:"",
        }

        this.processRoll(template, dialogData);
    }

    basicRoll(clicked) {
        const actorData = duplicate(this.data);
        let template = CONFIG.s7.DIALOG.BASICROLL;
        let att1 = "none";
        let att2 = "none";
        let skill = "none";

        if (clicked in actorData.data.skills) {
            att1 = actorData.data.skills[clicked].attribute;
            skill = clicked;
        } else if (clicked in actorData.data.attributes) {
            att1 = clicked;
        }
        console.warn("Clicked: ", clicked);
        console.warn("Att1: ", att1);
        console.warn("Skill: ", skill);

        let dialogData = {
            dialogName: "Basic Roll",
            atts: actorData.data.attributes,
            skills: actorData.data.skills,
            att1: att1,
            att2: att2,
            skill: skill,
            isItem:false,
            itemEffect:""
        }

        console.warn("Dialog Data: ", dialogData);

        this.processRoll(template, dialogData);

      

    }

    itemRoll(id) {
        const actorData = duplicate(this.data);
        let item = this.getOwnedItem(id);
        let template = CONFIG.s7.DIALOG.BASICROLL;
        var itemRollData;
        let att2 = "none";
        let isFirearm = false;

        console.warn("Clicked Item: ", item);

        if (item.data.data.roll) {
            itemRollData = item.data.data.roll;
        } else {
            ui.notifications.error("This item has no associated roll.");
            return;
        }

        isFirearm = item.data.data.type == "firearm" ? true : false;

        if(isFirearm && item.data.data.ammo == 0){
            ui.notifications.error("You need to reload!");
            return;
        }

        console.warn("Is Firearm? ", isFirearm);

        let attr = itemRollData.attribute;
        let skill = itemRollData.skill;

        let dialogData = {
            dialogName: item.name,
            atts: actorData.data.attributes,
            skills: actorData.data.skills,
            att1: attr,
            att2: att2,
            skill: skill,
            isItem:true,
            isFirearm:isFirearm,
            itemEffect:item.data.data.effect,
            item:item
        }

        this.processRoll(template, dialogData);
    }

    processRoll(template, dialogData) {

        renderTemplate(template, dialogData).then((dlg) => {
            new Dialog({
                title:dialogData.dialogName, // figure this out at some point...not localized right
                content: dlg,
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: "Roll!",
                     callback: (html) => {
                            let suffix = "";
                            let firemode = "";
                            let atkPoolBonus = 0;
                            let atkDmgBonus = 0;
                            let range = "none";
                            let dv = "";
                            let shots = 0;
                            let skillVal = 0;
                            let attVal1 = 0;
                            let attVal2 = 0;
                            let attr1 = html.find("#selected_attr1").val();
                            let attr2 = html.find("#selected_attr2").val();
                            let skill = html.find("#selected_skill").val();
                            
                            // Placeholder for range/firemode thing
                            if(dialogData.isFirearm) {
                                firemode = html.find("#fire-mode").val();
                                range = html.find("#fire-range").val();


                                shots = dialogData.item.data.data.shots[firemode];
                                dialogData.item.data.data.ammo = Math.max(0, dialogData.item.data.data.ammo - shots);
                                
                                this.getOwnedItem(dialogData.item._id).update(dialogData.item.data);
                                
                                if(firemode == "standard") {
                                    atkPoolBonus = dialogData.item.data.data.attack_rating[range];
                                    dv = dialogData.item.data.data.damage.dv + dialogData.item.data.data.damage.dmgtype;
                                } else if(firemode == "autofire") {
                                    atkDmgBonus = dialogData.item.data.data.attack_rating[range];
                                    dv = Number(dialogData.item.data.data.damage.dv + atkDmgBonus) +
                                        dialogData.item.data.data.damage.dmgtype;
                                }
                            }
                            
                            

                            console.warn("Attr1: ", attr1);
                            console.warn("Attr2: ", attr2);
                            console.warn("Skill: ", skill);

                            if(attr1 == "none"){
                                attVal1 = 0;
                            } else {
                                attVal1 = Math.floor(dialogData.atts[attr1].value);
                            }

                            if(attr2 == "none") {
                                attVal2 = 0;
                            } else {
                                attVal2 = Math.floor(dialogData.atts[attr2].value);
                            }

                            if(skill == "none") {
                                skillVal = 0;
                            } else {
                                skillVal = dialogData.skills[skill].value;
                            }

                            // handle bonus to dmg or dice roll



                            let otherMods = Number(html.find("#othermods").val());
                            let wounds = this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp;
                            let adv = html.find("#adv").val();
                            let rollForm = (attVal1 + attVal2 + skillVal + atkPoolBonus + otherMods - wounds) + "d6";
                            let rollTweak = "";
                            if (adv == "adv") { 
                                suffix = "cs>3";
                                rollTweak = "advantage";
                            } else if (adv == "dis") {
                                suffix = "cs>5";
                                rollTweak = "disadvantage"
                            } else {
                                suffix = "cs>4";
                            }

                            rollForm += suffix;

                            let basicRoll = new Roll(rollForm).evaluate();

                            

                            let msgData = {
                                roll:basicRoll,
                                attr1: attr1,
                                attr2: attr2,
                                skill: skill,
                                mods: otherMods,
                                tweak: rollTweak,
                                wounds: wounds,
                                dialogName: dialogData.dialogName,
                                isItem: dialogData.isItem,
                                isFirearm: dialogData.isFirearm,
                                item:dialogData.item,
                                itemEffect:dialogData.itemEffect,
                                firemode: firemode,
                                range: range,
                                dv: dv
                            }
                        
                            basicRoll.getTooltip().then(tt => S7Messenger.createChatMessage(tt,msgData,CONFIG.s7.MESSAGE.BASICROLL));
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