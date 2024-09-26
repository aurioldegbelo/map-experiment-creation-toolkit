import type { TextWidgetProperties } from "./widgets/TextWidget";
import type { InputWidgetProperties } from "./widgets/InputWidget";
import type { MapWidgetProperties } from "./widgets/MapWidget";
import type { ConsentWidgetProperties } from "./widgets/ConsentWidget";

type BaseWidgetType = "TEXT" | "INPUT" | "MAP" | "CONSENT";

interface BaseWidget {
    type: BaseWidgetType;
}

type ConsentWidget = BaseWidget & {
    type: "CONSENT"
};

type WidgetType = "TEXT" | "INPUT" | "MAP";

type WidgetProperties = TextWidgetProperties | InputWidgetProperties | MapWidgetProperties | ConsentWidgetProperties;

type PropertyWidget = BaseWidget & {
    type: WidgetType
    properties: WidgetProperties
};

type Widget = ConsentWidget | PropertyWidget;

export { PropertyWidget, Widget };