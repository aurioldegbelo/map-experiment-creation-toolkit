import type { TextInputWidgetProperties } from "./inputs/TextInputWidget";
import type { LikertInputWidgetProperties } from "./inputs/LikertInputWidget";

enum InputWidgetType {
    text = "text",
    likert = "likert"
};

type InputWidgetPropertiesProperties = TextInputWidgetProperties | LikertInputWidgetProperties;

type InputWidgetProperties = {
    question: string,
    type: InputWidgetType
    properties: InputWidgetPropertiesProperties
};

export { InputWidgetType, InputWidgetPropertiesProperties, InputWidgetProperties };