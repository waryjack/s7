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

        console.warn("prepareCharacterData running");
        super.prepareDerivedData();

        const data = actorData;

        let atts = data.data.attributes;
        let skills = data.data.skills;

        console.warn("Skills: ", skills);

        for (let attr in atts) {
        
            let aval = 0;
            aval = atts[attr].base + atts[attr].mod;
            atts[attr].value = aval;
        }

        for (let skill in skills) {
            let sval = 0;
            sval = skills[skill].base + skills[skill].mod;
            // console.warn("Sval: ", sval);
            skills[skill].value = sval;
        }
        console.warn("Skills post update: ", skills);

        setProperty(this, "data.data.attributes", atts);
        setProperty(this, "data.data.skills", skills);

    }

}