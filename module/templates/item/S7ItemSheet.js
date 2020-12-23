export default class S7ItemSheet extends ItemSheet {


    get template() {
        const path = 'systems/hr1/templates/item/';
        return `${path}${this.item.data.type}sheet.hbs`;
    }

    getData () {
        const data = super.getData();

        data.config = CONFIG.ewhen; 
        
        return data;
    }
}