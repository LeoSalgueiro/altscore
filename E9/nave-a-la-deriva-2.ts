import express, { Request, Response } from "express";

interface PhaseChangeResponse {
  specific_volume_liquid: number;
  specific_volume_vapor: number;
}

interface ErrorResponse {
  error: string;
}

const app = express();
const port = process.env.PORT || 8080;

// Puntos de Y (presión)
const MPa2: number = 10;        
const MPa1: number = 0.05;     

// Puntos de X (volumen)
const v1: number = 0.00105;
const v2: number = 30.0;
const Vc: number = 0.0035;

app.get("/phase-change-diagram", (req: Request, res: Response<PhaseChangeResponse | ErrorResponse>) => {
  const pressure: number = parseFloat(req.query.pressure as string);

  if (isNaN(pressure)) {
    return res.status(400).json({ error: "Presión inválida." });
  }

  if (pressure < MPa1 || pressure > MPa2) {
    return res.status(404).json({ error: "Presión fuera de los límites (0.05 - 10 MPa)." });
  }

  // Si es el punto critico paso sus valores
  if (pressure === MPa2) {
    return res.json({
      specific_volume_liquid: Vc,
      specific_volume_vapor: Vc,
    });
  }

  // SSL = SATURATED LIQUID LINE
  const SSL: number = v1 + (Vc - v1) * ((pressure - MPa1) / (MPa2 - MPa1));

  // SVC = SATURATED VAPOR LINE
  const SVC: number = v2 + (Vc - v2) * ((pressure - MPa1) / (MPa2 - MPa1));

  return res.json({
    specific_volume_liquid: parseFloat(SSL.toFixed(4)),
    specific_volume_vapor: parseFloat(SVC.toFixed(4)),
  });
});

// Agregar un endpoint de health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});


