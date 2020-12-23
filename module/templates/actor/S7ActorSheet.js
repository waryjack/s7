export default class S7ActorSheet extends ActorSheet {


    getTemplate() {
        const path = 'systems/hr1/templates/actor/';
        return `${path}${this.actor.data.type}sheet.hbs`;
    }

    static getDefaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['s7', 'sheet', 'actor', 'actor-sheet'],
            width: 775,
            height: 685,
            left:120,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
        });
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.S7;

        // add get data filters

    }

    activateListeners(html){
        
    }

}