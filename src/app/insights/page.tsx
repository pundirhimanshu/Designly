"use client";

import React from "react";
import styles from "./Insights.module.css";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const InsightsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<{ date: string; count: number }[]>([]);
  const [totalViews, setTotalViews] = React.useState(0);
  const [domain, setDomain] = React.useState("");
  const [background, setBackground] = React.useState<string | null>(null);
  const [blur, setBlur] = React.useState(0);
  const [range, setRange] = React.useState("week");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, domainRes, themeRes] = await Promise.all([
          fetch(`/api/insights/get?range=${range}`),
          fetch("/api/domain/get"),
          fetch("/api/background/get")
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats || []);
          setTotalViews(data.totalViews || 0);
        }

        if (domainRes.ok) {
          const data = await domainRes.json();
          setDomain(data.domain || "");
        }

        if (statsRes.ok) {
          const theme = await themeRes.json();
          setBackground(theme.background === "none" ? null : theme.background);
          setBlur(theme.blur || 0);
        }
      } catch (e) {
        console.error("Failed to fetch insights data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#fff9f0' }}>
        <h1 style={{ color: '#FF5C00', fontFamily: 'Inter, sans-serif' }}>Loading Insights...</h1>
      </div>
    );
  }

  // Chart Logic
  const maxCount = Math.max(...stats.map(s => s.count), 1);
  const chartWidth = 900;
  const chartHeight = 250;
  const padding = 40;

  const points = stats.map((s, i) => {
    // Handle division by zero if only 1 point
    const xDist = stats.length > 1 ? (stats.length - 1) : 1;
    const x = (i / xDist) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - (s.count / maxCount) * (chartHeight - padding) - padding;
    return { x, y, count: s.count, date: s.date };
  });

  const hasData = points.length > 0;
  const linePath = hasData ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') : '';
  const areaPath = hasData ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z` : '';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (range === "month") {
      // For month view, only show date every few days to avoid clutter
      return d.getDate() === 1 || d.getDate() % 5 === 0 ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "";
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={styles.wrapper}>
      {/* Background Sync */}
      {background && (
        <div 
          className={styles.backgroundLayer}
          style={{ 
            backgroundImage: `url(${background})`,
            filter: `blur(${blur}px)`,
          }}
        />
      )}

      <div className={styles.container}>
        <header className={styles.header} onClick={() => isFilterOpen && setIsFilterOpen(false)}>
          <button className={styles.backBtn} onClick={() => router.push('/')}>
            <ChevronLeft size={16} />
            Back to Builder
          </button>
          
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>Insights</h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>
                  {session?.user?.name || "My Portfolio"}
                </span>
                {domain && (
                  <a 
                    href={`https://${domain}.designly.co.in`} 
                    target="_blank" 
                    className={styles.domainLink}
                    style={{ fontSize: '14px' }}
                  >
                    {domain}.designly.co.in
                  </a>
                )}
              </div>
            </div>
            
            <div className={styles.filterContainer}>
              <button 
                className={styles.filterBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterOpen(!isFilterOpen);
                }}
              >
                {range === "week" ? "Week" : "Month"} <ChevronDown size={16} />
              </button>

              {isFilterOpen && (
                <div className={styles.dropdown}>
                  <button 
                    className={`${styles.dropdownItem} ${range === 'week' ? styles.dropdownItemActive : ''}`}
                    onClick={() => {
                      setRange("week");
                      setIsFilterOpen(false);
                    }}
                  >
                    Week
                  </button>
                  <button 
                    className={`${styles.dropdownItem} ${range === 'month' ? styles.dropdownItemActive : ''}`}
                    onClick={() => {
                      setRange("month");
                      setIsFilterOpen(false);
                    }}
                  >
                    Month
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={styles.statsCard}>
          <h2 className={styles.statsValue}>{totalViews}</h2>
          <p className={styles.statsLabel}>Unique Visitors</p>
        </section>

        <section className={styles.chartContainer}>
           <div className={styles.chartHeader}>
             <div className={styles.chartLabel}>
                <div className={styles.blueDot} />
                Unique visitors
             </div>
           </div>

           <div className={styles.svgWrapper}>
              {!hasData ? (
                <div style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#888',
                  fontSize: '16px',
                  fontWeight: 500,
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📈</div>
                  No visitor data available for this week yet.
                </div>
              ) : (
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                    <line 
                      key={i}
                      x1={padding} 
                      y1={chartHeight - padding - (v * (chartHeight - padding))} 
                      x2={chartWidth - padding} 
                      y2={chartHeight - padding - (v * (chartHeight - padding))} 
                      className={styles.gridLine}
                    />
                  ))}

                  {/* Y Axis labels (0 and max) */}
                  <text x={padding - 10} y={chartHeight - padding + 5} textAnchor="end" className={styles.axisText}>0</text>
                  <text x={padding - 10} y={padding + 5} textAnchor="end" className={styles.axisText}>{maxCount}</text>

                  {/* Paths */}
                  <path d={areaPath} className={styles.chartArea} />
                  <path d={linePath} className={styles.chartLine} />

                  {/* Points & Labels */}
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="5" className={styles.dot} />
                      <text 
                        x={p.x} 
                        y={chartHeight - 10} 
                        textAnchor="middle" 
                        className={styles.axisText}
                      >
                        {formatDate(p.date)}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
           </div>
        </section>
      </div>
    </div>
  );
};

export default InsightsPage;
