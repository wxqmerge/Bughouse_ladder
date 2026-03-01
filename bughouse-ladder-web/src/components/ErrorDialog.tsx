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
              <strong>Error Code:</strong> {error.error}
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
            placeholder="e.g., 10:20W"
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
          <strong>Format:</strong> Player1:Player2[Score]
          <br />
          Scores: W (win), L (loss), D (draw), O (no result)
          <br />
          Example: 10:20W means player 10 vs player 20, player 10 won
        </div>
      </div>
    </div>
  );
}
