export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
      // Actor Partials
      "systems/s7/templates/actor/parts/attribute.hbs",
      "systems/s7/templates/actor/parts/attribute_list.hbs",
      "systems/s7/templates/actor/parts/skill.hbs",
      "systems/s7/templates/actor/parts/skill_list.hbs",
      "systems/s7/templates/actor/parts/essentials.hbs",
      "systems/s7/templates/actor/parts/weapon_list.hbs",
      "systems/s7/templates/actor/parts/weapon.hbs",
      "systems/s7/templates/actor/parts/gear_list.hbs",
      "systems/s7/templates/actor/parts/gear.hbs",
      "systems/s7/templates/actor/parts/augment_list.hbs",
      "systems/s7/templates/actor/parts/augment.hbs",
      "systems/s7/templates/actor/parts/spell_list.hbs",
      "systems/s7/templates/actor/parts/spell.hbs",
      "systems/s7/templates/actor/parts/power_list.hbs",
      "systems/s7/templates/actor/parts/power.hbs",
      "systems/s7/templates/actor/parts/skill_list1.hbs",
      "systems/s7/templates/actor/parts/skill_list2.hbs",
      "systems/s7/templates/actor/parts/activedevice.hbs",
      "systems/s7/templates/actor/parts/device_list.hbs",
      "systems/s7/templates/actor/parts/program_list.hbs",
      "systems/s7/templates/actor/parts/physical_monitor.hbs",
      "systems/s7/templates/actor/parts/stun_monitor.hbs",
      "systems/s7/templates/actor/parts/initiative_picker.hbs",
      "systems/s7/templates/actor/parts/initiative_display.hbs",
      "systems/s7/templates/actor/parts/miscmod_list.hbs",
      "systems/s7/templates/actor/parts/defenses.hbs",
      
      // General Partials
      "systems/s7/templates/item/parts/skillselect.hbs",
      "systems/s7/templates/item/parts/attributeselect.hbs",
      "systems/s7/templates/item/parts/weapontypes.hbs",
      "systems/s7/templates/item/parts/enhanceselect.hbs",
      "systems/s7/templates/item/parts/damageselect.hbs",
      "systems/s7/templates/item/parts/elementselect.hbs",
      "systems/s7/templates/item/parts/spellcategoryselect.hbs",
      "systems/s7/templates/item/parts/spelltypeselect.hbs",
      "systems/s7/templates/item/parts/spellmodeselect.hbs",
      "systems/s7/templates/item/parts/magselect.hbs",
      "systems/s7/templates/item/parts/actionselect.hbs",

      // Dialogs
      "systems/s7/templates/dialog/parts/roll_attribute.hbs",
      "systems/s7/templates/dialog/parts/roll_skill.hbs"
    ]);
  };