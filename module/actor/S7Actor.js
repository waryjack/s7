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
        
    }

    _prepareVehicleData(actorData) {

    }

}