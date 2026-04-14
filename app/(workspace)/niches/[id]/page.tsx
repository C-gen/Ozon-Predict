import { listNiches } from "@/data/niches/repository";
import NicheDetailClientPage from "./niche-detail-client";

export default function NicheDetailPage() {
  return <NicheDetailClientPage />;
}

export function generateStaticParams() {
  return listNiches().map((niche) => ({ id: niche.id }));
}
