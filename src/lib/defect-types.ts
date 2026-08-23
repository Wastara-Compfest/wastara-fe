export const DEFECT_TYPES = [
  "broken_yarn",
  "hole",
  "pattern_anomaly",
  "texture_anomaly",
  "unknown",
] as const;

export type DefectType = (typeof DEFECT_TYPES)[number];

export const DEFECT_TYPE_LABELS: Record<DefectType, string> = {
  broken_yarn: "Broken yarn",
  hole: "Hole",
  pattern_anomaly: "Pattern anomaly",
  texture_anomaly: "Texture anomaly",
  unknown: "Unknown",
};

export function defectTypeLabel(value: string | null | undefined) {
  if (!value) {
    return "Unclassified";
  }
  return DEFECT_TYPE_LABELS[value as DefectType] ?? value;
}

export function defectTypeOptions() {
  return DEFECT_TYPES.map((value) => ({
    value,
    label: DEFECT_TYPE_LABELS[value],
  }));
}
