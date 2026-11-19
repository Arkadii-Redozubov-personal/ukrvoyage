import React from "react";
import type { VehicleClassId } from "@/data/fleet";

interface VehicleSilhouetteSvgProps {
  classId: VehicleClassId;
  className?: string;
}

export function VehicleSilhouetteSvg({
  classId,
  className = "h-24 w-full max-w-[260px]",
}: VehicleSilhouetteSvgProps) {
  switch (classId) {
    case "comfort-sedan":
      return (
        <svg
          viewBox="0 0 280 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M24 72C22 65 24 54 32 49L64 43L94 25C108 18 148 18 176 23L210 42L245 48C254 50 258 58 258 68L254 74H234A20 20 0 0 0 194 74H86A20 20 0 0 0 46 74H28L24 72Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M78 43L101 27H170L199 43H78Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <line x1="138" y1="27" x2="138" y2="73" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <circle cx="66" cy="74" r="16" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="66" cy="74" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <circle cx="214" cy="74" r="16" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="214" cy="74" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case "business-sedan":
      return (
        <svg
          viewBox="0 0 280 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M18 72C16 64 19 52 28 47L62 42L96 22C116 15 160 15 186 22L218 42L252 47C261 49 265 58 264 69L258 75H238A20 20 0 0 0 198 75H84A20 20 0 0 0 44 75H22L18 72Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M78 42L104 25H178L207 42H78Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <line x1="142" y1="25" x2="142" y2="74" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <circle cx="64" cy="75" r="16.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="64" cy="75" r="7.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <circle cx="218" cy="75" r="16.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="218" cy="75" r="7.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case "minivan":
      return (
        <svg
          viewBox="0 0 280 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M24 74L28 32C30 22 38 18 54 18H156C174 18 186 24 204 42L244 48C252 50 256 58 256 70L250 76H234A19 19 0 0 0 196 76H84A19 19 0 0 0 46 76H28L24 74Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M39 24H158C171 24 180 28 197 44H36L39 24Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <line x1="94" y1="24" x2="94" y2="44" stroke="currentColor" strokeWidth="1.3" />
          <line x1="148" y1="24" x2="148" y2="75" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <circle cx="65" cy="76" r="16" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="65" cy="76" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <circle cx="215" cy="76" r="16" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="215" cy="76" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case "minibus":
      return (
        <svg
          viewBox="0 0 280 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M18 76L22 28C24 18 32 14 48 14H184C198 14 210 22 224 41L250 47C258 49 262 58 262 72L256 78H236A18 18 0 0 0 200 78H82A18 18 0 0 0 46 78H22L18 76Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M32 21H182C194 21 203 27 216 43H30L32 21Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <line x1="68" y1="21" x2="68" y2="43" stroke="currentColor" strokeWidth="1.3" />
          <line x1="106" y1="21" x2="106" y2="43" stroke="currentColor" strokeWidth="1.3" />
          <line x1="144" y1="21" x2="144" y2="43" stroke="currentColor" strokeWidth="1.3" />
          <line x1="176" y1="21" x2="176" y2="77" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <circle cx="64" cy="78" r="15.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="64" cy="78" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <circle cx="218" cy="78" r="15.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="218" cy="78" r="7" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case "coach":
      return (
        <svg
          viewBox="0 0 280 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className={className}
        >
          <path
            d="M16 74L18 22C19 15 26 12 38 12H238C249 12 256 18 260 32L266 64C267 72 264 78 256 78H238A16 16 0 0 0 206 78H78A16 16 0 0 0 46 78H22C18 78 16 76 16 74Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M25 18H236C245 18 250 23 255 43H24L25 18Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <line x1="60" y1="18" x2="60" y2="43" stroke="currentColor" strokeWidth="1.2" />
          <line x1="96" y1="18" x2="96" y2="43" stroke="currentColor" strokeWidth="1.2" />
          <line x1="132" y1="18" x2="132" y2="43" stroke="currentColor" strokeWidth="1.2" />
          <line x1="168" y1="18" x2="168" y2="43" stroke="currentColor" strokeWidth="1.2" />
          <line x1="204" y1="18" x2="204" y2="43" stroke="currentColor" strokeWidth="1.2" />
          <line x1="234" y1="18" x2="234" y2="77" stroke="currentColor" strokeWidth="1.2" opacity="0.65" />
          <circle cx="62" cy="78" r="14.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="62" cy="78" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
          <circle cx="222" cy="78" r="14.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="222" cy="78" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
  }
}

