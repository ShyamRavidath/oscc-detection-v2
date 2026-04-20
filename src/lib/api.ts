const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export interface PredictionResult {
  probability_tumor: number;
  models: { LR: number; RF: number; SVM: number };
  mock?: boolean;
}

export interface HealthStatus {
  status: string;
  models_loaded: boolean;
}

export interface PredictUsage {
  usage: string;
  biomarkers: string[];
  example: { features: number[] };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function healthCheck(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new ApiError("Health check failed", res.status);
  return res.json();
}

export async function predictBiomarkers(
  features: number[]
): Promise<PredictionResult> {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body.error || `Prediction failed (${res.status})`,
      res.status
    );
  }

  return res.json();
}

export const BIOMARKER_ORDER = [
  "HPX",
  "CP",
  "ORM2",
  "APOA1",
  "ALB",
  "HP",
  "C3",
  "SERPINA1",
] as const;

export const BIOMARKER_INFO: Record<
  string,
  { name: string; unit: string; placeholder: string }
> = {
  HPX: { name: "Hemopexin", unit: "ng/mL", placeholder: "1.2" },
  CP: { name: "Ceruloplasmin", unit: "ng/mL", placeholder: "0.8" },
  ORM2: { name: "Orosomucoid 2", unit: "ng/mL", placeholder: "0.5" },
  APOA1: { name: "Apolipoprotein A1", unit: "ng/mL", placeholder: "1.1" },
  ALB: { name: "Albumin", unit: "g/dL", placeholder: "3.5" },
  HP: { name: "Haptoglobin", unit: "ng/mL", placeholder: "2.1" },
  C3: { name: "Complement C3", unit: "mg/dL", placeholder: "0.9" },
  SERPINA1: {
    name: "Alpha-1 Antitrypsin",
    unit: "mg/dL",
    placeholder: "1.4",
  },
};
