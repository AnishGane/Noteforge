import PageWrapper from "@/components/page-wrapper";

export default function Page() {
  return (
    <PageWrapper breadCrumbs={[{ label: "Dashboard", path: "/dashboard" }]}>
      <h1>Dashboard</h1>
    </PageWrapper>
  );
}
