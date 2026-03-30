import PublicCaseStudy from "@/components/PublicCaseStudy";

export default function Page({ params }: { params: { domain: string, id: string } }) {
  return <PublicCaseStudy domain={params.domain} id={params.id} />;
}
