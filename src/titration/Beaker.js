import MultiFillableObject from "./MultiFillableObject.js";
import SodiumChloride from "./liquids/SodiumChloride.js";
import SilverNitrate from "./liquids/SilverNitrate.js";
import { SOLUBILITY_CONSTANTS } from "./liquids/Liquid.js";
import AprilSample from "./liquids/AprilSample.js";
import MarchSample from "./liquids/MarchSample.js";

export default class Beaker extends MultiFillableObject {
  capacity = 50;

  getTitrationCurveValue(titrandType = null, titrantType = null, solubilityConstantKey = "") {
    if (titrandType == null || titrantType == null || solubilityConstantKey == "") {
      const reactants = this.solveForReactants();
      titrandType = reactants["titrand"];
      titrantType = reactants["titrant"];
      solubilityConstantKey = reactants["result"];
    }

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
    const equivalencePoint = this.expectedEquivalencePoint(titrandType, titrantType);

    // If titrand and titrant are at equivalent concentrations
    // Note: this boolean statement measures equality within a certain margin,
    // this is to prevent values like 3.999 and 4.001 from giving unexpected
    // values
    if (Math.abs(amountOfTitrant - equivalencePoint) < 0.001) {
      titrandConcentration = Math.sqrt(SOLUBILITY_CONSTANTS[solubilityConstantKey]);
    }
    // If titrant is in excess
    else if (amountOfTitrant > equivalencePoint) {
      const titrantConcentration = 
        ((titrantType.molarConcentration * amountOfTitrant )
        - (titrandType.molarConcentration * amountOfTitrand)) / 
        (amountOfTitrand + amountOfTitrant);
        
      titrandConcentration = SOLUBILITY_CONSTANTS[solubilityConstantKey] / titrantConcentration;
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

  expectedEquivalencePoint(titrandType = null, titrantType = null) {
    if (titrandType == null || titrantType == null) {
      const reactants = this.solveForReactants();
      titrandType = reactants["titrand"];
      titrantType = reactants["titrant"];
    }
    if (this.liquids.has(titrandType)) {
      return (titrandType.molarConcentration * this.liquids.get(titrandType)) / titrantType.molarConcentration;
    }
    return undefined;
  }

  solveForReactants() {
    if (this.liquids.has(SodiumChloride)) {
      return {
        titrand: SodiumChloride,
        titrant: SilverNitrate,
        result: "AgCl"
      }
    }
    else if (this.liquids.has(AprilSample)) {
      return {
        titrand: AprilSample,
        titrant: SilverNitrate,
        result: "AgCl"
      }
    }
    else if (this.liquids.has(MarchSample)) {
      return {
        titrand: MarchSample,
        titrant: SilverNitrate,
        result: "AgCl"
      }
    }
  }
}