export default class S7ItemSheet extends ItemSheet {

    get template(){
        const path = "systems/s7/templates/item/";
        return `${path}${this.item.data.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
        classes: ['s7', 'sheet', 'item', 'item-sheet'],
        });
    }

    /**
     * @override
     */

    getData() {
        const data = super.getData();

        data.config = CONFIG.s7;
        
        data.isOwned = this.item.isOwned;
        if (data.isOwned) {
        data.ownerType = this.item.actor.data.type;
        } else {
            data.ownerType = "";
        }
      //   console.warn("item actor type: ", this.item.actor.data.type);
        return data;

    }

}