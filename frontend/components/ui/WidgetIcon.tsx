import React from "react";

interface IconProps {
  iconCode: string;
  className?: string;
}

const WidgetIcon = ({ iconCode, className = "" }: IconProps) => {
  const svgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 -960 960 960",
    fill: "currentColor",
    className: `${className} w-full h-full`,
  };

  // Air
  const windIcon = (
    <svg {...svgProps}>
      <path d="M460-160q-50 0-85-35t-35-85h80q0 17 11.5 28.5T460-240q17 0 28.5-11.5T500-280q0-17-11.5-28.5T460-320H80v-80h380q50 0 85 35t35 85q0 50-35 85t-85 35ZM80-560v-80h540q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43h-80q0-59 40.5-99.5T620-840q59 0 99.5 40.5T760-700q0 59-40.5 99.5T620-560H80Zm660 320v-80q26 0 43-17t17-43q0-26-17-43t-43-17H80v-80h660q59 0 99.5 40.5T880-380q0 59-40.5 99.5T740-240Z" />
    </svg>
  );

  // Humidity
  const humidityIcon = (
    <svg {...svgProps}>
      <path d="M480-120q-100 0-170-70t-70-170q0-51 22.5-95.5T324-531L480-720l156 189q39 46 61.5 90.5T720-360q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-36-16.5-67T584-480L480-605 376-480q-23 23-39.5 54T320-360q0 66 47 113t113 47Zm0-120q29 0 54.5-16.5T574-380q-13 14-30.5 22T505-350q-26 0-45.5-19.5T440-415q0-20 8-37.5t22-30.5q-19-15-34.5-40.5T420-480q0 40 21.5 73t58.5 47Z" />
    </svg>
  );

  // Feels Like
  const feelsLikeIcon = (
    <svg {...svgProps}>
      <path d="M480-80q-50 0-85-35t-35-85q0-39 21.5-70.5T430-318v-362q0-21 14.5-35.5T480-730q21 0 35.5 14.5T530-680v362q27 16 48.5 47.5T600-200q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T520-200q0-17-11.5-28.5T480-240q-17 0-28.5 11.5T440-200q0 17 11.5 28.5T480-160Zm0-160q35 0 63.5-20t40.5-52q-27-8-45.5-31T520-480v-200q0-17-11.5-28.5T480-720q-17 0-28.5 11.5T440-680v200q0 34-18.5 57T376-392q12 32 40.5 52t63.5 20Z" />
    </svg>
  );

  // Pressure
  const pressureIcon = (
    <svg {...svgProps}>
      <path d="M280-160v-80h400v80H280Zm200-160L280-520h160v-280h80v280h160L480-320Zm0-113 57-57H423l57 57Z" />
    </svg>
  );

  // Visibility
  const visibilityIcon = (
    <svg {...svgProps}>
      <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
    </svg>
  );

  // Sunrise
  const sunriseIcon = (
    <svg {...svgProps}>
      <path d="M440-680v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113ZM254-570 140-683l57-56 113 113-56 56ZM40-200v-80h880v80H40Zm120-120q0-133 93.5-226.5T480-640q133 0 226.5 93.5T800-320H160Zm320-80q66 0 113-47t47-113q-47-5-83.5 20.5T503-467q-2 23-11.5 43T471-385l9 65Z" />
    </svg>
  );

  // Sunset
  const sunsetIcon = (
    <svg {...svgProps}>
      <path d="M440-200v-160h80v160h-80Zm266-510 55-55 57 57-113 113-56-57 57-58ZM254-710l57 58-56 57-113-113 57-57 55 55ZM40-40v-80h880v80H40Zm760-280q0-133-93.5-226.5T480-640q-133 0-226.5 93.5T160-320h640ZM480-400q-66 0-113-47t-47-113q47-5 83.5 20.5T457-467q2 23 11.5 43t20.5 39l-9 65Z" />
    </svg>
  );

  switch (iconCode) {
    case "wind":
      return windIcon;
    case "humidity":
      return humidityIcon;
    case "feels_like":
      return feelsLikeIcon;
    case "pressure":
      return pressureIcon;
    case "visibility":
      return visibilityIcon;
    case "sunrise":
      return sunriseIcon;
    case "sunset":
      return sunsetIcon;
    default:
      return windIcon;
  }
};

export default WidgetIcon;
