import React from 'react'
import {
  FileText,
  Boxes,
  Truck,
  BookOpen,
  Building2,
  AlertCircle,
  Users
} from 'lucide-react'

interface HeaderProps {
  activeStep: 1 | 2 | 3 | 4 | 5
  setActiveStep: (step: 1 | 2 | 3 | 4 | 5) => void
  contractCount: number
  shortageCount: number
  pendingOrderCount: number
  partnerCount: number
}

export const Header: React.FC<HeaderProps> = ({
  activeStep,
  setActiveStep,
  contractCount,
  shortageCount,
  pendingOrderCount,
  partnerCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  한국타피(주) SCM
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700">
                  발주자동화 시스템
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                계약 접수 ➔ 재고 파악 ➔ 거래처 발주 ➔ 매출/매입 거래처 관리
              </p>
            </div>
          </div>

          {/* Stepper Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Step 1 */}
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeStep === 1
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">1. 계약서 접수</span>
              <span className="md:hidden">1. 계약</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeStep === 1
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {contractCount}
              </span>
            </button>

            {/* Step 2 */}
            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeStep === 2
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span className="hidden md:inline">2. 현재고 파악</span>
              <span className="md:hidden">2. 재고</span>
              {shortageCount > 0 ? (
                <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  {shortageCount}
                </span>
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                  충분
                </span>
              )}
            </button>

            {/* Step 3 */}
            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeStep === 3
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span className="hidden md:inline">3. 거래처 발주</span>
              <span className="md:hidden">3. 발주</span>
              {pendingOrderCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    activeStep === 3
                      ? 'bg-blue-700 text-white'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {pendingOrderCount}
                </span>
              )}
            </button>

            {/* Step 4: 거래처 관리 */}
            <button
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeStep === 4
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">4. 거래처 관리</span>
              <span className="md:hidden">4. 거래처</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeStep === 4
                    ? 'bg-indigo-700 text-white'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {partnerCount}
              </span>
            </button>

            {/* Step 5: BOM Reference */}
            <button
              onClick={() => setActiveStep(5)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeStep === 5
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="4대 모델 규격서 3.1항 부자재 명세서 확인"
            >
              <BookOpen className="w-4 h-4" />
              <span>BOM 명세</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
