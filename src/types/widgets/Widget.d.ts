import type { TextWidgetProperties } from "./TextWidget";
import type { InputWidgetProperties } from "./InputWidget";
import type { MapWidgetProperties } from "./MapWidget";

enum WidgetType {
    text = "text",
    input = "input",
    map = "map"
};

type WidgetProperties = TextWidgetProperties | InputWidgetProperties | MapWidgetProperties;

type Widget = {
    type: WidgetType
    properties: WidgetProperties
};

export { WidgetType, WidgetProperties, Widget};