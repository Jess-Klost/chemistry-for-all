import MultiFillableObject from "./MultiFillableObject.js";
import SodiumChloride from "./liquids/SodiumChloride.js";
import SilverNitrate from "./liquids/SilverNitrate.js";

const SOLUBILITY_CONSTANTS = {
  AgCl: 0.00000000018
};

export default class Beaker extends MultiFillableObject {
  capacity = 50;

  getTitrationCurveValue(titrandType = SodiumChloride, titrantType = SilverNitrate, solubilityConstantKey = "AgCl") {
    // Formulas for these calculations were found on the LibreTexts Chemistry 
    // "Precipitation Titration" page. See the "9.5.1 Titration Curves" section
    // for the formulas used.
    // (https://chem.libretexts.org/Ancillary_Materials/Demos_Techniques_and_Experiments/General_Lab_Techniques/Titration/Precipitation_Titration)

    // Get amounts of titrant and titrand (keep at 0 if not found)
    var amountOfTitrand = 0;
    var amountOfTitrant = 0;
    if (this.liquids.has(titrandType)) {
      amountOfTitrand = this.liquids.get(titrandType);
    }
    if (this.liquids.has(titrantType)) {
      amountOfTitrant = this.liquids.get(titrantType);
    }

    // Calculation of titrand concentration changes based on whether the titrant
    // or titrand is in excess, we can use the equivalence point to determine this
    var titrandConcentration;
    // If titrant is in excess
    if (amountOfTitrant > this.expectedEquivalencePoint(titrandType, titrantType)) {
      const titrantConcentration = 
        ((titrantType.molarConcentration * amountOfTitrant )
        - (titrandType.molarConcentration * amountOfTitrand)) / 
        (amountOfTitrand + amountOfTitrant);
        
      titrandConcentration = SOLUBILITY_CONSTANTS[solubilityConstantKey] / titrantConcentration;
    }
    // If titrand and titrant are at equivalent concentrations 
    else if (amountOfTitrant == this.expectedEquivalencePoint(titrandType, titrantType)) {
      titrandConcentration = Math.sqrt(SOLUBILITY_CONSTANTS[solubilityConstantKey]);
    }
    // If titrand is in excess
    else {
      titrandConcentration = 
        ((titrandType.molarConcentration * amountOfTitrand)
        - (titrantType.molarConcentration * amountOfTitrant)) / 
        (amountOfTitrand + amountOfTitrant);
    }
    
    // Calculate pTitrand with formula: pTitrand = log([titrand])
    // Note: if titrand is NaCl this would be pCl
    const pTitrand = -Math.log10(titrandConcentration);

    return pTitrand;
  }

  expectedEquivalencePoint(titrandType = SodiumChloride, titrantType = SilverNitrate) {
    if (this.liquids.has(titrandType)) {
      return (titrandType.molarConcentration * this.liquids.get(titrandType)) / titrantType.molarConcentration;
    }
    return undefined;
  }
}