const trending = [
  { tag: "Pytter", tweets: "12.4K", category: "Technology" },
  { tag: "OpenSource", tweets: "8.1K", category: "Software" },
  { tag: "NextJS", tweets: "5.7K", category: "Development" },
  { tag: "TypeScript", tweets: "4.2K", category: "Programming" },
  { tag: "TailwindCSS", tweets: "3.9K", category: "Design" },
];

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TrendUpIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export default function RightSidebar() {
  return (
    <div className="w-[320px] xl:w-[340px] shrink-0 py-3 px-4 hidden lg:block sticky top-0 h-screen overflow-y-auto">
      {/* Search bar */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          <SearchIcon size={15} />
        </span>
        <input
          type="text"
          placeholder="Search Pytter"
          className="w-full bg-surface border border-border rounded-full pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/40 focus:bg-surface-raised transition-all duration-200"
        />
      </div>

      {/* Trending section */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-bold text-text-primary text-base">Trending</h2>
        </div>
        {trending.map((item, i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] text-text-muted font-medium mb-0.5">{item.category} · Trending</p>
                <p className="font-bold text-text-primary text-sm group-hover:text-accent transition-colors">
                  #{item.tag}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1">
                  <span className="text-emerald-500"><TrendUpIcon /></span>
                  {item.tweets} posts
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-surface-raised flex items-center justify-center text-text-muted group-hover:bg-accent/10 group-hover:text-accent transition-all duration-200 shrink-0">
                <TrendUpIcon size={11} />
              </div>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-border">
          <button className="text-accent hover:text-accent-bright text-sm font-medium transition-colors">
            Show more
          </button>
        </div>
      </div>

      {/* Footer links */}
      <div className="px-1">
        <p className="text-[11px] text-text-muted leading-relaxed">
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          {" · "}
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          {" · "}
          <span className="hover:underline cursor-pointer">Cookie Policy</span>
        </p>
        <p className="text-[11px] text-text-muted mt-1.5">© 2025 Pytter</p>
      </div>
    </div>
  );
}
