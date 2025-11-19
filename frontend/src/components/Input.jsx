import { useState } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

const Input = ({ 
  label, 
  type = 'text', 
  icon: Icon, 
  className = '', 
  showPasswordToggle = false,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      )}
      <input
        type={inputType}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
          Icon ? 'pl-10' : ''
        } ${(isPassword && showPasswordToggle) ? 'pr-10' : ''}`}
        {...props}
      />
      {isPassword && showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
        >
          {showPassword ? (
            <HiEyeSlash className="w-5 h-5" />
          ) : (
            <HiEye className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

export default Input;