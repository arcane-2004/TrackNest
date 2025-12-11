import React, { useState, useMemo } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

const StackedCards = () => {
  const [active, setActive] = useState(null);

  const items = [
    { title: "HDFC Bank", subtitle: "Balance: ₹52,300" },
    { title: "SBI Savings", subtitle: "Balance: ₹19,450" },
    { title: "Wallet", subtitle: "Balance: ₹2,140" },
    { title: "Axis Bank", subtitle: "Balance: ₹11,780" },
    { title: "ICICI Credit", subtitle: "Balance: ₹8,920" },
    { title: "Kotak Mahindra", subtitle: "Balance: ₹15,650" },
  ];

  const containerHeight = 320;
  const cardHeight = 140;

  const gap = useMemo(() => {
    const n = items.length;
    const totalGaps = n - 1;
    return (containerHeight - cardHeight) / totalGaps;
  }, [items.length]);

  const hasActive = active !== null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="relative w-full max-w-md mx-auto" style={{ height: containerHeight }}>
        {/* Blur + dim overlay when a card is active */}
        {hasActive && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 5,
              opacity: 1,
            }}
          />
        )}

        {items.map((item, i) => {
          const offset = i * gap;
          const isActive = active === i;

          return (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="absolute left-0 right-0 w-full cursor-pointer"
              style={{
                zIndex: isActive ? 20 : 10 + i,
                transform: `translateY(${isActive ? offset - 20 : offset}px) scale(${isActive ? 1.05 : 0.94})`,
                filter: hasActive && !isActive ? "blur(4px)" : "blur(0px)",
                opacity: hasActive && !isActive ? 0.5 : 1,
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <Card className="rounded-2xl border border-zinc-700/50 bg-gradient-to-br from-zinc-900 to-black backdrop-blur-xl shadow-2xl transition-shadow duration-300 hover:shadow-amber-500/20">
                <CardContent className="p-6">
                  <CardTitle className="text-amber-400 text-xl font-semibold flex items-center justify-between">
                    <span>{item.title}</span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                      Account
                    </span>
                  </CardTitle>
                  <CardDescription className="text-zinc-300 mt-3 text-base font-medium">
                    {item.subtitle}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StackedCards;