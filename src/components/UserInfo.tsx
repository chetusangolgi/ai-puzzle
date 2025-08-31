import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export interface UserInfo {
  name: string;
  email: string;
}

interface UserInfoProps {
  onNext: (userInfo: UserInfo) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <div 
      className="min-h-screen flex p-4"
      style={{
        backgroundImage: 'url(/reg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="p-4 w-full max-w-md ml-72 mt-[30rem]">
        

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            {!name && (
              <div className="absolute inset-0 flex items-center px-6 pointer-events-none text-xl" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: '#1D2C3B' }}>
                Enter your <span className="font-semibold ml-1">Name</span>
              </div>
            )}
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-6 py-5 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="relative">
            {!email && (
              <div className="absolute text-xl inset-0 flex items-center px-6 pointer-events-none" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, color: '#1D2C3B' }}>
                Enter your <span className="font-semibold ml-1">Email</span>
              </div>
            )}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-6 py-5 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold ${
                errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
              style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
            className="w-72 bg-[#1D2C3B] hover:bg-blue-700 text-3xl text-white font-medium py-5 px-4 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>Submit</span>
            
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;