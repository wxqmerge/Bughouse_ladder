import { X } from "lucide-react";
import type { ValidationResult, PlayerData } from "../utils/hashUtils";

interface ErrorDialogProps {
  error: ValidationResult | null;
  players: PlayerData[];
  onClose: () => void;
  onSubmit: (correctedString: string) => void;
}

export default function ErrorDialog({
  error,
  players,
  onClose,
  onSubmit,
}: ErrorDialogProps) {
  if (!error) return null;

  const player1 =
    error.player1 > 0 && error.player1 <= players.length
      ? players[error.player1 - 1]
      : null;
  const player2 =
    error.player2 > 0 && error.player2 <= players.length
      ? players[error.player2 - 1]
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const correctedString = formData.get("correctedResult") as string;
    onSubmit(correctedString);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#ef4444",
            }}
          >
            Validation Error
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            <strong>First Player:</strong>{" "}
            {player1 ? player1.firstName : "Unknown"}
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            <strong>Second Player:</strong>{" "}
            {player2 ? player2.firstName : "Unknown"}
          </p>
          {error.player3 > 0 && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Third Player:</strong>{" "}
              {players[error.player3 - 1]?.firstName || "Unknown"}
            </p>
          )}
          {error.player4 > 0 && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Fourth Player:</strong>{" "}
              {players[error.player4 - 1]?.firstName || "Unknown"}
            </p>
          )}
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "0.5rem",
            }}
          >
            <strong>Original String:</strong>{" "}
            <code
              style={{
                backgroundColor: "#f3f4f6",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.25rem",
                fontSize: "0.75rem",
              }}
            >
              {error.originalString || "(empty)"}
            </code>
          </p>
          {error.error !== undefined && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#ef4444",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Error:</strong>{" "}
              {error.error === 10
                ? "Conflicting results - players disagree on outcome"
                : "Invalid result format"}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="correctedResult"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            Enter corrected result string:
          </label>
          <input
            type="text"
            name="correctedResult"
            id="correctedResult"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              boxSizing: "border-box",
            }}
            placeholder="e.g., 1:2W3:4 for 4-player or 2w3 for 2-player"
            autoFocus
          />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                border: "none",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                color: "white",
              }}
            >
              Submit Correction
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            backgroundColor: "#f0f9ff",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
            color: "#0369a1",
          }}
        >
          <strong>Format:</strong>
          <br />
          2-player, 1 result: `2w3` (player 2 vs 3, player 2 wins)
          <br />
          2-player, 2 results: `3wl4` (player 3 vs 4, W then L)
          <br />
          4-player, 1 result: `1:2w3:4` (team 1-2 vs 3-4, team 1-2 wins)
          <br />
          4-player, 2 results: `1:2wl3:4` (team 1-2 vs 3-4, W then L)
        </div>
      </div>
    </div>
  );
}
