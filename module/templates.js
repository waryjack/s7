export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
  
      // Actor Partials
      "systems/s7/templates/parts/attribute.hbs",
      "systems/s7/templates/parts/attributelist.hbs"
    ]);
  };