"use client";

type AsciiNameVisualProps = { reducedMotion?: boolean | null };

const letters: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
};

function buildAsciiName() {
  const name = "ARHAAN";
  return Array.from({ length: 7 }, (_, row) =>
    name
      .split("")
      .map((letter) =>
        letters[letter][row]
          .split("")
          .map((pixel) => (pixel === "1" ? "ARHAAN" : "      "))
          .join(""),
      )
      .join("  "),
  ).join("\n");
}

export function AsciiNameVisual({ reducedMotion }: AsciiNameVisualProps) {
  return (
    <div className="ascii-name-visual reveal" aria-label="Arhaan Shaikh, rendered in ASCII typography">
      <div className="ascii-name-topline">
        <span>IDENTITY / 01</span>
        <span>ARHAAN SHAIKH</span>
      </div>
      <div className="ascii-name-art-wrap">
        <pre className="ascii-name-art" aria-hidden="true">{buildAsciiName()}</pre>
      </div>
      <div className="ascii-name-bottomline">
        <span>LEARN</span><i aria-hidden="true" /><span>TEST</span><i aria-hidden="true" /><span>BUILD</span>
      </div>
    </div>
  );
}
