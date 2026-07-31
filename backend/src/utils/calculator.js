import { STATE_SLABS } from "../config/states.js";

// Core calculation logic (OOP - Factory Pattern)
class BaseCalculator {
  constructor(units, slabs, fixedCharge, taxRate, wheelingCharge = 0) {
    this.units = Number(units) || 0;
    this.slabs = slabs;
    this.fixedCharge = fixedCharge;
    this.taxRate = taxRate;
    this.wheelingCharge = wheelingCharge;
  }

  calculateEnergyCharge() {
    let remaining = this.units;
    let total = 0;
    const breakdown = [];

    for (const slab of this.slabs) {
      if (remaining <= 0) break;
      const maxUnits = slab.max === Infinity ? remaining : slab.max - slab.min + 1;
      const slabUnits = Math.min(remaining, maxUnits);
      const amount = slabUnits * slab.rate;
      breakdown.push({
        range: slab.max === Infinity ? `${slab.min}+` : `${slab.min}-${slab.max}`,
        units: slabUnits,
        rate: slab.rate,
        amount: parseFloat(amount.toFixed(2)),
      });
      total += amount;
      remaining -= slabUnits;
    }
    return { total, breakdown };
  }

  calculateTotal() {
    const { total: energyCharge, breakdown } = this.calculateEnergyCharge();
    const tax = energyCharge * this.taxRate;
    const fuelAdj = energyCharge * 0.02; // 2% fuel surcharge
    const wheeling = this.units * this.wheelingCharge;

    const charges = {
      energy: parseFloat(energyCharge.toFixed(2)),
      fixed: this.fixedCharge,
      tax: parseFloat(tax.toFixed(2)),
      fuel: parseFloat(fuelAdj.toFixed(2)),
    };
    if (this.wheelingCharge > 0) {
      charges.wheeling = parseFloat(wheeling.toFixed(2));
    }

    const totalAmount = Object.values(charges).reduce((a, b) => a + b, 0);
    return {
      breakdown,
      charges,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }
}

function getCalculator(state, connectionType, units) {
  const stateData = STATE_SLABS[state];
  if (!stateData) throw new Error(`State "${state}" not supported`);
  const typeData = stateData[connectionType];
  if (!typeData) throw new Error(`Connection type "${connectionType}" not supported for ${state}`);
  return new BaseCalculator(
    units,
    typeData.slabs,
    typeData.fixedCharge,
    typeData.taxRate,
    typeData.wheelingCharge || 0
  );
}

export { getCalculator };
