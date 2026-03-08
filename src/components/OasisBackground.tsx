const oasisNodes = [
  { label: "Meta-KI", x: 50, y: 8, size: "lg" },
  { label: "Glas 1", x: 15, y: 25, size: "sm" },
  { label: "Glas 2", x: 30, y: 22, size: "sm" },
  { label: "Glas 3", x: 45, y: 20, size: "sm" },
  { label: "Glas 4", x: 60, y: 22, size: "sm" },
  { label: "Glas 5", x: 75, y: 25, size: "sm" },
  { label: "Glas 6", x: 85, y: 30, size: "sm" },
  { label: "Glas 7", x: 15, y: 42, size: "sm" },
  { label: "Glas 8", x: 30, y: 40, size: "sm" },
  { label: "Glas 9", x: 60, y: 40, size: "sm" },
  { label: "Glas 10", x: 75, y: 42, size: "sm" },
  { label: "Glas 11", x: 85, y: 48, size: "sm" },
  { label: "Glas 12", x: 45, y: 38, size: "sm" },
  { label: "Haupt-Bot", x: 20, y: 55, size: "xs" },
  { label: "Gehirn-Bot", x: 35, y: 58, size: "xs" },
  { label: "Manager", x: 50, y: 55, size: "xs" },
  { label: "Forscher", x: 65, y: 58, size: "xs" },
  { label: "Marketing", x: 80, y: 55, size: "xs" },
  { label: "NPC-KI", x: 25, y: 70, size: "xs" },
  { label: "Coins", x: 45, y: 72, size: "xs" },
  { label: "Sandbox", x: 65, y: 70, size: "xs" },
  { label: "Spieler", x: 50, y: 88, size: "md" },
];

const connections = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12],
  [1, 13], [2, 14], [3, 15], [4, 16], [5, 17],
  [7, 18], [12, 19], [9, 20],
  [13, 21], [15, 21], [17, 21], [18, 21], [19, 21], [20, 21],
];

const OasisBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Connection lines */}
        {connections.map(([from, to], i) => (
          <line
            key={`line-${i}`}
            x1={oasisNodes[from].x}
            y1={oasisNodes[from].y}
            x2={oasisNodes[to].x}
            y2={oasisNodes[to].y}
            stroke="hsl(var(--primary))"
            strokeWidth="0.15"
            opacity="0.6"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur={`${3 + (i % 4)}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Nodes */}
        {oasisNodes.map((node, i) => {
          const r = node.size === "lg" ? 2.5 : node.size === "md" ? 2 : node.size === "sm" ? 1.5 : 1;
          return (
            <g key={`node-${i}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.2"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  values={`${r};${r + 0.3};${r}`}
                  dur={`${4 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={node.x}
                cy={node.y}
                r={r * 0.4}
                fill="hsl(var(--primary))"
                opacity="0.3"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur={`${3 + (i % 5)}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x={node.x}
                y={node.y + r + 1.5}
                textAnchor="middle"
                fill="hsl(var(--primary))"
                fontSize={node.size === "lg" || node.size === "md" ? "1.8" : "1.2"}
                opacity="0.7"
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default OasisBackground;
