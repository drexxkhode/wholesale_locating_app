import MobileHeader from "../components/MobileHeader";

export default function About() {
  return (
    <>
      <MobileHeader variant="back" title="About Us" />
      <div className="container py-4 px-3" style={{ maxWidth: 900 }}>
        <h1 className="fw-bold mb-3" style={{ fontSize: "1.6rem" }}>About This Platform</h1>
        <p className="text-muted-brand" style={{ lineHeight: 1.7 }}>
          This platform helps you find, locate and get directions to wholesale
          companies operating in the North Industrial Area, Accra. Search by
          product or category, view verified company profiles, and plan your
          route directly from the app — built as a final year GIS-based
          spatial information system project.
        </p>
      </div>
    </>
  );
}
