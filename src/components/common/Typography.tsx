import { cva, type VariantProps } from "class-variance-authority";
import { memo } from "react";
import { Text, type TextProps } from "react-native";

import { cn } from "@/utils/classname";

const typographyVariants = cva("text-text-primary", {
  variants: {
    variant: {
      h1: "font-bold text-4xl leading-tight",
      h2: "font-bold text-3xl leading-tight",
      h3: "font-semibold text-2xl leading-tight",
      h4: "font-semibold text-xl leading-snug",
      h5: "font-medium text-lg leading-snug",
      h6: "font-medium text-base leading-normal",
      title: "font-bold text-2xl leading-tight",
      subtitle: "font-medium text-lg leading-normal",
      body: "font-normal text-base leading-relaxed",
      bodyLarge: "font-normal text-lg leading-relaxed",
      bodySmall: "font-normal text-sm leading-normal",
      caption: "font-normal text-xs leading-normal",
      overline: "font-medium text-xs uppercase leading-normal tracking-wide",
      label: "font-medium text-sm leading-normal",
      button: "font-semibold text-base leading-none",
    },
    color: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
      tertiary: "text-text-tertiary",
      inverse: "text-text-inverse",
      success: "text-semantic-success",
      warning: "text-semantic-warning",
      error: "text-semantic-error",
      info: "text-interactive-primary",
      disabled: "text-text-disabled",
      link: "text-interactive-primary",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      thin: "font-thin",
      extralight: "font-extralight",
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    transform: {
      none: "normal-case",
      uppercase: "uppercase",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    decoration: {
      none: "no-underline",
      underline: "underline",
      lineThrough: "line-through",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
    align: "left",
  },
});

export interface TypographyProps extends Omit<TextProps, "style">, VariantProps<typeof typographyVariants> {
  className?: string;
  children: React.ReactNode;
}

const Typography = memo<TypographyProps>(
  ({ variant, color, align, weight, transform, decoration, className, children, ...props }) => {
    return (
      <Text
        className={cn(
          typographyVariants({
            variant,
            color,
            align,
            weight,
            transform,
            decoration,
          }),
          className,
        )}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

// Convenience components for common text types
const H1 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h1" {...props}>
    {children}
  </Typography>
));

const H2 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h2" {...props}>
    {children}
  </Typography>
));

const H3 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h3" {...props}>
    {children}
  </Typography>
));

const H4 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h4" {...props}>
    {children}
  </Typography>
));

const H5 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h5" {...props}>
    {children}
  </Typography>
));

const H6 = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="h6" {...props}>
    {children}
  </Typography>
));

const Title = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="title" {...props}>
    {children}
  </Typography>
));

const Subtitle = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="subtitle" {...props}>
    {children}
  </Typography>
));

const Body = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="body" {...props}>
    {children}
  </Typography>
));

const BodyLarge = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="bodyLarge" {...props}>
    {children}
  </Typography>
));

const BodySmall = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="bodySmall" {...props}>
    {children}
  </Typography>
));

const Caption = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="caption" {...props}>
    {children}
  </Typography>
));

const Overline = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="overline" {...props}>
    {children}
  </Typography>
));

const Label = memo<Omit<TypographyProps, "variant">>(({ children, ...props }) => (
  <Typography variant="label" {...props}>
    {children}
  </Typography>
));

// Display names for debugging
Typography.displayName = "Typography";
H1.displayName = "H1";
H2.displayName = "H2";
H3.displayName = "H3";
H4.displayName = "H4";
H5.displayName = "H5";
H6.displayName = "H6";
Title.displayName = "Title";
Subtitle.displayName = "Subtitle";
Body.displayName = "Body";
BodyLarge.displayName = "BodyLarge";
BodySmall.displayName = "BodySmall";
Caption.displayName = "Caption";
Overline.displayName = "Overline";
Label.displayName = "Label";

export { Typography, H1, H2, H3, H4, H5, H6, Title, Subtitle, Body, BodyLarge, BodySmall, Caption, Overline, Label };
