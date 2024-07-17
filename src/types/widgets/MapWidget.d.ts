enum ClassificationMethod {
    "equal interval",
    "quantiles",
    "jenks"
}

type MapWidgetProperties = {
    title?: string,
    data: string,
    variableName: string,
    numberOfClasses?: number,
    classificationMethod: ClassificationMethod,
    colorScheme: string
};

export { ClassificationMethod, MapWidgetProperties };