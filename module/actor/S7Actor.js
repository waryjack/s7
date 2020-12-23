export default class S7Actor extends Actor {

    /**
     * @override
     */
    prepareBaseData() {
        super.prepareBaseData();

        const actorData = this.data;
        const flags = this.flags;

        switch (actorData.type) {
            case "character": this._prepareCharacterData(actorData); break;
            case "vehicle": this._prepareVehicleData(actorData); break;
            case "spirit": this._prepareSpiritData(actorData); break;
            case "drone": this._prepareVehicleData(actorData); break;
            case "deck": this._prepareDeckData(actorData); break;
        }
        if (actorData.type === 'character') this._prepareCharacterData(actorData);
        else if (actorData.type === 'vehicle') this._prepareVehicleData(actorData);
    }

    _prepareCharacterData(actorData) {
        super.prepareDerivedData();
        const data = actorData.data; // data = actor.data.data
        let wp = data.condition_monitor.physical.wp + data.condition_monitor.stun.wp;

        console.warn("This data: ", data);
        console.warn("attributes: ", data.attributes);
        // Initiative
        let msInitScore = data.attributes.intuition.base + data.attributes.reaction.base - wp;
        let mxInitScore = data.attributes.intuition.base - wp;
        let asInitScore = data.attributes.logic.base + data.attributes.intuition.base - wp;
        let asInitDice = 2;

        //Condition Monitors
        let physCondMax = Math.ceil(data.attributes.body.base/2) + 8; // + data.miscmods.physboxes;
        let stunCondMax = Math.ceil(data.attributes.willpower.base/2) + 8; // + data.miscmods.stunboxes;
        let physCondValue = physCondMax - data.condition_monitor.physical.damage;
        let stunCondValue = stunCondMax - data.condition_monitor.stun.damage;

        // Fixed Defenses
        let physDef = Math.floor((data.attributes.reaction.base
                                +data.attributes.reaction.mod
                                +data.attributes.intuition.base
                                +data.attributes.intuition.mod
                                +data.attributes.agility.base
                                +data.attributes.agility.mod)/3);

        let mentDef = Math.floor((data.attributes.logic.base
            +data.attributes.logic.mod
            +data.attributes.intuition.base
            +data.attributes.intuition.mod
            +data.attributes.willpower.base
            +data.attributes.willpower.mod)/3);

        let socDef = Math.floor((data.attributes.charisma.base
            +data.attributes.charisma.mod
            +data.attributes.willpower.base
            +data.attributes.willpower.mod
            +data.attributes.essence.base
            +data.attributes.essence.mod)/3);

        let astralDef = Math.floor((data.attributes.essence.base
            +data.attributes.essence.mod
            +data.attributes.willpower.base
            +data.attributes.willpower.mod
            +data.attributes.magic.base
            +data.attributes.magic.mod)/3);
                                

        // Maybe do this as a this.update
        setProperty(this, "data.data.defenses.physical", physDef);
        setProperty(this, "data.data.defenses.mental", mentDef);
        setProperty(this, "data.data.defenses.social", socDef);
        setProperty(this, "data.data.defenses.astral", astralDef);
        setProperty(this, "data.data.initiative.meatspace.score.base", msInitScore);
        setProperty(this, "data.data.initiative.matrix.score.base", mxInitScore);
        setProperty(this, "data.data.initiative.astral.score.base", asInitScore);
        setProperty(this, "data.data.initiative.astral.dice.base", asInitDice);
        setProperty(this, "data.data.condition_monitor.physical.max", physCondMax);
        setProperty(this, "data.data.condition_monitor.stun.max", stunCondMax);
        setProperty(this, "data.data.condition_monitor.physical.value", physCondValue);
        setProperty(this, "data.data.condition_monitor.stun.value", stunCondValue);
        setProperty(this, "data.data.condition_monitor.physical.wp", Math.floor(data.condition_monitor.physical.damage/3));
        setProperty(this, "data.data.condition_monitor.stun.wp", Math.floor(data.condition_monitor.stun.damage/3));

        console.warn("Updated Actor: ", this);
    }

    _prepareVehicleData(actorData) {

    }

}