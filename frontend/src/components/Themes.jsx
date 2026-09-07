import { useEffect, useState } from "react";
import { Palette } from "lucide-react";

const themes = [
  { name: "Default", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "Retro", value: "retro" },
  { name: "Cyberpunk", value: "cyberpunk" },
  { name: "Valentine", value: "valentine" },
  { name: "Aqua", value: "aqua" },
  { name: "Forest", value: "forest" },
  { name: "Cupcake", value: "cupcake" },
  { name: "Synthwave", value: "synthwave" },
  { name: "Dracula", value: "dracula" },
  { name: "Business", value: "business" },
  { name: "Luxury", value: "luxury" },
  { name: "Emerald", value: "emerald" },
  { name: "Corporate", value: "corporate" },
  { name: "Garden", value: "garden" },
  { name: "Lofi", value: "lofi" },
  { name: "Pastel", value: "pastel" },
  { name: "Wireframe", value: "wireframe" },
  { name: "Autumn", value: "autumn" },
  { name: "Halloween", value: "halloween" },
];

function Themes() {
  const colormode = localStorage.getItem("theme") || "light";

  const [theme, setTheme] = useState(colormode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-bottom dropdown-end w-full ">
      {/* Button */}
      <div
        tabIndex={0}
        role="button"
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-base-300"
      >
        <Palette size={20} />
      </div>

      {/* Themes */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-300 rounded-box z-50 mb-2 w-52 max-h-80 overflow-y-auto flex-nowrap p-2 shadow-xl"
      >
        {themes.map((item) => (
          <li key={item.value} className="w-full">
            <button
              type="button"
              onClick={() => setTheme(item.value)}
              className={`w-full flex flex-nowrap items-center justify-start whitespace-nowrap ${
                theme === item.value ? "active bg-info" : ""
              }`}
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full border border-base-content/20"
                data-theme={item.value}
              />

              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Themes;
