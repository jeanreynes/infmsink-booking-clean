"use client";

import { useMemo, useState } from "react";

const tattooArtists = [
  "Jean",
  "Ching",
  "Gao",
  "Spycs",
  "Hani",
  "Aowi",
  "Six",
  "Mards",
];

const piercingArtists = ["Ivan", "Scott"];

const adminSlots = {
  Jean: ["1:00 PM", "3:00 PM", "5:00 PM"],
  Ching: ["1:00 PM", "4:00 PM"],
  Gao: ["2:00 PM", "5:00 PM"],
  Spycs: ["12:00 PM", "3:00 PM"],
  Hani: ["1:00 PM", "2:00 PM", "6:00 PM"],
  Aowi: ["11:00 AM", "2:00 PM"],
  Six: ["1:00 PM", "3:00 PM", "7:00 PM"],
  Mards: ["12:00 PM", "4:00 PM"],
  Ivan: ["11:00 AM", "1:00 PM", "3:00 PM"],
  Scott: ["12:00 PM", "2:00 PM", "4:00 PM"],
};

function formatPeso(value) {
  const num = Number(value || 0);
  return "₱ " + num.toLocaleString();
}

export default function BookPage() {
  const [step, setStep] = useState(1);

  const [client, setClient] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
  });

  const [service, setService] = useState("");
  const [artist, setArtist] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [quotationAmount, setQuotationAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [proofFileName, setProofFileName] = useState("");

  const availableArtists = useMemo(() => {
    if (service === "Tattoo") return tattooArtists;
    if (service === "Piercing") return piercingArtists;
    return [];
  }, [service]);

  const availableSlots = useMemo(() => {
    return adminSlots[artist] || [];
  }, [artist]);

  const canGoClientDetails =
    client.fullName.trim() &&
    client.mobileNumber.trim() &&
    client.email.trim();

  const canGoService = !!service;
  const canGoArtist = !!artist;
  const canGoSchedule = !!date && !!timeSlot;
  const canConfirmBooking =
    quotationAmount &&
    depositAmount &&
    proofFileName;

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => prev - 1);
  }

  function handleServiceChoose(selected) {
    setService(selected);
    setArtist("");
    setDate("");
    setTimeSlot("");
  }

  function handleArtistChoose(selected) {
    setArtist(selected);
    setDate("");
    setTimeSlot("");
  }

  function calculateDeposit() {
    const amount = Number(quotationAmount || 0);
    if (!amount) return;
    const fivePercent = amount * 0.05;
    setDepositAmount(String(Math.round(fivePercent)));
  }

  function handleProofUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
    }
  }

  function handleConfirmBooking() {
    if (!canConfirmBooking) return;

    alert(
  `Booking request submitted.

Client: ${client.fullName}
Service: ${service}
Artist: ${artist}
Date: ${date}
Time: ${timeSlot}
Quotation: ${formatPeso(quotationAmount)}
Deposit: ${formatPeso(depositAmount)}

Admin can now review and confirm this booking.`
);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "18px",
          padding: "24px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "14px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            Step {step} of 6
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#111827",
            }}
          >
            INFMSINK Booking
          </h1>
        </div>

        {step === 1 && (
          <section>
            <h2>Client Details</h2>

            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              <div>
                <label>Full Name</label>
                <input
                  value={client.fullName}
                  onChange={(e) =>
                    setClient({ ...client, fullName: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Mobile Number</label>
                <input
                  value={client.mobileNumber}
                  onChange={(e) =>
                    setClient({ ...client, mobileNumber: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={buttonRowStyle}>
              <button
                onClick={nextStep}
                disabled={!canGoClientDetails}
                style={canGoClientDetails ? primaryBtn : disabledBtn}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2>Choose Service</h2>

            <div style={choiceGrid}>
              <button
                onClick={() => handleServiceChoose("Tattoo")}
                style={service === "Tattoo" ? activeChoice : choiceBtn}
              >
                Tattoo
              </button>

              <button
                onClick={() => handleServiceChoose("Piercing")}
                style={service === "Piercing" ? activeChoice : choiceBtn}
              >
                Piercing
              </button>
            </div>

            <div style={buttonRowStyle}>
              <button onClick={prevStep} style={secondaryBtn}>
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canGoService}
                style={canGoService ? primaryBtn : disabledBtn}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2>
              {service === "Tattoo"
                ? "Choose Tattoo Artist"
                : "Choose Piercing Artist"}
            </h2>

            <div style={choiceGrid}>
              {availableArtists.map((name) => (
                <button
                  key={name}
                  onClick={() => handleArtistChoose(name)}
                  style={artist === name ? activeChoice : choiceBtn}
                >
                  {name}
                </button>
              ))}
            </div>

            <div style={buttonRowStyle}>
              <button onClick={prevStep} style={secondaryBtn}>
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canGoArtist}
                style={canGoArtist ? primaryBtn : disabledBtn}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2>Choose Date and Timeslot</h2>

            <div style={{ marginTop: "16px", display: "grid", gap: "16px" }}>
              <div>
                <label>Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTimeSlot("");
                  }}
                  style={inputStyle}
                />
              </div>

              {date && (
                <div>
                  <label>Available Timeslots for {artist}</label>
                  <div style={choiceGrid}>
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        style={timeSlot === slot ? activeChoice : choiceBtn}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={buttonRowStyle}>
              <button onClick={prevStep} style={secondaryBtn}>
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canGoSchedule}
                style={canGoSchedule ? primaryBtn : disabledBtn}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2>Deposit Page</h2>

            <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
              <div>
                <label>Service Quotation Amount</label>
                <input
                  type="number"
                  value={quotationAmount}
                  onChange={(e) => {
                    setQuotationAmount(e.target.value);
                    setDepositAmount("");
                  }}
                  placeholder="Enter quotation amount"
                  style={inputStyle}
                />
              </div>

              <div>
                <button
                  onClick={calculateDeposit}
                  disabled={!quotationAmount}
                  style={quotationAmount ? primaryBtn : disabledBtn}
                >
                  Calculate Deposit Amount
                </button>
              </div>

              <div>
                <label>Calculated Deposit Amount</label>
                <input
                  value={depositAmount ? formatPeso(depositAmount) : ""}
                  readOnly
                  style={{
                    ...inputStyle,
                    background: "#f3f4f6",
                  }}
                />
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  padding: "12px",
                  borderRadius: "12px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                Note: Deposit is deductible from the total {service.toLowerCase()} amount.
              </div>

              <div>
                <label>Attach Proof of Payment</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofUpload}
                  style={inputStyle}
                />
                {proofFileName ? (
                  <div style={{ marginTop: "8px", fontSize: "14px", color: "#16a34a" }}>
                    Attached: {proofFileName}
                  </div>
                ) : null}
              </div>
            </div>

            <div style={buttonRowStyle}>
              <button onClick={prevStep} style={secondaryBtn}>
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!canConfirmBooking}
                style={canConfirmBooking ? primaryBtn : disabledBtn}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {step === 6 && (
          <section>
            <h2>Confirm Booking</h2>

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                padding: "18px",
                borderRadius: "14px",
              }}
            >
              <div><strong>Name:</strong> {client.fullName}</div>
              <div><strong>Mobile:</strong> {client.mobileNumber}</div>
              <div><strong>Email:</strong> {client.email}</div>
              <div><strong>Service:</strong> {service}</div>
              <div><strong>Artist:</strong> {artist}</div>
              <div><strong>Date:</strong> {date}</div>
              <div><strong>Time:</strong> {timeSlot}</div>
              <div><strong>Quotation:</strong> {formatPeso(quotationAmount)}</div>
              <div><strong>Deposit:</strong> {formatPeso(depositAmount)}</div>
              <div><strong>Proof:</strong> {proofFileName}</div>
            </div>

            <div style={buttonRowStyle}>
              <button onClick={prevStep} style={secondaryBtn}>
                Back
              </button>
              <button onClick={handleConfirmBooking} style={primaryBtn}>
                Confirm Booking
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "14px",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  fontSize: "15px",
  outline: "none",
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  justifyContent: "space-between",
  marginTop: "24px",
};

const choiceGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
  marginTop: "18px",
};

const primaryBtn = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  minWidth: "120px",
};

const secondaryBtn = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
  minWidth: "120px",
};

const disabledBtn = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#d1d5db",
  color: "#6b7280",
  fontWeight: 700,
  cursor: "not-allowed",
  minWidth: "120px",
};

const choiceBtn = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const activeChoice = {
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #111827",
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
