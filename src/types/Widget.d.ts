enum WidgetType {
    "text",
    "input",
    "map"
}

type Widget = {
    type: WidgetType
    properties: Object
}

export default Widget;