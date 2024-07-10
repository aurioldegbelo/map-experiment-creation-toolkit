import type { TextInputWidgetProperties } from "./inputs/TextInputWidget";
import type { LikertInputWidgetProperties } from "./inputs/LikertInputWidget";

enum InputWidgetType {
    text = "text",
    likert = "likert"
};

type InputWidgetProperties = {
    question: string,
    type: InputWidgetType
    properties: TextInputWidgetProperties | LikertInputWidgetProperties
};

export { InputWidgetProperties };