import { type FC, memo } from "react";
import { useTranslation } from "react-i18next";
import { Text, type TextStyle } from "react-native";

interface HeadingProps {
  value: string;
  style?: TextStyle;
}

const PageTitle: FC<HeadingProps> = memo(({ value, style }) => {
  const { t } = useTranslation();

  return (
    <Text className="my-2 w-full font-bold text-text-dark text-xl uppercase" style={style}>
      {t(value)}
    </Text>
  );
});

PageTitle.displayName = "PageTitle";

const Section: FC<HeadingProps> = memo(({ value, style }) => {
  const { t } = useTranslation();

  return (
    <Text className="my-2 font-bold text-lg text-text-light uppercase dark:text-text-dark" style={style}>
      {t(value)}
    </Text>
  );
});

Section.displayName = "Section";

export const Heading = {
  PageTitle,
  Section,
};
