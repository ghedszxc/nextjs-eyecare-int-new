"use client";
import AppConfig from "@/lib/AppConfig";
import { TPadding } from "@/models/IPadding";
import { CardCollection, CardCollectionProps } from "@digital-b2c/coreui-kit";
import { memo } from "react";

interface Props extends CardCollectionProps {
  padding?: TPadding;
}

const CardCollectionWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <CardCollection
      className={padding && getWidgetPadding(padding)}
      {...rest}
    />
  );
});

CardCollectionWidget.displayName = "CardCollectionWidget";

export default CardCollectionWidget;
