import React from 'react';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Benvenuto</h1>
            <p className="text-slate-500 text-lg">Accedi al gestionale StanzaSemplice.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  placeholder="nome@stanzasemplice.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-orange-600 hover:text-orange-500">Password dimenticata?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-200 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all active:scale-[0.98] mt-8"
            >
              <LogIn size={18} />
              Accedi al Gestionale
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} StanzaSemplice Manager. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Logo & Visual */}
      <div className="hidden lg:flex w-1/2 bg-orange-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600"></div>
        
        {/* Decorative Circles - Adjusted for Orange Background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
        
        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 p-12 animate-in fade-in zoom-in duration-1000 flex flex-col items-center">
          <img 
            src="https://www.stanzasemplice.com/media/img/logo.png" 
            alt="StanzaSemplice Logo" 
            className="max-w-md w-full object-contain drop-shadow-xl filter brightness-0 invert" 
          />
          {/* Note: Added brightness-0 invert to force logo to white if it's black/colored, ensuring visibility on orange. Remove if logo is already white. */}
          
          <div className="mt-12 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-sm font-medium text-white">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                System Operational
             </div>
             <p className="text-orange-50 text-sm mt-4 font-medium max-w-xs mx-auto leading-relaxed">
               La soluzione completa per la gestione dei tuoi immobili e dei tuoi inquilini.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};