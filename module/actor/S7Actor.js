export default class S7Actor extends Actor {



    /**
     * @override
     */

    prepareBaseData() {
        super.prepareBaseData();

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

       
        super.prepareDerivedData();

        const data = actorData;

        let atts = data.data.attributes;
        let skills = data.data.skills;
        let physMon = data.data.monitor.physical;
        let stunMon = data.data.monitor.stun;

   
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

        // Prepare monitors
        let physMax = Math.floor(atts.body.value/2) + 8;
        let stunMax = Math.floor(atts.willpower.value/2) + 8;
        let physVal = Math.max(0, physMax - physMon.damage);
        let stunVal = Math.max(0, stunMax - stunMon.damage);
        let pWp = Math.floor(physMon.damage / 3);
        let sWp = Math.floor(stunMon.damage / 3);

        setProperty(this, "data.data.monitor.physical.max", physMax);
        setProperty(this, "data.data.monitor.physical.value", physVal);
        setProperty(this, "data.data.monitor.stun.max", stunMax);
        setProperty(this, "data.data.monitor.stun.value", stunVal);
        setProperty(this, "data.data.monitor.physical.wp", pWp);
        setProperty(this, "data.data.monitor.stun.wp", sWp);

        //prep initiative value
        let meatScore = this.data.data.attributes.reaction.value + this.data.data.attributes.intuition.value - (this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp);
        let matrixScore = this.data.data.attributes.intuition.value - (this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp);
        let astralScore = this.data.data.attributes.intuition.value * 2 - (this.data.data.monitor.physical.wp + this.data.data.monitor.stun.wp);
        let matrixDice = 3;
        let astralDice = 2;
        let meatDice = 1;
        
        setProperty(this, "data.data.initiative.meatspace.score", meatScore);
        setProperty(this, "data.data.initiative.meatspace.dice", meatDice);
        setProperty(this, "data.data.initiative.matrix.score", matrixScore);
        setProperty(this, "data.data.initiative.matrix.dice", matrixDice);
        setProperty(this, "data.data.initiative.astral.score", astralScore);
        setProperty(this, "data.data.initiative.astral.dice", astralDice);

        if(this.data.data.initiative.current_mode == "") {
            setProperty(this, "data.data.initiative.current_mode", "meatspace");
        }
    }

    setInitiativeMode(initMode) {
        setProperty(this, "data.data.initiative.current_mode", initMode);
        this.sheet.render(true);
    }

}