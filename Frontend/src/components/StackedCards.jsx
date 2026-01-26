import React, { useState, useRef, useEffect, useContext } from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { AccountContext } from "../context/AccountContext"


const StackedCards = () => {
    const [active, setActive] = useState(0);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);

    const { accounts } = useContext(AccountContext);
    console.log(accounts);

    const containerHeight = 280;
    const cardHeight = 180;
    const cardSpacing = -60;
    const centerOffset = (containerHeight - cardHeight) / 2;

    // Handle wheel scroll
    const handleWheel = (e) => {
        e.preventDefault();

        // Throttle scroll - only change every 100ms
        const now = Date.now();
        if (window.lastScrollTime && now - window.lastScrollTime < 150) {
            return;
        }
        window.lastScrollTime = now;

        const delta = Math.sign(e.deltaY);
        const newActive = Math.max(0, Math.min(accounts.length - 1, active + delta));
        setActive(newActive);
    };

    // Handle touch/mouse drag
    const handleStart = (clientY) => {
        setIsDragging(true);
        setStartY(clientY);
        setScrollOffset(0);
    };

    const handleMove = (clientY) => {
        if (!isDragging) return;
        const diff = startY - clientY;
        setScrollOffset(diff);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        // Snap to nearest card based on scroll offset
        const cardsTraveled = Math.round(scrollOffset / (cardHeight + cardSpacing));
        const newActive = Math.max(0, Math.min(accounts.length - 1, active + cardsTraveled));
        setActive(newActive);
        setScrollOffset(0);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [active]);

    const getCardPosition = (index) => {
        const relativeIndex = index - active;
        const baseOffset = relativeIndex * (cardHeight + cardSpacing);
        return centerOffset + baseOffset - scrollOffset;
    };

    const getCardScale = (index) => {
        const relativeIndex = Math.abs(index - active);
        if (relativeIndex === 0) return 1;
        return Math.max(0.85, 1 - relativeIndex * 0.05);
    };

    const getCardOpacity = (index) => {
        const relativeIndex = Math.abs(index - active);
        if (relativeIndex === 0) return 1;
        return Math.max(0.3, 1 - relativeIndex * 0.15);
    };

    const getCardBlur = (index) => {
        const relativeIndex = Math.abs(index - active);
        if (relativeIndex === 0) return 0;
        return Math.min(relativeIndex * 2, 6);
    };

    return (
        <div className=" ">
            <div
                ref={containerRef}
                className="relative w-full max-w-md mx-auto overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl"
                style={{ height: containerHeight }}
                onMouseDown={(e) => handleStart(e.clientY)}
                onMouseMove={(e) => handleMove(e.clientY)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientY)}
                onTouchMove={(e) => handleMove(e.touches[0].clientY)}
                onTouchEnd={handleEnd}
            >


                {accounts.map((item, i) => {
                    const position = getCardPosition(i);
                    const scale = getCardScale(i);
                    const opacity = getCardOpacity(i);
                    const blur = getCardBlur(i);
                    const isActive = active === i;

                    // Only render cards that are visible in viewport
                    if (position < -cardHeight || position > containerHeight) {
                        return null;
                    }

                    return (
                        <div
                            key={i}
                            onClick={() => setActive(i)}
                            className="absolute left-0 right-0 w-full cursor-pointer select-none"
                            style={{
                                top: 0,
                                zIndex: isActive ? 100 : 50 - Math.abs(i - active),
                                transform: `translateY(${position}px) scale(${scale})`,
                                filter: `blur(${blur}px)`,
                                opacity: opacity,
                                transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                pointerEvents: isDragging ? 'none' : 'auto',
                            }}
                        >
                            <Card
                                className="rounded-2xl backdrop-blur-xl shadow-2xl transition-shadow duration-300 hover:shadow-white/20 border"
                                style={{
                                    borderColor: isActive ? 'rgba(63, 63, 70, 1)' : 'rgba(113, 113, 122, 0.3)',
                                    background: isActive
                                        ? 'linear-gradient(to bottom right, #1f1f1f, #0a0a0a)'
                                        : 'linear-gradient(to bottom right, #1a1a1a, #0f0f0f)',
                                    height: cardHeight,
                                }}
                            >
                                <CardContent className="p-4 h-full flex flex-col justify-center">
                                    <CardTitle className="text-amber-400 text-base font-semibold flex items-center justify-between">
                                        <span>{item.name}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-medium">
                                            {item.type}
                                        </span>
                                    </CardTitle>
                                    <CardDescription className="text-zinc-300 mt-1.5 text-sm font-medium">
                                        Balance: {
                                            new Intl.NumberFormat("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }).format(item.balance || 0)
                                        }
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                {/* Scroll indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-zinc-500 text-xs flex flex-col items-center gap-2 pointer-events-none z-50">
                    <div className="flex gap-1">
                        {accounts.map((_, i) => (
                            <div
                                key={i}
                                className="transition-all duration-300"
                                style={{
                                    width: i === active ? 20 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: i === active ? '#fbbf24' : '#52525b',
                                }}
                            />
                        ))}
                    </div>
                    <span>Scroll or drag to navigate</span>
                </div>
            </div>
        </div>
    );
};

export default StackedCards;