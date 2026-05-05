"use client";

export function BorderBeam() {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <span className="absolute left-[-30%] top-0 h-px w-1/2 animate-[beam_5s_linear_infinite] bg-gradient-to-r from-transparent via-secondary to-transparent" />
      <span className="absolute bottom-0 right-[-30%] h-px w-1/2 animate-[beamReverse_6s_linear_infinite] bg-gradient-to-r from-transparent via-primary to-transparent" />
    </span>
  );
}
