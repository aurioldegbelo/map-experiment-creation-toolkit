type TextInputWidgetType = "text" | "number";

type TextInputWidget = {
    singleLine: boolean,
    minLength?: number,
    maxLength?: number,
    type?: TextInputWidgetType
};

export { TextInputWidget };