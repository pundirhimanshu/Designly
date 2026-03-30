import PublicPortfolio from "@/components/PublicPortfolio";

export default function Page({ params }: { params: { domain: string } }) {
  return <PublicPortfolio domain={params.domain} />;
}
