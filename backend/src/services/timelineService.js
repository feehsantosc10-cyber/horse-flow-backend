import { listFeedings } from "./feedingService.js";
import { listWeights } from "./weightService.js";
import { listCareRecords } from "./careService.js";

export async function getHorseTimeline(companyId, horseId) {
  const [feedings, weights, careRecords] = await Promise.all([
    listFeedings(companyId, horseId),
    listWeights(companyId, horseId),
    listCareRecords(companyId, horseId),
  ]);

  return [
    ...feedings.map((item) => ({ type: "feeding", date: item.feedingDate, title: `Alimentacao: ${item.feedType}`, description: `${item.feedQuantityKg} kg de racao / ${item.hayQuantityKg} kg de feno` })),
    ...weights.map((item) => ({ type: "weight", date: item.recordDate, title: "Controle de peso", description: `${item.weightKg} kg` })),
    ...careRecords.map((item) => ({ type: "care", date: item.performedAt, title: `Manejo: ${item.careType}`, description: item.providerName || "Registro preventivo" })),
  ].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}
