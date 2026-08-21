import React from "react";

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

const WeatherIcon = ({ iconCode, className = "" }: WeatherIconProps) => {
  // Common SVG Props to keep things clean
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 -960 960 960",
    fill: "currentColor", // Inherit color from parent text color
    className: `w-full h-full ${className}`,
  };

  switch (iconCode) {
    // ☀️ Clear Sky (Day / Night)
    case "01d":
    case "01n":
      return (
        <svg {...svgProps}>
          <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z" />
        </svg>
      );

    // ⛅️ Few / Scattered / Broken Clouds
    case "02d":
    case "02n":
    case "03d":
    case "03n":
    case "04d":
    case "04n":
      return (
        <svg {...svgProps}>
          <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-280Z" />
        </svg>
      );

    // 🌧️ Rain / Shower Rain
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      return (
        <svg {...svgProps}>
          <path d="M260-240q-91 0-155.5-63T40-457q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-600q69 8 114.5 59.5T920-420q0 75-52.5 127.5T740-240H260Zm100 240v-160h80v160h-80Zm240 0v-160h80v160h-80Zm-120-80v-160h80v160h-80ZM260-320h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-800q-83 0-141.5 58.5T280-600h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-280Z" />
        </svg>
      );

    // ⛈️ Thunderstorm
    case "11d":
    case "11n":
      return (
        <svg {...svgProps}>
          <path d="M480-40 320-360h120v-200h80v200h120L480-40Zm-220-320q-91 0-155.5-63T40-577q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-720q69 8 114.5 59.5T920-540q0 75-52.5 127.5T740-360H680v-80h60q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-920q-83 0-141.5 58.5T280-720h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h40v80h-40Zm220-280Z" />
        </svg>
      );

    // ❄️ Snow
    case "13d":
    case "13n":
      return (
        <svg {...svgProps}>
          <path d="M440-40v-167l-64 63-56-56 160-160 160 160-56 56-64-63v167h-80Zm0-553v-167l-64 63-56-56 160-160 160 160-56 56-64-63v167h-80ZM160-320l-56-56 160-160-160-160 56-56 160 160 160-160 56 56-160 160 160 160-56 56-160-160-160 160Z" />
        </svg>
      );

    // 🌫️ Mist / Fog (Default)
    case "50d":
    case "50n":
    default:
      return (
        <svg {...svgProps}>
          <path d="M120-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Zm0-160v-80h720v80H120Z" />
        </svg>
      );
  }
};

export default WeatherIcon;
