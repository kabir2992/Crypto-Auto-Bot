const GlassCard = ({
  children,
  className = ""
}) => {

  return (

    <div className={`
      rounded-3xl
      border
      border-white/10
      bg-white/[0.03]
      backdrop-blur-2xl
      shadow-[0_8px_40px_rgba(0,0,0,0.35)]
      transition-all
      duration-300
      hover:border-cyan-400/20
      hover:shadow-cyan-500/10
      ${className}
    `}>

      {children}

    </div>

  );

};

export default GlassCard;