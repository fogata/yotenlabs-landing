export function DynamicBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="dynamic-blob dynamic-blob-one" />
      <div className="dynamic-blob dynamic-blob-two" />
      <div className="dynamic-blob dynamic-blob-three" />
      <div className="dynamic-noise" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.35)_0%,rgba(9,9,11,0.72)_38%,rgba(9,9,11,0.96)_100%)]" />
    </div>
  );
}
