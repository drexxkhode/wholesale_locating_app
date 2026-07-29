import MobileHeader from "../components/MobileHeader";

export default function Contact() {
  return (
    <>
      <MobileHeader variant="back" title="Contact" />
      <div className="container py-4 px-3" style={{ maxWidth: 700 }}>
        <h1 className="fw-bold mb-3" style={{ fontSize: "1.6rem" }}>Contact Us</h1>
        <form className="d-flex flex-column gap-3" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="form-label fw-medium">Name</label>
            <input className="form-control py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="form-label fw-medium">Email</label>
            <input type="email" className="form-control py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="form-label fw-medium">Message</label>
            <textarea className="form-control" rows={4} placeholder="How can we help?" />
          </div>
          <button className="btn btn-brand rounded-3 align-self-start px-4">Send Message</button>
        </form>
      </div>
    </>
  );
}
