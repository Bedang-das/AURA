import Link from "next/link";
import { User, BookOpen, PenTool, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tighter text-blue-700">AURA</span>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-blue-600 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <LayoutDashboard className="w-4 h-4 mr-2 text-slate-500" />
                Roadmap
              </Link>
              <Link href="#" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Learn
              </Link>
              <Link href="/day/14" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <PenTool className="w-4 h-4 mr-2" />
                Exam
              </Link>
              <Link href="/interview/capstone" className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
              <span className="text-blue-700 text-xs font-bold">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
