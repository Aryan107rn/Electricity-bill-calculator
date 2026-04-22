import { BaseCalculator } from "./BaseCalculator";

export class CommercialCalculator extends BaseCalculator {
  constructor(units) {
    super(units);

    this.slabs = [
      { min: 0, max: 100, rate: 6 },
      { min: 101, max: 300, rate: 10 },
      { min: 301, max: Infinity, rate: 12 },
    ];
  }

  calculateTotal() {
    const { total, breakdown } = this.calculateEnergyCharge();

    const tax = total * 0.2;

    return {
      breakdown,
      charges: {
        energy: total,
        tax,
      },
      total: total + tax,
    };
  }
}