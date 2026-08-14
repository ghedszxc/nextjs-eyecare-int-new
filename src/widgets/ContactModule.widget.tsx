"use client"
import { memo } from "react";
import { ContactModule, ContactModuleProps } from "@digital-b2c/coreui-kit";
import { TPadding } from "@/models/IPadding";
import AppConfig from "@/lib/AppConfig";

interface Props extends ContactModuleProps {
  padding?: TPadding;
}

const ContactModuleWidget: React.FC<Props> = memo((props) => {
  const { padding, ...rest } = props;
  const { getWidgetPadding } = AppConfig;
  
  return (
    <ContactModule className={padding && getWidgetPadding(padding)} {...rest} />
  );
});

ContactModuleWidget.displayName = "ContactModuleWidget";

export default ContactModuleWidget;