import CaseStudyEditor from "@/components/CaseStudyEditor";

export default function Page({ params }: { params: { id: string } }) {
  return <CaseStudyEditor id={params.id} />;
}
