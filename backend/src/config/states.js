// Indian state electricity slab configurations
// Source: approximate public utility slab rates (for educational/demo use)

export const STATE_SLABS = {
  Maharashtra: {
    domestic: {
      slabs: [
        { min: 0, max: 100, rate: 4.43 },
        { min: 101, max: 300, rate: 9.64 },
        { min: 301, max: 500, rate: 12.83 },
        { min: 501, max: Infinity, rate: 14.33 },
      ],
      fixedCharge: 130,
      taxRate: 0.08,
    },
    commercial: {
      slabs: [
        { min: 0, max: 200, rate: 8.9 },
        { min: 201, max: 500, rate: 11.5 },
        { min: 501, max: Infinity, rate: 14.0 },
      ],
      fixedCharge: 300,
      taxRate: 0.12,
    },
    industrial: {
      slabs: [
        { min: 0, max: 500, rate: 7.2 },
        { min: 501, max: 2000, rate: 9.8 },
        { min: 2001, max: Infinity, rate: 11.5 },
      ],
      fixedCharge: 800,
      taxRate: 0.1,
      wheelingCharge: 0.5,
    },
  },
  Delhi: {
    domestic: {
      slabs: [
        { min: 0, max: 200, rate: 3.0 },
        { min: 201, max: 400, rate: 4.5 },
        { min: 401, max: 800, rate: 6.5 },
        { min: 801, max: Infinity, rate: 8.0 },
      ],
      fixedCharge: 100,
      taxRate: 0.05,
    },
    commercial: {
      slabs: [
        { min: 0, max: 200, rate: 7.0 },
        { min: 201, max: 500, rate: 9.5 },
        { min: 501, max: Infinity, rate: 11.5 },
      ],
      fixedCharge: 250,
      taxRate: 0.1,
    },
    industrial: {
      slabs: [
        { min: 0, max: 500, rate: 6.5 },
        { min: 501, max: 2000, rate: 8.5 },
        { min: 2001, max: Infinity, rate: 10.0 },
      ],
      fixedCharge: 700,
      taxRate: 0.08,
      wheelingCharge: 0.4,
    },
  },
  Karnataka: {
    domestic: {
      slabs: [
        { min: 0, max: 30, rate: 0.0 },
        { min: 31, max: 100, rate: 3.65 },
        { min: 101, max: 200, rate: 6.0 },
        { min: 201, max: 500, rate: 7.2 },
        { min: 501, max: Infinity, rate: 8.3 },
      ],
      fixedCharge: 50,
      taxRate: 0.06,
    },
    commercial: {
      slabs: [
        { min: 0, max: 200, rate: 7.5 },
        { min: 201, max: 500, rate: 9.8 },
        { min: 501, max: Infinity, rate: 12.0 },
      ],
      fixedCharge: 200,
      taxRate: 0.1,
    },
    industrial: {
      slabs: [
        { min: 0, max: 500, rate: 5.9 },
        { min: 501, max: 2000, rate: 7.8 },
        { min: 2001, max: Infinity, rate: 9.5 },
      ],
      fixedCharge: 600,
      taxRate: 0.09,
      wheelingCharge: 0.45,
    },
  },
  Gujarat: {
    domestic: {
      slabs: [
        { min: 0, max: 50, rate: 2.85 },
        { min: 51, max: 150, rate: 4.5 },
        { min: 151, max: 300, rate: 6.5 },
        { min: 301, max: Infinity, rate: 8.0 },
      ],
      fixedCharge: 100,
      taxRate: 0.06,
    },
    commercial: {
      slabs: [
        { min: 0, max: 200, rate: 6.8 },
        { min: 201, max: 500, rate: 9.0 },
        { min: 501, max: Infinity, rate: 11.0 },
      ],
      fixedCharge: 220,
      taxRate: 0.1,
    },
    industrial: {
      slabs: [
        { min: 0, max: 500, rate: 5.5 },
        { min: 501, max: 2000, rate: 7.5 },
        { min: 2001, max: Infinity, rate: 9.2 },
      ],
      fixedCharge: 650,
      taxRate: 0.08,
      wheelingCharge: 0.42,
    },
  },
  "Uttar Pradesh": {
    domestic: {
      slabs: [
        { min: 0, max: 150, rate: 4.7 },
        { min: 151, max: 300, rate: 6.1 },
        { min: 301, max: Infinity, rate: 7.2 },
      ],
      fixedCharge: 110,
      taxRate: 0.07,
    },
    commercial: {
      slabs: [
        { min: 0, max: 200, rate: 7.2 },
        { min: 201, max: 500, rate: 9.5 },
        { min: 501, max: Infinity, rate: 11.8 },
      ],
      fixedCharge: 280,
      taxRate: 0.1,
    },
    industrial: {
      slabs: [
        { min: 0, max: 500, rate: 6.0 },
        { min: 501, max: 2000, rate: 8.0 },
        { min: 2001, max: Infinity, rate: 10.5 },
      ],
      fixedCharge: 750,
      taxRate: 0.09,
      wheelingCharge: 0.48,
    },
  },
};

export const SUPPORTED_STATES = Object.keys(STATE_SLABS);
export const CONNECTION_TYPES = ["domestic", "commercial", "industrial"];
