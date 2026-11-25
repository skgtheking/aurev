import type { HeightUnit } from "../types";

export function centimetersToFeetInches(cm: number | undefined) {
  if (cm === undefined || !Number.isFinite(cm)) return { feet: "", inches: "" };
  const totalInches = Math.round(cm / 2.54);
  return {
    feet: String(Math.floor(totalInches / 12)),
    inches: String(totalInches % 12),
  };
}

export function feetInchesToCentimeters(feetText: string, inchesText: string): number | null {
  if (!feetText.trim() || !inchesText.trim()) return null;
  const feet = Number(feetText);
  const inches = Number(inchesText);
  if (!Number.isInteger(feet) || feet < 3 || feet > 8 || !Number.isInteger(inches) || inches < 0 || inches > 11) return null;
  return Math.round((feet * 12 + inches) * 2.54);
}

export function formatHeight(cm: number) {
  const { feet, inches } = centimetersToFeetInches(cm);
  return feet && inches ? feet + "′" + inches + "″ · " + cm + " cm" : cm + " cm";
}
