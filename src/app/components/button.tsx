'use client';

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { gsap } from 'gsap';
import { uniqueId } from 'lodash';

export default function Button(
    { id, onClick, className, text }: { id?: string; className?: string; text: string; onClick: () => void }) {
    const TRANS_VELOCITY = 150 // 75px / 0.5s
    const RECOVER_DURATION = 0.2 // seconds

    // State values
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [transitionDuration, setTransitionDuration] = useState(0.5);
    const [isHovering, setHovering] = useState(false);
    const [maxDim, setMaxDim] = useState(0);
    const [bubbleId, setBubbleId] = useState('child_bubble_')

    // Reference objects
    const parentRef: MutableRefObject<HTMLElement | undefined> = useRef(undefined);
    const circleRef: MutableRefObject<HTMLElement | undefined> = useRef(undefined);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (parentRef.current) {
                const parentRect = parentRef.current.getBoundingClientRect();

                // Calculate the position relative to the parent
                const x = e.clientX - parentRect.left;
                const y = e.clientY - parentRect.top;

                // Constrain within parent boundaries
                const constrainedX = Math.min(Math.max(x, 0), parentRect.width);
                const constrainedY = Math.min(Math.max(y, 0), parentRect.height);

                setMousePos({ x: constrainedX, y: constrainedY });
            }
        };

        const handleResize = () => {
            if (!parentRef.current) return;

            // Get the greatest dimension size
            const parentRect = parentRef.current.getBoundingClientRect();
            const maxDim = Math.max(parentRect.width, parentRect.height);
            setMaxDim(maxDim);
            setTransitionDuration(TRANS_VELOCITY / maxDim);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("resize", handleResize);

        // Initial sizing
        handleResize()
        setBubbleId(uniqueId('child_bubble_'))
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("resize", handleResize);
        }
    }, []);

    const handleMouseEnter = () => {
        setHovering(true);
        gsap.killTweensOf(`#${bubbleId}`); // Stop old animations
        gsap.to(`#${bubbleId}`, { id: "circGrow", duration: TRANS_VELOCITY / maxDim, scale: maxDim });
    }

    const handleMouseLeave = () => {
        setHovering(false);
        gsap.killTweensOf(`#${bubbleId}`); // Stop old animations
        gsap.to(`#${bubbleId}`, { duration: RECOVER_DURATION, scale: 0 });
    }

    return (
            <div
                id={id}
                className={`cursor-pointer font-[family-name:var(--font-geist-sans)] relative overflow-hidden rounded-full border-2 border-white py-3 px-6 transition-colors hover:text-black ${className}`}
                ref={parentRef as never}
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    // Updated BEFORE onMouseEnter/Leave, so cases are for what the NEXT duration should be
                    transitionDuration: (isHovering ? RECOVER_DURATION : transitionDuration * 0.5) + 's',
                }}
            >
                <p style={{position: 'relative', zIndex: 2}}>{text}</p>
                <div
                    id={bubbleId}
                    ref={circleRef as never}
                    className={`absolute bg-white rounded-full w-1 h-1 pointer-events-none`}
                    style={{
                        top: mousePos.y,
                        left: mousePos.x,
                        scale: 0,
                        transform: "translate(-50%, -50%)", // Centers the child on the mouse position
                    }}
                ></div>
            </div>
    );
}
