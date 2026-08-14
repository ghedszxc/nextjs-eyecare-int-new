import { useEffect, useState } from "react";

export type DeviceType =
    | "mobile-s"
    | "mobile-m"
    | "mobile-l"
    | "mobile-xl"
    | "tablet"
    | "desktop"
    | "desktop-l";

const ORDER: DeviceType[] = [
    "mobile-s",
    "mobile-m",
    "mobile-l",
    "mobile-xl",
    "tablet",
    "desktop",
    "desktop-l"
];

const breakpoints: {
    [key: string]: number;
} = {
    "mobile-s": 320,
    "mobile-m": 375,
    "mobile-l": 425,
    "mobile-xl": 440,
    "tablet": 768,
    "desktop": 1024,
    "desktop-l": 1440
};

interface HookType {
    size: DeviceType | undefined;
    is: (type: DeviceType, condition?: ">" | "<") => boolean;
}

const useResponsive = (): HookType => {
    const [windowSize, setWindowSize] = useState<DeviceType>();
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        setWidth(window.innerWidth);

        const size = () => {
            const wwidth = window.innerWidth;
            if (wwidth <= breakpoints["mobile-s"]) return "mobile-s";
            if (wwidth <= breakpoints["mobile-m"]) return "mobile-m";
            if (wwidth <= breakpoints["mobile-l"]) return "mobile-l";
            if (wwidth <= breakpoints["mobile-xl"]) return "mobile-xl";
            if (wwidth <= breakpoints["tablet"]) return "tablet";
            if (wwidth <= breakpoints["desktop"]) return "desktop";
            if (wwidth <= breakpoints["desktop-l"]) return "desktop-l";

            return "desktop-l";
        };

        const handleResize = () => {
            setWidth(window.innerWidth);
            setWindowSize(size());
        };

        (handleResize)();

        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const is = (type: DeviceType, condition?: ">" | "<"): boolean => {
        if (condition === ">") {
            const previousBreakpoint = ORDER[ORDER.indexOf(type) - 1];
            if (!previousBreakpoint) return true;
            return width > breakpoints[previousBreakpoint];
        }
        if (condition === "<") return width <= breakpoints[type];
        return windowSize === type;
    };

    return {
        size: windowSize,
        is,
    };
};

export default useResponsive;
