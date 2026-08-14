"use client";

import { memo } from "react";
import { EventList, EventListProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";
import { localeSegmentRemoval, removeDefaultLocale } from "@/lib/utilities";

interface Props extends EventListProps {
  padding?: TPadding;
  emptyText?: string;
}

const EventListWidget: React.FC<Props> = memo((props) => {
  const { padding, emptyText, cta, ...rest } = props;
  const { getWidgetPadding } = AppConfig;

  return (
    <EventList
      className={padding && getWidgetPadding(padding)}
      {...rest}
      cta={{ ...cta, url: removeDefaultLocale(localeSegmentRemoval(cta?.url)) }}
    >
      {emptyText ? (
        <EventList.Empty>
          <p>{emptyText}</p>
        </EventList.Empty>
      ) : null}
    </EventList>
  );
});

EventListWidget.displayName = "EventListWidget";

export default EventListWidget;
