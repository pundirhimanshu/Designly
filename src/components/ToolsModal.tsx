"use client";

import React, { useState, useRef } from "react";
import styles from "./ToolsModal.module.css";
import { BRAND_COLORS } from '@/constants/brandColors';

// Curated list of popular design/dev tools with Simple Icons slugs
const ALL_TOOLS = [
  { name: "Figma", slug: "figma" },
  { name: "Sketch", slug: "sketch" },
  { name: "Adobe XD", slug: "adobexd" },
  { name: "Adobe Photoshop", slug: "adobephotoshop" },
  { name: "Adobe Illustrator", slug: "adobeillustrator" },
  { name: "Adobe After Effects", slug: "adobeaftereffects" },
  { name: "Adobe Premiere Pro", slug: "adobepremierepro" },
  { name: "InVision", slug: "invision" },
  { name: "Miro", slug: "miro" },
  { name: "Notion", slug: "notion" },
  { name: "Framer", slug: "framer" },
  { name: "Canva", slug: "canva" },
  { name: "Blender", slug: "blender" },
  { name: "VS Code", slug: "visualstudiocode" },
  { name: "WebStorm", slug: "webstorm" },
  { name: "GitHub", slug: "github" },
  { name: "GitLab", slug: "gitlab" },
  { name: "Jira", slug: "jira" },
  { name: "Trello", slug: "trello" },
  { name: "Slack", slug: "slack" },
  { name: "Discord", slug: "discord" },
  { name: "Python", slug: "python" },
  { name: "JavaScript", slug: "javascript" },
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Vue.js", slug: "vuedotjs" },
  { name: "Angular", slug: "angular" },
  { name: "Svelte", slug: "svelte" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "WordPress", slug: "wordpress" },
  { name: "Shopify", slug: "shopify" },
  { name: "Webflow", slug: "webflow" },
  { name: "Docker", slug: "docker" },
  { name: "AWS", slug: "amazonaws" },
  { name: "Firebase", slug: "firebase" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "MySQL", slug: "mysql" },
  { name: "Redis", slug: "redis" },
  { name: "Vercel", slug: "vercel" },
  { name: "Netlify", slug: "netlify" },
  { name: "Linear", slug: "linear" },
  { name: "Zeplin", slug: "zeplin" },
  { name: "Storybook", slug: "storybook" },
  { name: "Postman", slug: "postman" },
  { name: "Swagger", slug: "swagger" },
  { name: "Dribbble", slug: "dribbble" },
  { name: "Behance", slug: "behance" },
  { name: "ChatGPT", slug: "openai" },
  { name: "Copilot", slug: "githubcopilot" },
  { name: "Sass", slug: "sass" },
  { name: "Git", slug: "git" },
  { name: "npm", slug: "npm" },
  { name: "Supabase", slug: "supabase" },
  { name: "Prisma", slug: "prisma" },
  { name: "Stripe", slug: "stripe" },
];

interface ToolsModalProps {
  onClose: () => void;
  onSave: () => void;
  initialTools: { name: string; slug: string }[];
}

const ToolsModal: React.FC<ToolsModalProps> = ({ onClose, onSave, initialTools }) => {
  const [selectedTools, setSelectedTools] = useState<{ name: string; slug: string }[]>(initialTools || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools = ALL_TOOLS.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTools.some((s) => s.slug === tool.slug)
  );

  const addTool = (tool: { name: string; slug: string }) => {
    setSelectedTools([...selectedTools, tool]);
    setSearch("");
    inputRef.current?.focus();
  };

  const removeTool = (slug: string) => {
    setSelectedTools(selectedTools.filter((t) => t.slug !== slug));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: selectedTools }),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert("Failed to save tools. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Add Tools</h2>

        {/* Input area with selected chips */}
        <div className={styles.inputArea} onClick={() => inputRef.current?.focus()}>
          {selectedTools.map((tool) => (
            <div key={tool.slug} className={styles.chip}>
              <img
                src={`https://api.iconify.design/simple-icons:${tool.slug}.svg?color=${encodeURIComponent(BRAND_COLORS[tool.slug] || '#111111')}`}
                alt={tool.name}
              />
              {tool.name}
              <span className={styles.chipRemove} onClick={() => removeTool(tool.slug)}>×</span>
            </div>
          ))}
          <input
            ref={inputRef}
            type="text"
            placeholder={selectedTools.length === 0 ? "Search tools..." : ""}
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tool suggestions */}
        <div className={styles.suggestionsLabel}>
          {search ? "Results" : "Popular Tools"}
        </div>
        <div className={styles.suggestionsGrid}>
          {(search ? filteredTools : filteredTools.slice(0, 20)).map((tool) => (
            <div
              key={tool.slug}
              className={styles.suggestionChip}
              onClick={() => addTool(tool)}
            >
                <img
                  src={`https://api.iconify.design/simple-icons:${tool.slug}.svg?color=${encodeURIComponent(BRAND_COLORS[tool.slug] || '#111111')}`}
                  alt={tool.name}
                  style={{ width: 36, height: 36 }}
                />
              {tool.name}
            </div>
          ))}
        </div>

        <button
          className={styles.primaryBtn}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ToolsModal;
