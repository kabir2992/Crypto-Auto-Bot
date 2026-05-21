import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {

  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-14 h-14 rounded-2xl
        bg-white/5
        hover:bg-white/10
        border border-white/10
        flex items-center justify-center
        transition
      "
    >
      {theme === "dark" ? (
        <Sun className="text-yellow-300" />
      ) : (
        <Moon className="text-cyan-300" />
      )}
    </button>
  );
};

export default ThemeToggle;