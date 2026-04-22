export class BaseCalculator {
  constructor(units) {
    this.units = Number(units) || 0;
    this.slabs = [];
  }

  calculateEnergyCharge() {
    let remaining = this.units;
    let total = 0;
    let breakdown = [];

    for (let slab of this.slabs) {
      if (remaining <= 0) break;

      let slabUnits = Math.min(remaining, slab.max - slab.min + 1);
      let amount = slabUnits * slab.rate;

      breakdown.push({
        range: `${slab.min}-${slab.max}`,
        units: slabUnits,
        rate: slab.rate,
        amount,
      });

      total += amount;
      remaining -= slabUnits;
    }

    return { total, breakdown };
  }

  calculateTotal() {
    throw new Error("Override this method");
  }
}