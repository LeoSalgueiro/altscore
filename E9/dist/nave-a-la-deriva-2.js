"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
// Puntos de Y (presión)
const MPa2 = 10;
const MPa1 = 0.05;
// Puntos de X (volumen)
const v1 = 0.00105;
const v2 = 30.0;
const Vc = 0.0035;
app.get("/phase-change-diagram", (req, res) => {
    const pressure = parseFloat(req.query.pressure);
    if (isNaN(pressure)) {
        return res.status(400).json({ error: "Presión inválida." });
    }
    if (pressure < MPa1 || pressure > MPa2) {
        return res.status(404).json({ error: "Presión fuera de los límites (0.05 - 10 MPa)." });
    }
    // Si es el punto critico retorno sus valores
    if (pressure === MPa2) {
        return res.json({
            specific_volume_liquid: Vc,
            specific_volume_vapor: Vc,
        });
    }
    // SSL = SATURATED LIQUID LINE
    const SSL = v1 + (Vc - v1) * ((pressure - MPa1) / (MPa2 - MPa1));
    // SVC = SATURATED VAPOR LINE
    const SVC = v2 + (Vc - v2) * ((pressure - MPa1) / (MPa2 - MPa1));
    //Si la presion no esta en el punto critico retorno la interpolacion lineal
    return res.json({
        specific_volume_liquid: parseFloat(SSL.toFixed(4)),
        specific_volume_vapor: parseFloat(SVC.toFixed(4)),
    });
});
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
