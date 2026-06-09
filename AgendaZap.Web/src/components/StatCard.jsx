import { colors } from "../styles/theme";

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: colors.card,
        padding: "28px",
        borderRadius: "18px",
        minWidth: "230px",
        color: colors.text,
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <h3 style={{ color: colors.mutedText }}>{title}</h3>
      <h1 style={{ fontSize: "3rem" }}>{value}</h1>
    </div>
  );
}

export default StatCard;
