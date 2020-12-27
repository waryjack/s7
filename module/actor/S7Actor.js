export default class S7Actor extends Actor {



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
         let meatScore = (data.data.attributes.reaction.value + data.data.attributes.intuition.value + data.data.miscmods.ms_initscore) - (this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp);
         let matrixScore = (data.data.attributes.intuition.value + data.data.miscmods.mx_initscore) - (data.data.monitor.physical.wp + data.data.monitor.stun.wp);
         let astralScore = (data.data.attributes.intuition.value * 2 + data.data.miscmods.as_initscore) - (this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp);
         let matrixDice = 3 + data.data.miscmods.mx_initdice;
         let astralDice = 2 + data.data.miscmods.as_initdice;
         let meatDice = 1 + data.data.miscmods.ms_initdice;       

         let initmode = this.data.data.initiative.current_mode;
         let initcurrscore = this.data.data.initiative.current;
         let initcurrdice = this.data.data.initiative.dice;
 
         if(initmode == "" || initmode == "meatspace") {
             initmode = "meatspace";
             initcurrscore = meatScore;
             initcurrdice = meatDice;
         } else if (initmode == "astral") {
             initmode = "astral";
             initcurrscore = astralScore;
             initcurrdice = astralDice;
         } else {
             initmode = "matrix";
             initcurrscore = matrixScore;
             initcurrdice = matrixDice;
         }

         let modInit = {
            current_mode: initmode,
            current: initcurrscore,
            dice: initcurrdice,
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
    
    setInitiativeMode(initMode) {
        setProperty(this, "data.data.initiative.current_mode", initMode);
        this.sheet.render(true);
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

}