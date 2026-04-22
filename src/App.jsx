import { useState } from "react";
import { getCalculator } from "./utils/CalculatorFactory";
import {
  Calculator,
  MapPin,
  Plug,
  Gauge,
  Layers,
  Bolt,
  Receipt,
} from "lucide-react";

export default function App() {
  const [units, setUnits] = useState(100);
  const [type, setType] = useState("domestic");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const calc = getCalculator(type, units);
    const data = calc.calculateTotal();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 p-6 flex items-center justify-center">

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-12">
          <Calculator size={40} className="mx-auto mb-3" />
          <h1 className="text-3xl font-bold">
            Electricity Bill Calculator
          </h1>
          <p className="opacity-80 mt-2 text-sm">
            Instant electricity bill calculation with slab rates
          </p>
        </div>

        {/* FORM */}
        <div className="p-8 space-y-6">

          <div className="grid md:grid-cols-3 gap-6">

            {/* STATE */}
            <div>
              <label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <MapPin size={16} /> Choose your state
              </label>
              <input
                value="Maharashtra"
                disabled
                className="w-full p-3 rounded-xl bg-gray-100 border"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Plug size={16} /> Connection Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="domestic">Domestic</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* UNITS */}
            <div>
              <label className="text-sm font-semibold mb-1 flex items-center gap-2">
                <Gauge size={16} /> Units Consumed (kWh)
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full p-3 rounded-l-xl border"
                />
                <span className="bg-indigo-500 text-white px-4 flex items-center rounded-r-xl text-sm">
                  kWh
                </span>
              </div>
            </div>
          </div>

          {/* SLABS */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Layers size={16} /> Slab presets
            </h3>

            <div className="space-y-2">
              {[
                { label: "0 - 100 units", rate: "₹4.43 / unit" },
                { label: "101 - 300 units", rate: "₹9.64 / unit" },
                { label: "301 - 500 units", rate: "₹12.83 / unit" },
                { label: "501+ units", rate: "₹14.33 / unit" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-3 rounded-xl bg-blue-50 border border-blue-100"
                >
                  <span className="text-sm">{s.label}</span>
                  <span className="text-blue-600 font-semibold text-sm">
                    {s.rate}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-3 text-sm bg-yellow-400 px-3 py-1 rounded-md">
              Edit slabs
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md flex items-center justify-center gap-2"
          >
            <Calculator size={18} /> CALCULATE BILL
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div className="p-8 space-y-6">

            <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <Receipt size={18} /> Your Bill Breakdown
            </h2>

            {/* BREAKDOWN */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="grid grid-cols-4 text-sm font-semibold mb-2">
                <span>Slab</span>
                <span>Units</span>
                <span>Rate</span>
                <span>Amount</span>
              </div>

              {result.breakdown.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 text-sm py-2 border-t"
                >
                  <span>{item.range}</span>
                  <span>{item.units}</span>
                  <span>₹{item.rate}</span>
                  <span>₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* CHARGES */}
            <div className="bg-gray-50 rounded-xl p-4 border space-y-2">
              {Object.entries(result.charges).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="capitalize flex items-center gap-2">
                    <Bolt size={14} /> {k}
                  </span>
                  <span>₹{v.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="bg-green-600 text-white text-center p-6 rounded-xl shadow">
              <p className="opacity-80 text-sm">TOTAL BILL AMOUNT</p>
              <p className="text-3xl font-bold mt-1">
                ₹{result.total.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}