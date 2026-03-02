import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ValidationResult, PlayerData } from "../utils/hashUtils";
import { updatePlayerGameData } from "../utils/hashUtils";

interface ErrorDialogProps {
  error: ValidationResult | null;
  players: PlayerData[];
  onClose: () => void;
  onSubmit: (correctedString: string) => void;
  mode: "error-correction" | "walkthrough" | "game-entry";
  walkthroughErrors?: ValidationResult[];
  walkthroughIndex?: number;
  onWalkthroughNext?: () => void;
  onWalkthroughPrev?: () => void;
  entryCell?: { playerRank: number; round: number };
  existingValue?: string;
  onUpdatePlayerData?: (
    playerRank: number,
    roundIndex: number,
    resultString: string,
  ) => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  1: "Invalid format",
  2: "Invalid character",
  3: "Incomplete entry",
  4: "Duplicate players",
  7: "Missing player 4",
  9: "Player rank exceeds 200",
  10: "Conflicting results - players disagree on outcome",
};

function getValidationErrorMessage(errorCode: number): string {
  return ERROR_MESSAGES[errorCode] || "Unknown error";
}

export default function ErrorDialog({
  error,
  players,
  onClose,
  onSubmit,
  mode,
  walkthroughErrors,
  walkthroughIndex,
  onWalkthroughNext,
  onWalkthroughPrev,
  entryCell,
  existingValue,
  onUpdatePlayerData,
}: ErrorDialogProps) {
  const [correctedResult, setCorrectedResult] = useState<string>("");
  const [parseStatus, setParseStatus] = useState<{
    isValid: boolean;
    error?: number;
    message?: string;
  } | null>(null);
  const [parsedGameData, setParsedGameData] = useState<{
    player1Rank: number;
    player2Rank: number;
    player3Rank: number;
    player4Rank: number;
  } | null>(null);
  const [displayPlayer1, setDisplayPlayer1] = useState<PlayerData | null>(null);
  const [displayPlayer2, setDisplayPlayer2] = useState<PlayerData | null>(null);
  const [displayPlayer3, setDisplayPlayer3] = useState<PlayerData | null>(null);
  const [displayPlayer4, setDisplayPlayer4] = useState<PlayerData | null>(null);

  const displayOriginalString = error
    ? error.originalString?.toUpperCase() || ""
    : "";

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (existingValue) {
      setCorrectedResult(existingValue.toUpperCase());
    } else {
      setCorrectedResult("");
    }
  }, [existingValue, mode]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const input = correctedResult.toUpperCase();

    if (mode === "game-entry") {
      const validation = updatePlayerGameData(input, true);
      setParseStatus({
        isValid: validation.isValid,
        error: validation.error,
        message: validation.message,
      });
    }

    let validation;
    let displayInput = input;

    if (!input.trim() && error && error.originalString) {
      validation = updatePlayerGameData(error.originalString, true);
      displayInput = error.originalString.toUpperCase();
    } else {
      validation = updatePlayerGameData(input, true);
    }

    if (displayInput.trim()) {
      setParsedGameData({
        player1Rank: validation.parsedPlayer1Rank || 0,
        player2Rank: validation.parsedPlayer2Rank || 0,
        player3Rank: validation.parsedPlayer3Rank || 0,
        player4Rank: validation.parsedPlayer4Rank || 0,
      });

      const p1 =
        validation.parsedPlayer1Rank &&
        validation.parsedPlayer1Rank > 0 &&
        validation.parsedPlayer1Rank <= players.length
          ? players[validation.parsedPlayer1Rank - 1]
          : null;
      const p2 =
        validation.parsedPlayer2Rank &&
        validation.parsedPlayer2Rank > 0 &&
        validation.parsedPlayer2Rank <= players.length
          ? players[validation.parsedPlayer2Rank - 1]
          : null;
      const p3 =
        validation.parsedPlayer3Rank &&
        validation.parsedPlayer3Rank > 0 &&
        validation.parsedPlayer3Rank <= players.length
          ? players[validation.parsedPlayer3Rank - 1]
          : null;
      const p4 =
        validation.parsedPlayer4Rank &&
        validation.parsedPlayer4Rank > 0 &&
        validation.parsedPlayer4Rank <= players.length
          ? players[validation.parsedPlayer4Rank - 1]
          : null;

      setDisplayPlayer1(p1);
      setDisplayPlayer2(p2);
      setDisplayPlayer3(p3);
      setDisplayPlayer4(p4);
    } else {
      setParsedGameData(null);
      setDisplayPlayer1(null);
      setDisplayPlayer2(null);
      setDisplayPlayer3(null);
      setDisplayPlayer4(null);
    }
  }, [correctedResult, mode, players, error]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(correctedResult);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    setCorrectedResult(newValue);
    if (mode === "game-entry" && newValue.trim()) {
      const validation = updatePlayerGameData(newValue, true);
      if (!validation.isValid && validation.error) {
        setParseStatus({
          isValid: false,
          error: validation.error,
          message: validation.message,
        });
      } else if (validation.isValid && entryCell) {
        setParseStatus({ isValid: true });
        if (onUpdatePlayerData) {
          onUpdatePlayerData(
            entryCell.playerRank,
            entryCell.round,
            validation.resultString || newValue,
          );
        }
      }
    }
  };

  const isWalkthrough = mode === "walkthrough";
  const isGameEntry = mode === "game-entry";

  const displayError = error;
  const displayIndex = walkthroughIndex ?? 0;
  const displayTotal = walkthroughErrors?.length ?? 1;
  const displayCell = entryCell ?? { playerRank: 0, round: 0 };

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
              color: isGameEntry
                ? "#3b82f6"
                : isWalkthrough
                  ? "#f59e0b"
                  : "#ef4444",
            }}
          >
            {isGameEntry
              ? "Edit Game Result"
              : isWalkthrough
                ? `Report Walkthrough - Error ${displayIndex + 1} of ${displayTotal}`
                : "Validation Error"}
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
          {isGameEntry && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              <strong>Editing:</strong> Round {displayCell.round + 1} for{" "}
              {entryCell && displayPlayer1
                ? displayPlayer1.firstName + " " + displayPlayer1.lastName
                : "Unknown"}
            </p>
          )}
          {parsedGameData && (
            <>
              {displayPlayer1 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>First Player:</strong>{" "}
                  {displayPlayer1.firstName + " " + displayPlayer1.lastName}
                </p>
              )}
              {displayPlayer2 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>Second Player:</strong>{" "}
                  {displayPlayer2.firstName + " " + displayPlayer2.lastName}
                </p>
              )}
              {displayPlayer3 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>Third Player:</strong>{" "}
                  {displayPlayer3.firstName + " " + displayPlayer3.lastName}
                </p>
              )}
              {displayPlayer4 && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong>Fourth Player:</strong>{" "}
                  {displayPlayer4.firstName + " " + displayPlayer4.lastName}
                </p>
              )}
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#0369a1",
                  backgroundColor: "#f0f9ff",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  marginTop: "0.5rem",
                }}
              >
                Parsed: P1={parsedGameData.player1Rank} P2=
                {parsedGameData.player2Rank} P3={parsedGameData.player3Rank} P4=
                {parsedGameData.player4Rank}
              </p>
            </>
          )}
        </div>

        {!isGameEntry && displayError && (
          <div style={{ marginBottom: "1rem" }}>
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
                {displayOriginalString || "(empty)"}
              </code>
            </p>
            {displayError.error !== undefined && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#ef4444",
                  marginBottom: "0.5rem",
                }}
              >
                <strong>Error:</strong>{" "}
                {getValidationErrorMessage(displayError.error)}
              </p>
            )}
          </div>
        )}

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
            {isGameEntry
              ? "Enter corrected result string:"
              : "Enter corrected result string:"}
          </label>
          <input
            type="text"
            id="correctedResult"
            name="correctedResult"
            value={correctedResult}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              boxSizing: "border-box",
              borderColor: parseStatus
                ? parseStatus.isValid
                  ? "#10b981"
                  : "#ef4444"
                : "#d1d5db",
            }}
            placeholder="e.g., 1:2W3:4 for 4-player or 2w3 for 2-player"
            autoFocus
          />
          {parseStatus && (
            <p
              style={{
                fontSize: "0.75rem",
                color: parseStatus.isValid ? "#10b981" : "#ef4444",
                marginBottom: "1rem",
              }}
            >
              {parseStatus.isValid
                ? "✓ Valid format"
                : `✗ ${parseStatus.message || "Invalid format"}`}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "flex-end",
            }}
          >
            {isWalkthrough &&
              walkthroughIndex !== undefined &&
              walkthroughErrors && (
                <>
                  <button
                    type="button"
                    onClick={onWalkthroughPrev}
                    disabled={walkthroughIndex === 0}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        walkthroughIndex === 0 ? "#e5e7eb" : "#f3f4f6",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.25rem",
                      cursor:
                        walkthroughIndex === 0 ? "not-allowed" : "pointer",
                      fontSize: "0.875rem",
                      color: walkthroughIndex === 0 ? "#9ca3af" : "#374151",
                    }}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={onWalkthroughNext}
                    disabled={walkthroughIndex === walkthroughErrors.length - 1}
                    style={{
                      padding: "0.5rem 1rem",
                      background:
                        walkthroughIndex === walkthroughErrors.length - 1
                          ? "#e5e7eb"
                          : "#f59e0b",
                      border:
                        walkthroughIndex === walkthroughErrors.length - 1
                          ? "1px solid #d1d5db"
                          : "none",
                      borderRadius: "0.25rem",
                      cursor:
                        walkthroughIndex === walkthroughErrors.length - 1
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "0.875rem",
                      color:
                        walkthroughIndex === walkthroughErrors.length - 1
                          ? "#9ca3af"
                          : "white",
                    }}
                  >
                    Next
                  </button>
                </>
              )}
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
              {isGameEntry ? "Save" : "Submit Correction"}
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
          2-player, 1 result: `2W3` (player 2 vs 3, player 2 wins)
          <br />
          2-player, 2 results: `3WL4` (player 3 vs 4, W then L)
          <br />
          4-player, 1 result: `1:2W3:4` (team 1-2 vs 3-4, team 1-2 wins)
          <br />
          4-player, 2 results: `1:2WL3:4` (team 1-2 vs 3-4, team 1-2 wins)
        </div>
      </div>
    </div>
  );
}
