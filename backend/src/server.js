import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\nElectricity Bill Calculator API");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health\n`);
});
