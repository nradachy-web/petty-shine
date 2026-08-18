import type { PhotoId } from "@/lib/photos";

export interface Work {
  photo: PhotoId;
  vehicle: string;
  service: string;
  film: string;
  category: "tint" | "ppf" | "coating" | "correction" | "detail" | "flat glass";
}

/**
 * Every vehicle below was finished at 10170 Industrial Drive. Captions
 * are set like exhibition placards, vehicle, service, product, because
 * the specificity is the proof.
 */
export const WORK: Work[] = [
  { photo: "ppf-corvette-c8-install", vehicle: "Chevrolet Corvette C8", service: "Paint protection film", film: "GeoShield Ceramic Shield", category: "ppf" },
  { photo: "tint-trans-am", vehicle: "Pontiac Trans Am", service: "Ceramic window tint", film: "LLumar CTX", category: "tint" },
  { photo: "coating-bentayga-side", vehicle: "Bentley Bentayga", service: "Ceramic coating", film: "System X", category: "coating" },
  { photo: "tint-silverado-blue", vehicle: "Chevrolet Silverado", service: "Full vehicle tint", film: "LLumar ATC", category: "tint" },
  { photo: "ppf-corvette-c8-front", vehicle: "Chevrolet Corvette C8", service: "Full front PPF", film: "GeoShield Ceramic Shield", category: "ppf" },
  { photo: "tint-gto", vehicle: "Pontiac GTO", service: "Window tint", film: "LLumar", category: "tint" },
  { photo: "correction-yukon", vehicle: "GMC Yukon", service: "Paint correction", film: "Multi-stage polish", category: "correction" },
  { photo: "tint-chevelle-black", vehicle: "Chevrolet Chevelle", service: "Ceramic window tint", film: "LLumar CTX", category: "tint" },
  { photo: "coating-audi-q8", vehicle: "Audi Q8", service: "Correction + coating", film: "System X", category: "coating" },
  { photo: "tint-ram-2500", vehicle: "Ram 2500", service: "Full vehicle tint", film: "LLumar", category: "tint" },
  { photo: "ppf-classic-pickup", vehicle: "Classic Dodge pickup", service: "Paint protection film", film: "GeoShield Ceramic Shield", category: "ppf" },
  { photo: "tint-camaro-blue", vehicle: "Chevrolet Camaro", service: "Ceramic window tint", film: "LLumar CTX", category: "tint" },
  { photo: "coating-lincoln-white", vehicle: "Lincoln Continental", service: "Correction + coating", film: "System X", category: "coating" },
  { photo: "tint-ram-trx", vehicle: "Ram TRX", service: "Window tint", film: "LLumar", category: "tint" },
  { photo: "tint-mustang-red", vehicle: "Ford Mustang", service: "Dyed window tint", film: "LLumar ATC", category: "tint" },
  { photo: "coating-corvette-c5", vehicle: "Chevrolet Corvette C5", service: "Correction + coating", film: "System X", category: "coating" },
  { photo: "tint-explorer", vehicle: "Ford Explorer", service: "Window tint", film: "LLumar", category: "tint" },
  { photo: "ppf-f150", vehicle: "Ford F-150", service: "Front-end PPF", film: "GeoShield Ceramic Shield", category: "ppf" },
  { photo: "tint-chevelle-blue", vehicle: "Chevrolet Chevelle", service: "Window tint", film: "LLumar", category: "tint" },
  { photo: "tint-durango-srt", vehicle: "Dodge Durango SRT", service: "Window tint", film: "LLumar", category: "tint" },
  { photo: "detail-interior-before", vehicle: "Interior, on arrival", service: "Interior detail", film: "Extraction + steam", category: "detail" },
  { photo: "commercial-office", vehicle: "Commercial office", service: "Solar control film", film: "Dual reflective", category: "flat glass" },
  { photo: "commercial-hemlock", vehicle: "Hemlock Insurance Group", service: "Commercial window film", film: "Super Alloy", category: "flat glass" },
  { photo: "residential-home", vehicle: "Private residence", service: "Residential window film", film: "Solar control", category: "flat glass" },
];
