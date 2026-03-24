"use client";
import { useEffect, useMemo, useState } from "react";
import { ARTISTS, BRANCHES, DEFAULT_SLOTS, SERVICES, SERVICE_DEPOSITS } from "../../lib/constants";

const initial = {
  client_name: "", mobile_number: "", email: "", social_handle: "",
  artist_name: ARTISTS[0], service_name: SERVICES[0], booking_date: "", booking_time: "",
  placement: "", size: "", budget: "", preferred_branch: BRANCHES[0],
  design_description: "", notes: "", proof_reference_number: "", payer_name: ""
};

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [referenceImage, setReferenceImage] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const depositAmount = useMemo(() => SERVICE_DEPOSITS[form.service_name], [form.service_name]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.artist_name || !form.booking_date) return;
      setLoadingSlots(true); setError("");
      try {
        const res = await fetch(`/api/slots?artist_name=${encodeURIComponent(form.artist_name)}&date=${encodeURIComponent(form.booking_date)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load slots");
        setSlots(data.slots);
        if (!data.slots.includes(form.booking_time)) setForm((prev) => ({ ...prev, booking_time: "" }));
      } catch (err) { setError(err.message); } finally { setLoadingSlots(false); }
    }
    loadSlots();
  }, [form.artist_name, form.booking_date]);

  function updateField(key, value){ setForm((prev)=>({ ...prev, [key]: value })); }
  function nextStep(){
    setError("");
    if(step===1 && (!form.client_name || !form.mobile_number || !form.artist_name || !form.service_name)) return setError("Please fill in your name, mobile number, artist, and service.");
    if(step===2 && (!form.booking_date || !form.booking_time)) return setError("Please choose a date and available slot.");
    if(step===4 && !proofImage) return setError("Please upload proof of payment before submitting.");
    setStep((prev)=>prev+1);
  }
  function prevStep(){ setError(""); setStep((prev)=>prev-1); }

  async function submitBooking() {
    setError("");
    if (!proofImage) return setError("Proof of payment is required.");
    const payload = new FormData();
    Object.entries(form).forEach(([k,v]) => payload.append(k, v));
    payload.append("deposit_amount", String(depositAmount));
    if (referenceImage) payload.append("reference_image", referenceImage);
    payload.append("proof_of_payment", proofImage);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", { method: "POST", body: payload });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit booking");
      setSuccess(data.booking); setStep(5);
    } catch(err){ setError(err.message); } finally { setSubmitting(false); }
  }

  if(success && step===5){
    return <div className="container"><div className="card p-24">
      <p className="kicker">Booking submitted</p>
      <h1 className="h1">Thank you. Your booking is pending review.</h1>
      <p className="muted mb-24">Admin will review your payment proof and confirm your slot soon.</p>
      <div className="grid grid-2">
        <div className="alert"><strong>Booking Ref:</strong> {success.booking_reference}</div>
        <div className="alert"><strong>Status:</strong> {success.status}</div>
        <div className="alert"><strong>Artist:</strong> {success.artist_name}</div>
        <div className="alert"><strong>Service:</strong> {success.service_name}</div>
        <div className="alert"><strong>Date:</strong> {success.booking_date}</div>
        <div className="alert"><strong>Time:</strong> {success.booking_time}</div>
      </div>
    </div></div>;
  }

  return (
    <div className="container">
      <div className="space-between mb-24">
        <div>
          <p className="kicker">Public booking link</p>
          <h1 className="h1">INFMSINK Booking</h1>
          <p className="muted">Choose your artist, slot, service, deposit, and upload proof of payment.</p>
        </div>
        <a href="/admin/login" className="button secondary">Admin Login</a>
      </div>
      <div className="row mb-16">{[1,2,3,4].map((n)=><span className="badge" key={n}>{n===step?`Step ${n}`:n}</span>)}</div>
      {error ? <div className="error mb-16">{error}</div> : null}
      <div className="card p-24">
        {step===1 && <>
          <h2 className="h2">1. Client and service details</h2>
          <div className="grid grid-2">
            <div><label>Full name</label><input value={form.client_name} onChange={(e)=>updateField("client_name", e.target.value)} /></div>
            <div><label>Mobile number</label><input value={form.mobile_number} onChange={(e)=>updateField("mobile_number", e.target.value)} /></div>
            <div><label>Email</label><input type="email" value={form.email} onChange={(e)=>updateField("email", e.target.value)} /></div>
            <div><label>Instagram / Facebook</label><input value={form.social_handle} onChange={(e)=>updateField("social_handle", e.target.value)} /></div>
            <div><label>Artist</label><select value={form.artist_name} onChange={(e)=>updateField("artist_name", e.target.value)}>{ARTISTS.map((a)=><option key={a}>{a}</option>)}</select></div>
            <div><label>Service</label><select value={form.service_name} onChange={(e)=>updateField("service_name", e.target.value)}>{SERVICES.map((s)=><option key={s}>{s}</option>)}</select></div>
          </div>
        </>}
        {step===2 && <>
          <h2 className="h2">2. Choose date and slot</h2>
          <div className="grid grid-2">
            <div><label>Date</label><input type="date" value={form.booking_date} onChange={(e)=>updateField("booking_date", e.target.value)} /></div>
            <div><label>Available slots</label>
              <select value={form.booking_time} onChange={(e)=>updateField("booking_time", e.target.value)}>
                <option value="">Select a slot</option>
                {slots.map((slot)=><option key={slot} value={slot}>{slot}</option>)}
              </select>
              {loadingSlots ? <p className="muted">Loading slots…</p> : null}
            </div>
          </div>
        </>}
        {step===3 && <>
          <h2 className="h2">3. Booking details</h2>
          <div className="grid grid-2">
            <div><label>Placement</label><input value={form.placement} onChange={(e)=>updateField("placement", e.target.value)} /></div>
            <div><label>Size</label><input value={form.size} onChange={(e)=>updateField("size", e.target.value)} /></div>
            <div><label>Budget</label><input value={form.budget} onChange={(e)=>updateField("budget", e.target.value)} /></div>
            <div><label>Preferred branch</label><select value={form.preferred_branch} onChange={(e)=>updateField("preferred_branch", e.target.value)}>{BRANCHES.map((b)=><option key={b}>{b}</option>)}</select></div>
          </div>
          <div className="mt-24"><label>Design description</label><textarea value={form.design_description} onChange={(e)=>updateField("design_description", e.target.value)} /></div>
          <div className="mt-24"><label>Notes</label><textarea value={form.notes} onChange={(e)=>updateField("notes", e.target.value)} /></div>
          <div className="mt-24"><label>Reference image (optional)</label><input type="file" accept="image/*" onChange={(e)=>setReferenceImage(e.target.files?.[0] || null)} /></div>
        </>}
        {step===4 && <>
          <h2 className="h2">4. Deposit and proof upload</h2>
          <div className="alert mb-16"><strong>Deposit amount:</strong> ₱{depositAmount.toLocaleString()}</div>
          <div className="card p-20 mb-16">
            <p className="h3">Payment instructions</p>
            <p className="muted">Replace this section with your real GCash / bank details.</p>
            <p><strong>GCash Name:</strong> INFMSINK</p>
            <p><strong>GCash Number:</strong> 09XX-XXX-XXXX</p>
          </div>
          <div className="grid grid-2">
            <div><label>Proof reference number (optional)</label><input value={form.proof_reference_number} onChange={(e)=>updateField("proof_reference_number", e.target.value)} /></div>
            <div><label>Payer name (optional)</label><input value={form.payer_name} onChange={(e)=>updateField("payer_name", e.target.value)} /></div>
          </div>
          <div className="mt-24"><label>Upload proof of payment *</label><input type="file" accept="image/*" onChange={(e)=>setProofImage(e.target.files?.[0] || null)} /></div>
        </>}
        <div className="row mt-24">
          {step>1 && step<5 ? <button type="button" className="secondary" onClick={prevStep}>Back</button> : null}
          {step<4 ? <button type="button" onClick={nextStep}>Next</button> : null}
          {step===4 ? <button type="button" onClick={submitBooking} disabled={submitting}>{submitting ? "Submitting..." : "Submit Booking"}</button> : null}
        </div>
      </div>
    </div>
  );
}
