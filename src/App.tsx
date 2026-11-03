import './App.css'

function CloudTypeA({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} fill="currentColor">
      <path d="M 25,60 A 20,20 0 0,1 25,25 A 25,25 0 0,1 65,15 A 22,22 0 0,1 100,28 A 18,18 0 0,1 100,60 Z" />
    </svg>
  )
}

function CloudTypeB({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className} fill="currentColor">
      <path d="M 30,70 A 22,22 0 0,1 25,32 A 26,26 0 0,1 68,18 A 32,32 0 0,1 115,22 A 24,24 0 0,1 145,45 A 20,20 0 0,1 135,70 Z" />
    </svg>
  )
}

function CloudTypeC({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 55" className={className} fill="currentColor">
      <path d="M 20,50 A 16,16 0 0,1 22,24 A 20,20 0 0,1 56,16 A 18,18 0 0,1 84,30 A 15,15 0 0,1 80,50 Z" />
    </svg>
  )
}

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 flex items-center justify-center select-none">
      {/* Sun glow */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-yellow-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-14 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-white via-amber-100 to-amber-200 shadow-[0_0_80px_rgba(253,224,71,0.7)] pointer-events-none" />

      {/* Floating Animated Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 1: High & Slow */}
        <div
          className="absolute top-[8%] left-0 cloud-drift-4 text-white/75"
          style={{ animationDelay: '-12s' }}
        >
          <CloudTypeB className="w-56 h-auto drop-shadow-md" />
        </div>

        {/* Layer 2: Medium */}
        <div
          className="absolute top-[22%] left-0 cloud-drift-2 text-white/90"
          style={{ animationDelay: '-25s' }}
        >
          <CloudTypeA className="w-72 h-auto drop-shadow-lg" />
        </div>

        {/* Layer 3: Small puff */}
        <div
          className="absolute top-[35%] left-0 cloud-drift-5 text-white/70"
          style={{ animationDelay: '-50s' }}
        >
          <CloudTypeC className="w-44 h-auto drop-shadow-md" />
        </div>

        {/* Layer 4: Lower drifting cloud */}
        <div
          className="absolute top-[58%] left-0 cloud-drift-3 text-white/85"
          style={{ animationDelay: '-8s' }}
        >
          <CloudTypeB className="w-80 h-auto drop-shadow-md" />
        </div>

        {/* Layer 5: Fast foreground cloud */}
        <div
          className="absolute top-[72%] left-0 cloud-drift-1 text-white/95"
          style={{ animationDelay: '-18s' }}
        >
          <CloudTypeA className="w-96 h-auto drop-shadow-xl" />
        </div>
      </div>

      {/* Bottom Cloud Bed */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none flex items-end">
        <div className="absolute -bottom-10 -left-10 w-96 h-48 bg-white/70 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 left-1/3 w-[32rem] h-52 bg-white/80 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-[28rem] h-48 bg-white/70 rounded-full blur-2xl" />
        <div className="w-full h-24 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
      </div>

      {/* Main Text Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-white drop-shadow-[0_10px_30px_rgba(2,132,199,0.45)] animate-bob">
          hello kevin
        </h1>
      </div>
    </div>
  )
}
