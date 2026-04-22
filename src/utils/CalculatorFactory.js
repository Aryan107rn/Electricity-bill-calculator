import { DomesticCalculator } from "./DomesticCalculator";
import { CommercialCalculator } from "./CommercialCalculator";

export function getCalculator(type, units) {
  switch (type) {
    case "commercial":
      return new CommercialCalculator(units);
    case "domestic":
    default:
      return new DomesticCalculator(units);
  }
}