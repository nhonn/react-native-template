import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const classNameCache = new Map<string, string>();

const MAX_CACHE_SIZE = 1000;

export interface ClassNameOptions {
  readonly enableCache?: boolean;
  readonly cacheSize?: number;
}

const defaultOptions: Required<ClassNameOptions> = {
  enableCache: true,
  cacheSize: MAX_CACHE_SIZE,
} as const;

let options = defaultOptions;

export function cn(...inputs: ClassValue[]): string {
  if (!options.enableCache) {
    return twMerge(clsx(inputs));
  }
  const cacheKey = JSON.stringify(inputs);
  if (classNameCache.has(cacheKey)) {
    return classNameCache.get(cacheKey) || "";
  }
  const result = twMerge(clsx(inputs));
  if (classNameCache.size >= options.cacheSize) {
    const firstKey = classNameCache.keys().next().value;
    if (firstKey !== undefined) {
      classNameCache.delete(firstKey);
    }
  }
  classNameCache.set(cacheKey, result);
  return result;
}

export function configureClassName(newOptions: Partial<ClassNameOptions>): void {
  options = { ...defaultOptions, ...newOptions };
  if (!newOptions.enableCache) {
    clearClassNameCache();
  }
}

export function clearClassNameCache(): void {
  classNameCache.clear();
}

export function getClassNameCacheStats(): {
  readonly size: number;
  readonly maxSize: number;
  readonly hitRate: number;
} {
  const hitRate = classNameCache.size > 0 ? (classNameCache.size / options.cacheSize) * 100 : 0;
  return {
    size: classNameCache.size,
    maxSize: options.cacheSize,
    hitRate: Math.round(hitRate * 100) / 100,
  };
}

export function staticCn(...inputs: ClassValue[]): string {
  return cn(...inputs);
}

export interface ClassNameBuilder {
  readonly base: string;
  readonly variants: Record<string, string>;
  readonly sizes: Record<string, string>;
  readonly colors: Record<string, string>;
}
export function createClassNameBuilder(builder: ClassNameBuilder) {
  return {
    build: (variant?: string, size?: string, color?: string, additional?: ClassValue[]) => {
      const classes = [
        builder.base,
        variant && builder.variants[variant],
        size && builder.sizes[size],
        color && builder.colors[color],
        ...(additional || []),
      ].filter(Boolean);
      return cn(...classes);
    },
  };
}

export function validateClassNames(...inputs: ClassValue[]): {
  readonly isValid: boolean;
  readonly warnings: string[];
} {
  const warnings: string[] = [];
  for (const input of inputs) {
    if (typeof input === "string" && input.includes("  ")) {
      warnings.push("Multiple consecutive spaces detected in className");
    }
    if (typeof input === "string" && input.trim() !== input) {
      warnings.push("Leading or trailing spaces detected in className");
    }
    if (input === null || input === undefined) {
      warnings.push("Null or undefined value in className inputs");
    }
  }
  return {
    isValid: warnings.length === 0,
    warnings,
  };
}
