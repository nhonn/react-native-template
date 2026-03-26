import { LegendList as BaseLegendList, type LegendListProps, type LegendListRef } from "@legendapp/list/react-native";
import { forwardRef } from "react";

type AppLegendListProps<ItemT> = LegendListProps<ItemT>;

const LegendListComponent = <ItemT,>(
  { maintainVisibleContentPosition = true, recycleItems = true, ...props }: AppLegendListProps<ItemT>,
  ref: React.ForwardedRef<LegendListRef>,
) => {
  return (
    <BaseLegendList
      {...props}
      maintainVisibleContentPosition={maintainVisibleContentPosition}
      recycleItems={recycleItems}
      ref={ref}
    />
  );
};

export const LegendList = forwardRef(LegendListComponent) as <ItemT>(
  props: AppLegendListProps<ItemT> & { ref?: React.ForwardedRef<LegendListRef> },
) => React.ReactElement;

export type { AppLegendListProps, LegendListRef };
