"use client";

import { signIn } from "next-auth/react";
import { Coffee, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl shadow-black/5 border border-stone-100 flex flex-col items-center">
        <div className="bg-amber-400 p-3 sm:p-4 rounded-2xl sm:rounded-3xl mb-5 sm:mb-6 shadow-lg shadow-amber-200">
          <Coffee size={30} className="text-black sm:hidden" />
          <Coffee size={36} className="text-black hidden sm:block" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-2">
          Coffee Tracker
        </h1>
        <p className="text-stone-500 mb-6 sm:mb-8 text-sm text-center leading-relaxed">
          เข้าสู่ระบบเพื่อเริ่มบันทึกยอดขายของคุณ<br/>
          <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mt-2 block">
            Admin Login: admin / admin1234
          </span>
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-stone-50 border border-stone-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-500 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-stone-50 border border-stone-100 rounded-xl sm:rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded-xl font-medium animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-black/10 hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        <p className="mt-7 sm:mt-10 text-[10px] text-stone-400 font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          Simple • Fast • Reliable
        </p>
      </div>
    </main>
  );
}
