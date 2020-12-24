export default class S7ActorSheet extends ActorSheet {

    get template(){
        return "systems/s7/templates/actor/charactersheet.hbs";
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ['s7', 'sheet', 'actor', 'actor-sheet'],
        width: 775,
        height: 685,
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

        data.config = CONFIG.s7;
        data.attList = ["body","reaction","agility","strength","willpower","logic","intuition","charisma","essence","magic"];
        console.warn("actor: ", this.actor);
        console.warn("actor name", this.actor.name);
        console.warn("Data config: ", data.config);

        return data;

    }
}