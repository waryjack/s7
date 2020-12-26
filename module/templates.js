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
      "systems/s7/templates/item/parts/magselect.hbs"
    ]);
  };