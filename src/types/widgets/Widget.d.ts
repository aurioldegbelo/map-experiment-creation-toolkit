import type { TextWidgetProperties } from "./TextWidget";
import type { InputWidgetProperties } from "./InputWidget";
import type { MapWidgetProperties } from "./MapWidget";
import type { ConsentWidgetProperties } from "./ConsentWidget";

enum WidgetType {
    text = "text",
    input = "input",
    map = "map",
    consent = "consent"
};

type WidgetProperties = TextWidgetProperties | InputWidgetProperties | MapWidgetProperties | ConsentWidgetProperties;

type Widget = {
    type: WidgetType
    properties: WidgetProperties
};

export { WidgetType, WidgetProperties, Widget};