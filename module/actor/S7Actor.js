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

        console.warn("Attributes: ", atts);

        for (let attr in atts) {
            console.warn("Attrib / Value: ", attr);
            let aval = 0;
            aval = atts[attr].base + atts[attr].mod;
            atts[attr].value = aval;
        }

        console.warn("Atts post update: ", atts);

        setProperty(this, "data.data.attributes", atts);


    }

}