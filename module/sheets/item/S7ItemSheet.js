export default class S7ItemSheet extends ItemSheet {

    get template(){
        const path = "systems/s7/templates/item/";
        return `${path}${this.item.data.type}sheet.hbs`;
    }

    /* static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ['s7', 'sheet', 'item', 'item-sheet'],
        width: 775,
        height: 685,
        left:120,
        tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main"}],
        dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
        });
    }*/

    /**
     * @override
     */

    getData() {
        const data = super.getData();

        data.config = CONFIG.s7;
        
        return data;

    }

}