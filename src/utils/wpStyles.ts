type WPStyleElement = {
    color?: {
        text?: string;
        background?: string;
    };
};

type WPStyle = {
    typography?: {
        textAlign?: string;
        fontSize?: string;       // np. "2rem" - jeśli podane bezpośrednio, nie jako preset
        fontStyle?: string;
        fontWeight?: string;
        lineHeight?: string;
        letterSpacing?: string;
        textDecoration?: string;
        textTransform?: string;
    };
    color?: {
        text?: string;
        background?: string;
        gradient?: string;
    };
    background?: {
        gradient?: string;
        backgroundImage?: any;
    };
    spacing?: {
        margin?: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
        padding?: {
            top?: string;
            right?: string;
            bottom?: string;
            left?: string;
        };
        blockGap?: string;
    };
    border?: {
        radius?: WPBorderRadius;
        width?: string;
        color?: string;
        style?: string;
    };    
    elements?: {
        link?: WPStyleElement;
    };
};
type WPBorderRadius = string | {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
};

export type WPBlockAttributes = {
    style?: WPStyle;
    fontSize?: string;   // preset, np. "x-large"
    textColor?: string;  // preset, np. "starlight"
    backgroundColor?: string; // preset
    level?: number;
    content?: string;
    className?: string;
    [key: string]: any;
};

/**
 * Zamienia wartość WP w formacie "var:preset|color|slug" 
 * na CSS var(--wp--preset--color--slug)
 */
function resolvePresetVar(value?: string, type: 'color' | 'font-size' | 'spacing' = 'color'): string | undefined {
    if (!value) return undefined;

    if (value.startsWith('var:preset|')) {
        const parts = value.split('|');
        const slug = parts[parts.length - 1];
        return `var(--wp--preset--${type}--${slug})`;
    }

    return value;
}

function buildSpacing(
    spacing: WPStyle['spacing'],
    property: 'margin' | 'padding'
): string {
    const val = spacing?.[property];
    if (!val) return '';

    let css = '';
    (['top', 'right', 'bottom', 'left'] as const).forEach((side) => {
        if (val[side]) {
            const resolved = resolvePresetVar(val[side], 'spacing'); // <-- poprawione
            css += `${property}-${side}:${resolved};`;
        }
    });

    return css;
}

/**
 * Główna funkcja - mapuje attributes bloku WP na inline style string
 */
export function mapWPStylesToCSS(attributes: WPBlockAttributes = {}): string {
    const style = attributes.style || {};
    let css = '';

    // --- TYPOGRAPHY ---
    const typography = style.typography;

    if (typography?.textAlign) {
        css += `text-align:${typography.textAlign};`;
    }

    if (typography?.fontStyle) {
        css += `font-style:${typography.fontStyle};`;
    }

    if (typography?.fontWeight) {
        css += `font-weight:${typography.fontWeight};`;
    }

    if (typography?.lineHeight) {
        css += `line-height:${typography.lineHeight};`;
    }

    if (typography?.letterSpacing) {
        css += `letter-spacing:${typography.letterSpacing};`;
    }

    if (typography?.textDecoration) {
        css += `text-decoration:${typography.textDecoration};`;
    }

    if (typography?.textTransform) {
        css += `text-transform:${typography.textTransform};`;
    }

    if (style.color?.gradient) {
        css += `background:${resolvePresetVar(style.color.gradient, 'color')};`;
    }

    // --- SPACING ---
    if (style.spacing) {
        css += buildSpacing(style.spacing, 'margin');
        css += buildSpacing(style.spacing, 'padding');
    } 

    // --- BORDER ---
    if (style.border) {
        const { radius, width, color } = style.border;

        if (radius) {
            if (typeof radius === 'string') {
                css += `border-radius:${radius};`;
            } else {
                if (radius.topLeft) css += `border-top-left-radius:${radius.topLeft};`;
                if (radius.topRight) css += `border-top-right-radius:${radius.topRight};`;
                if (radius.bottomLeft) css += `border-bottom-left-radius:${radius.bottomLeft};`;
                if (radius.bottomRight) css += `border-bottom-right-radius:${radius.bottomRight};`;
            }
        }

        if (width) css += `border-width:${width};`;
        if (color) css += `border-color:${resolvePresetVar(color, 'color')};`;
        if (style.border.style) css += `border-style:${style.border.style};`;
    }

    // --- BACKGROUND ---
    if (style.background?.gradient) {
        css += `background:${resolvePresetVar(style.background.gradient, 'color')};`;
    }

    return css;
}

/**
 * Buduje string klas CSS na podstawie attributes (np. className z WP)
 */
export function mapWPClassesToCSS(attributes: WPBlockAttributes = {}): string {
    return attributes.className || '';
}