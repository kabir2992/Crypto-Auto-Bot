import {
  Moon,
  Sun
} from "lucide-react";

import useTheme from "../../hooks/useTheme";

const ThemeToggle = () => {

  const {
    theme,
    toggleTheme
  } = useTheme();

  return (

    <button
      onClick={toggleTheme}
      className="
        relative
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-white/10
        bg-white/5
        px-4
        py-3
        text-sm
        font-semibold
        text-slate-300
        transition-all
        duration-300
        hover:border-cyan-400/20
        hover:bg-cyan-500/10
        hover:text-cyan-300
      "
    >

      {
        theme === "dark"
          ? (
            <>
              <Sun size={18} />
              Light Mode
            </>
          )
          : (
            <>
              <Moon size={18} />
              Dark Mode
            </>
          )
      }

    </button>

  );

};

export default ThemeToggle;