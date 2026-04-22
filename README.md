# ⚡ Electricity Bill Calculator

A modern electricity bill calculator built using **Object-Oriented Programming (OOP)** principles.
This project demonstrates **Inheritance** and **Polymorphism** by implementing different tariff systems (Domestic & Commercial) with customizable slab rates.

---

## 🚀 Features

* 📊 Slab-based electricity bill calculation
* 🧠 OOP design (Base class + derived tariff classes)
* 🔄 Supports multiple tariff types:

  * Domestic Tariff
  * Commercial Tariff
* ⚙️ Custom slab configuration support
* 💰 INR currency formatting
* 🎯 Clean and scalable logic for real-world use

---

## 🛠 Tech Stack

* **Frontend:** React + Vite
* **Language:** JavaScript (ES6+)
* **Styling:** Tailwind CSS
* **Concepts Used:**

  * Inheritance
  * Polymorphism
  * Modular architecture

---

## 📂 Project Structure

```bash
electricity-bill-calculator/
│── src/
│   ├── logic/
│   │   └── BillCalculator.js   # Core OOP logic
│   ├── components/             # UI components
│   ├── App.jsx
│   └── main.jsx
│── public/
│── package.json
│── README.md
```

---

## ⚙️ How It Works

1. A base class `BillCalculator` handles:

   * Unit input
   * Slab iteration
   * Bill calculation

2. Derived classes:

   * `DomesticTariff`
   * `CommercialTariff`

   → Override slab definitions (Polymorphism)

3. Billing is calculated by:

   * Iterating through slabs
   * Applying respective rates
   * Summing total cost

---

## ▶️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aryan107rn/electricity-bill-calculator.git
cd electricity-bill-calculator
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Run the development server

```bash
npm run dev
```

---

## 📸 Screenshots

> Add your UI screenshots here (important for resume impact)

---

## 🔮 Future Improvements

* Add fixed charges & taxes (GST)
* Monthly bill history tracking
* Dark mode UI
* Export bill as PDF
* Real-time tariff API integration

---

## 📌 Why This Project?

This project is not just a calculator — it demonstrates:

* Writing **clean, maintainable OOP code**
* Designing **extensible systems**
* Bridging **logic + UI integration**

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Aryan Nakade**

---

⭐ If you found this useful, consider giving it a star!
