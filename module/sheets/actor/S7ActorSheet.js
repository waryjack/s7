export default class S7ActorSheet extends ActorSheet {


    get template() {
        const path = 'systems/s7/templates/actor/';

        console.warn("path to sheet", path, this.actor.data.type);
        return `${path}${this.actor.data.type}sheet.hbs`;
    }

    /**
     * @override
     */

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['s7', 'sheet', 'actor', 'actor-sheet'],
            width: 400,
            height: 500,
            left:120,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    /**
     * @override
     */
    getData() {
        const data = super.getData();
        data.config = CONFIG.S7;

        console.warn("sheet data: ", data);

        // add get data filters

    }

    activateListeners(html){
        
    }

}