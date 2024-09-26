import type { TextInputWidgetProperties } from "./inputs/TextInputWidget";
import type { LikertInputWidgetProperties } from "./inputs/LikertInputWidget";

type InputWidgetType = "TEXT" | "LIKERT";

type InputWidgetProperties = TextInputWidgetProperties | LikertInputWidgetProperties;

type InputWidget = {
    type: InputWidgetType,
    question: string,
    properties: InputWidgetProperties
};

export { InputWidget };