type Variable = {
    id: string,
    label?: string,
    unit?: string
}

enum ClassificationMethod {
    "equal interval",
    "quantiles",
    "jenks"
}

type MapWidgetProperties = {
    title?: string,
    data: string,
    variable: Variable,
    numberOfClasses?: number,
    classificationMethod: ClassificationMethod,
    colorScheme: string
};

export { Variable, ClassificationMethod, MapWidgetProperties };