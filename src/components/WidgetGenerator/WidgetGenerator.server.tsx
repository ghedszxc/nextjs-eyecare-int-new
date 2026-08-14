import { getSession } from "@/lib/auth";
import { IWidgetModel } from "@/models/IWidget.interface";
import { WidgetParamAdapterFactory } from "@/coremedia-integration/factory/WidgetParamAdapterFactory";

import WidgetGeneratorClient from "./index";

const WidgetGeneratorServer = async (props: IWidgetModel) => {
  const session = await getSession();

  const adapter = new WidgetParamAdapterFactory(session).instance(
    props.widgetName,
  );
  const adaptedValues = adapter
    ? await adapter.adapt(props.widgetValue)
    : props.widgetValue;

  return (
    <WidgetGeneratorClient
      {...props}
      session={session}
      adaptedValues={adaptedValues}
    />
  );
};

export default WidgetGeneratorServer;
