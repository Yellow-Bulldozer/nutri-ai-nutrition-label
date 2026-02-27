"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface TextTypeProps {
    text: string | string[];
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number;
    deletingSpeed?: number;
    loop?: boolean;
    className?: string;
    showCursor?: boolean;
    cursorCharacter?: string;
    cursorClassName?: string;
    textColors?: string[];
    startOnVisible?: boolean;
}

const TextType = ({
    text,
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    className = "",
    showCursor = true,
    cursorCharacter = "|",
    cursorClassName = "",
    textColors = [],
    startOnVisible = false,
}: TextTypeProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const containerRef = useRef<HTMLSpanElement>(null);

    const textArray = useMemo(
        () => (Array.isArray(text) ? text : [text]),
        [text]
    );

    const getCurrentTextColor = useCallback(() => {
        if (textColors.length === 0) return "inherit";
        return textColors[currentTextIndex % textColors.length];
    }, [textColors, currentTextIndex]);

    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let timeout: ReturnType<typeof setTimeout>;
        const currentText = textArray[currentTextIndex];

        const executeTypingAnimation = () => {
            if (isDeleting) {
                if (displayedText === "") {
                    setIsDeleting(false);
                    if (currentTextIndex === textArray.length - 1 && !loop) {
                        return;
                    }
                    setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
                    setCurrentCharIndex(0);
                    timeout = setTimeout(() => { }, pauseDuration);
                } else {
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev.slice(0, -1));
                    }, deletingSpeed);
                }
            } else {
                if (currentCharIndex < currentText.length) {
                    timeout = setTimeout(() => {
                        setDisplayedText((prev) => prev + currentText[currentCharIndex]);
                        setCurrentCharIndex((prev) => prev + 1);
                    }, typingSpeed);
                } else if (textArray.length >= 1) {
                    if (!loop && currentTextIndex === textArray.length - 1) return;
                    timeout = setTimeout(() => {
                        setIsDeleting(true);
                    }, pauseDuration);
                }
            }
        };

        if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
            timeout = setTimeout(executeTypingAnimation, initialDelay);
        } else {
            executeTypingAnimation();
        }

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentCharIndex,
        displayedText,
        isDeleting,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        textArray,
        currentTextIndex,
        loop,
        initialDelay,
        isVisible,
    ]);

    return (
        <span
            ref={containerRef}
            className={`inline-block whitespace-pre-wrap ${className}`}
        >
            <span style={{ color: getCurrentTextColor() || "inherit" }}>
                {displayedText}
            </span>
            {showCursor && (
                <span
                    className={`ml-1 inline-block animate-pulse ${cursorClassName}`}
                    style={{ animationDuration: "1s" }}
                >
                    {cursorCharacter}
                </span>
            )}
        </span>
    );
};

export default TextType;
