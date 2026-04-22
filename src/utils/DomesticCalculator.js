import { BaseCalculator } from "./BaseCalculator";

export class DomesticCalculator extends BaseCalculator {
  constructor(units) {
    super(units);

    this.slabs = [
      { min: 0, max: 100, rate: 4 },
      { min: 101, max: 300, rate: 8 },
      { min: 301, max: Infinity, rate: 10 },
    ];
  }

  calculateTotal() {
    const { total, breakdown } = this.calculateEnergyCharge();

    const fixed = 50;
    const tax = total * 0.1;

    return {
      breakdown,
      charges: {
        energy: total,
        fixed,
        tax,
      },
      total: total + fixed + tax,
    };
  }
}