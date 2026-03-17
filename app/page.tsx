"use client"

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>TEST REMATRA</h1>

      <button
        onClick={() => alert("Hidup!")}
        style={{
          padding: "12px 20px",
          background: "blue",
          color: "white",
          borderRadius: "8px",
          marginTop: "20px"
        }}
      >
        TEST BUTTON
      </button>
    </div>
  )
}