export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
      // Actor Partials
      "systems/s7/templates/actor/parts/attribute.hbs",
      "systems/s7/templates/actor/parts/attribute_list.hbs",
      "systems/s7/templates/actor/parts/skill.hbs",
      "systems/s7/templates/actor/parts/skill_list.hbs",

      // General Partials
      "systems/s7/templates/item/parts/skillselect.hbs",
      "systems/s7/templates/item/parts/attributeselect.hbs",
      "systems/s7/templates/item/parts/weapontypes.hbs"
    ]);
  };