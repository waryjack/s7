export default class S7ActorSheet extends ActorSheet {

    get template(){
        const path = 'systems/s7/templates/actor/';
        return `${path}${this.actor.data.type}sheet.hbs`;
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
        console.warn("actorsheet data: ", data);
        data.config = CONFIG.s7;

        if(this.actor.data.type == "character") {
        data.skills1 = {};
        data.skills2 = {};
        let skills1 = [];
        let skills2 = [];
        if(this.actor.data.data.awakened){
         skills1 = ["acting","astral","athletics","biotech","close_combat","conjuring","cracking","electronics","enchanting"];
         skills2 = ["engineering","exotic_weapons","firearms","influence","outdoors","perception","piloting","sorcery","stealth"];
        } else {
         skills1 = ["acting","athletics","biotech","close_combat","cracking","electronics","engineering"];
         skills2 = ["exotic_weapons","firearms","influence","outdoors","perception","piloting","stealth"];    
        }
       // data.attList = ["body","reaction","agility","strength","willpower","logic","intuition","charisma","essence","magic"];
        
       data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
       data.spells = data.items.filter(function(item) {return item.type == "spell"});
       data.powers = data.items.filter(function(item) {return item.type == "power"});
       data.devices = data.items.filter(function(item) {return item.type == "device"});
       data.programs = data.items.filter(function(item) {return item.type == "program"});
       data.metatype = data.items.filter(function(item) {return item.type == "metatype"});
       data.augments = data.items.filter(function(item) {return item.type == "augment"});
       data.gear = data.items.filter(function(item) {return item.type == "gear"});
       data.softs = data.items.filter(function(item) {return item.type == "soft"});
       data.armors = data.items.filter(function(item) {return item.type=="armor"});
       data.activeArmor = data.armors.filter(function(armor) {return armor.data.equipped});

       console.warn("active armor: ", data.activeArmor);

       data.maxArmor = data.activeArmor[0]?.data?.rating
                        ? data.activeArmor[0].data.rating + this.actor.data.data.miscmods.armor
                        : 0 + this.actor.data.data.miscmods.armor;

       data.currentArmor = data.activeArmor[0]?.data?.current_rating
                           ? data.activeArmor[0].data.current_rating + this.actor.data.data.miscmods.armor 
                           : 0 + this.actor.data.data.miscmods.armor;
       
        data.armorLost = data.maxArmor - data.currentArmor;

        console.warn("Current Armor, Armor Lost: ", data.currentArmor, data.armorLost);
       //experiment with layout

       skills1.forEach(skill => setProperty(data.skills1, skill, this.actor.data.data.skills[skill]));
       skills2.forEach(skill => setProperty(data.skills2, skill, this.actor.data.data.skills[skill]));
       } else {
            console.warn("Vehicle Prep Placeholder");
            data.weapons = data.items.filter(function(item) {return item.type == "weapon"});
            data.gear = data.items.filter(function(item) {return item.type == "gear"});
           
       }

       return data;

    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".roll-att").click(this._onRollAttribute.bind(this));
        html.find(".roll-skill").click(this._onRollSkill.bind(this));
        html.find(".gen-roll").click(this._onRollGeneral.bind(this));
        html.find('.inline-edit').change(this._onInlineEdit.bind(this));
        html.find('.add-item').click(this._onAddItem.bind(this));
        html.find('.item-edit').click(this._onEditItem.bind(this));
        html.find('.item-delete').click(this._onDeleteItem.bind(this));
        html.find('.edit-track').click(this._onEditTrack.bind(this));
        html.find('.effect-toggle').click(this._toggleEffectLine.bind(this));
        html.find('.equip-item').change(this._equipItem.bind(this));
        html.find('.initmode').change(this._changeInitMode.bind(this));
        html.find('.adj-dmg').click(this._adjustDamage.bind(this));
        html.find('.item-roll').click(this._onRollItem.bind(this));
        html.find('.spec-roll').click(this._onRollSpecial.bind(this));
        html.find('.adj-armor').click(this._adjustArmor.bind(this));
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
        let element = event.currentTarget;
        let attr = element.dataset.attId;
        return this.actor.basicRoll(attr);
    }

    _onRollSkill(event){
        event.preventDefault();
        let element = event.currentTarget;
        let skill = element.dataset.skillId;
        return this.actor.basicRoll(skill);
    }

    _onRollGeneral(event){
        event.preventDefault();
    }

    _onRollItem(event){
        event.preventDefault();
        let element=event.currentTarget;
        let itemId = element.dataset.itemId;
        return this.actor.itemRoll(itemId);
    }

    _onRollSpecial(event){
        let att1 = "";
        let att2 = "";
        let rollname = "";
        event.preventDefault();
        let element = event.currentTarget;
        let specRoll = element.dataset.specRoll;
        switch(specRoll){
            case "composure": att1 = "willpower"; 
                              att2 = "charisma"; 
                              rollname = "Composure (CHA+WIL)";
                              break;
            case "defense": att1 = "reaction"; 
                            att2 = "intuition";
                            rollname = "Defense (REA+INT)";
                            break;
            case "judge": att1 = "charisma";
                          att2 = "intuition";
                          rollname = "Judge Intentions (CHA+INT)";
                          break;
            case "memory": att1 = "logic";
                           att2 = "willpower";
                           rollname = "Memory (LOG+WIL)"
                           break;
            case "astraldef": att1 = "intuition";
                              att2 = "logic";
                              rollname = "Astral Defense (INT+LOG)"
                              break;
            case "liftcarry": att1 = "body";
                              att2 = "strength";
                              rollname = "Lift/Carry (BOD+STR)";
                              break;
        }

        return this.actor.specialRoll(att1, att2, rollname);
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

    _toggleEffectLine(event){
        event.preventDefault();
        
        $(event.currentTarget).next('.effect-info').slideToggle("fast");
    }

    _equipItem(event){
        event.preventDefault();
        let element = event.currentTarget;
        let itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.getOwnedItem(itemId);
        let itype = item.type;
      
        let itemList = this.actor.items.filter((item)=> {return item.type == itype});
            console.warn("List of relevant items: ", itemList);

        itemList.forEach((i) => {
            i.update({"data.equipped": false});
        });

        let val = element.checked;
        console.warn("Element New Val: ", val);
        return item.update({"data.equipped": val});
    }

    _changeInitMode(event){
        event.preventDefault();
        let element = event.currentTarget;
        let val = element.checked;
        let newMode = "";
        if(val) {
            newMode = element.dataset.initMode;
        }
        
        console.warn("newMode: ", newMode);
        this.actor.setInitiativeMode(newMode);
       
        
    }

    _adjustArmor(event) {
        event.preventDefault();

        return this.actor.adjustArmor();
    }

    _adjustDamage(event){
        event.preventDefault();

        let element = event.currentTarget;
        let dtype = element.dataset.dmgType;
        let dchange = element.dataset.dmgChange;

        console.warn("Clicked info: ", element, dtype, dchange);

        return this.actor.adjustDamage(dtype, dchange);
    }
}