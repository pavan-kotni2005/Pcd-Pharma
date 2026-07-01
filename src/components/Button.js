const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#3B5BFF] text-white hover:bg-[#2e4ed6] shadow-glow',
    secondary: 'bg-white/5 text-white hover:bg-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-[#FF4D6D] text-white hover:bg-[#e03d5c]'
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold transition duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
