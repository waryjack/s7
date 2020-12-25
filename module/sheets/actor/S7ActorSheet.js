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
        tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills"}],
        dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
        });
    }

    /**
     * @override
     */

    getData() {
        const data = super.getData();

        data.config = CONFIG.s7;
       // data.attList = ["body","reaction","agility","strength","willpower","logic","intuition","charisma","essence","magic"];
        
       data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
       data.spells = data.items.filter(function(item) {return item.type == "spell"});
       data.powers = data.items.filter(function(item) {return item.type == "power"});
       data.decks = data.items.filter(function(item) {return item.type == "deck"});
       data.programs = data.items.filter(function(item) {return item.type == "program"});
       data.metatype = data.items.filter(function(item) {return item.type == "metatype"});
       data.augments = data.items.filter(function(item) {return item.type == "augment"});
       data.gear = data.items.filter(function(item) {return item.type == "gear"});
       data.softs = data.items.filter(function(item) {return item.type == "soft"});

       console.warn(data.gear);
       
        return data;

    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".att-roll").click(this._onRollAttribute.bind(this));
        html.find(".skill-roll").click(this._onRollSkill.bind(this));
        html.find(".gen-roll").click(this._onRollGeneral.bind(this));
        html.find('.inline-edit').change(this._onInlineEdit.bind(this));
        html.find('.add-item').click(this._onAddItem.bind(this));
        html.find('.item-edit').click(this._onEditItem.bind(this));
        html.find('.item-delete').click(this._onDeleteItem.bind(this));
        html.find('.edit-track').click(this._onEditTrack.bind(this));

        // DragDrop Handler
        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-name').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });
    }

    _onRollAttribute(event){
        event.preventDefault();
    }

    _onRollSkill(event){
        event.preventDefault();
    }

    _onRollGeneral(event){
        event.preventDefault();
    }

    _onEditTrack(event) {
        event.preventDefault();
    }
    _onAddItem(event) {
        event.preventDefault();
        
        let element = event.currentTarget;
    
        let itemData  = {
            name: "New Item",
            type: element.dataset.type
        }
        return this.actor.createOwnedItem(itemData, {renderSheet:true});
         
      }

    _onEditItem(event) {
        event.preventDefault();

        let element = event.currentTarget;

        let itemId = element.closest(".item").dataset.itemId;

        let item = this.actor.getOwnedItem(itemId);

        item.sheet.render(true);

    }

    _onDeleteItem(event) {
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;

        let d = new Dialog({
          title: "Delete This Item?",
          content: "<p>Are you sure you want to delete this item?</p>",
          buttons: {
           one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Yes",
            callback: () => { this.actor.deleteOwnedItem(itemId) }
           },
           two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { return; }
           }
          },
          default: "two",
          render: html => console.log("Register interactivity in the rendered dialog"),
          close: html => console.log("This always is logged no matter which option is chosen")
         });
         d.render(true);

    }

    _onInlineEdit(event) {
        event.preventDefault();

        let element = event.currentTarget;

        let itemId = element.closest(".item").dataset.itemId;

        let item = this.actor.getOwnedItem(itemId);

        let field = element.dataset.field;
        
        return item.update({ [field]: element.value}); 

    }
}