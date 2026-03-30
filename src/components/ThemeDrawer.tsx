import React from "react";
import styles from "./ThemeDrawer.module.css";
import { X } from "lucide-react";

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundSelect: (bg: string) => void;
  onUpdateEffects: (blur: number, motion: boolean) => void;
  onCursorSelect: (cursor: string) => void;
  currentBackground?: string;
  currentBlur?: number;
  currentMotion?: boolean;
  currentCursor?: string;
}

const ThemeDrawer: React.FC<ThemeDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onBackgroundSelect, 
  onUpdateEffects,
  onCursorSelect,
  currentBackground,
  currentBlur = 0,
  currentMotion = false,
  currentCursor = "default"
}) => {
  const [activeTab, setActiveTab] = React.useState("Background");
  const tabs = ["Background", "Cursors"];

  const backgrounds = [
    { name: "Default", path: "" },
    { name: "Wallpaper 5", path: "/wall5.png" },
    { name: "Wallpaper 6", path: "/wall6.png" },
    { name: "Wallpaper 7", path: "/wall7.png" }
  ];

  const cursors = [
    { name: "Default", id: "default", icon: "🖱️" },
    { name: "Sword", id: "sword", icon: "🗡️", path: "/cursors/sword.svg" },
    { name: "Bomb", id: "bomb", icon: "💣", path: "/cursors/bomb.svg" },
    { name: "Pizza", id: "pizza", icon: "🍕", path: "/cursors/pizza.svg" },
    { name: "Thunder", id: "thunder", icon: "⚡", path: "/cursors/thunder.svg" },
    { name: "Sparkle", id: "sparkle", icon: "✨", path: "/cursors/sparkle.svg" },
    { name: "Rocket", id: "rocket", icon: "🚀", path: "/cursors/rocket.svg" },
    { name: "Brush", id: "brush", icon: "🖌️", path: "/cursors/brush.svg" },
    { name: "Target", id: "target", icon: "🎯", path: "/cursors/target.svg" },
    { name: "Ghost", id: "ghost", icon: "👻", path: "/cursors/ghost.svg" },
    { name: "Heart", id: "heart", icon: "❤️", path: "/cursors/heart.svg" },
    { name: "Flash", id: "flash", icon: "⚡", path: "/cursors/flash.svg" },
    { name: "Planet", id: "planet", icon: "🪐", path: "/cursors/planet.svg" },
    { name: "Coffee", id: "coffee", icon: "☕", path: "/cursors/coffee.svg" },
    { name: "Game", id: "game", icon: "🎮", path: "/cursors/game.svg" },
    
    // Animated Cursors
    { name: "Glow", id: "glow", icon: "✨", isAnimated: true },
    { name: "Fluid", id: "fluid", icon: "💧", isAnimated: true },
    { name: "Cyber", id: "cyber", icon: "🎯", isAnimated: true },
    { name: "Trail", id: "trail", icon: "☄️", isAnimated: true }
  ];

  const handleSelectBackground = async (path: string) => {
    onBackgroundSelect(path);
    localStorage.setItem('portfolioBackground', path || "none");
    try {
      await fetch("/api/background/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background: path }),
      });
    } catch (e) {
      console.error("Failed to save background:", e);
    }
  };

  const handleSelectCursor = async (id: string) => {
    onCursorSelect(id);
    localStorage.setItem('portfolioCursor', id);
    try {
      await fetch("/api/background/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursor: id }),
      });
    } catch (e) {
      console.error("Failed to save cursor:", e);
    }
  };

  const handleBlurChange = async (val: number) => {
    onUpdateEffects(val, currentMotion);
    localStorage.setItem('portfolioBlur', val.toString());
    try {
      await fetch("/api/background/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blur: val }),
      });
    } catch (e) { console.error(e); }
  };

  const handleMotionToggle = async (val: boolean) => {
    onUpdateEffects(currentBlur, val);
    localStorage.setItem('portfolioMotion', val ? "true" : "false");
    try {
      await fetch("/api/background/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motion: val }),
      });
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <div 
        className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayOpen : ""}`} 
        onClick={onClose} 
      />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Theme Settings</h2>
          <div className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </div>
        </div>

        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <div 
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === "Background" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Wallpaper Grid */}
              <div>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px', fontWeight: '500' }}>Select Background</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {backgrounds.map((bg) => (
                    <div 
                      key={bg.name}
                      onClick={() => handleSelectBackground(bg.path)}
                      style={{ 
                        cursor: 'pointer',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: currentBackground === bg.path ? '3px solid #FF5C00' : '2px solid #eee',
                        transition: 'all 0.2s',
                        position: 'relative',
                        height: '80px'
                      }}
                    >
                      {bg.path ? (
                        <img 
                          src={bg.path} 
                          alt={bg.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#999' }}>
                          Default
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Depth / Blur Slider */}
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>Depth</span>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{currentBlur}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={currentBlur}
                  onChange={(e) => handleBlurChange(parseInt(e.target.value))}
                  style={{ 
                    width: '100%', 
                    accentColor: '#FF5C00',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Dynamic Motion Toggle */}
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dynamic Motion</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Parallax zoom interaction</p>
                </div>
                <label className={styles.switch}>
                  <input 
                    type="checkbox" 
                    checked={currentMotion}
                    onChange={(e) => handleMotionToggle(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

            </div>
          )}

          {activeTab === "Cursors" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: '500' }}>Select Custom Cursor</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {cursors.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => handleSelectCursor(c.id)}
                    style={{ 
                      cursor: 'pointer',
                      background: currentCursor === c.id ? '#fff3ed' : '#f9f9f9',
                      padding: '16px 8px',
                      borderRadius: '16px',
                      border: currentCursor === c.id ? '2px solid #FF5C00' : '2px solid transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>
                      {c.path ? (
                        <img src={c.path} alt={c.name} style={{ width: '28px', height: '28px' }} />
                      ) : (
                        c.icon
                      )}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: currentCursor === c.id ? '#FF5C00' : '#64748b' }}>{c.name}</span>
                    {(c as any).isAnimated && (
                      <span style={{ fontSize: '8px', background: '#FF5C00', color: 'white', padding: '2px 6px', borderRadius: '4px', position: 'absolute', top: '8px', right: '8px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', background: '#f1f5f9', padding: '12px', borderRadius: '12px' }}>
                Tip: Refresh the page if the cursor doesn't update immediately. Your selection is synced across devices!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ThemeDrawer;
