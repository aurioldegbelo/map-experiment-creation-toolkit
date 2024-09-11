type Attribution = {
    url: string,
    label: string
};

type Data = {
    source: string,
    attribution: Attribution
};

type Variable = {
    id: string,
    label?: string,
    unit?: string
};

enum ClassificationMethod {
    equal = "equal interval",
    quantiles = "quantiles",
    jenks = "jenks"
};

type MapWidgetProps = {
    title?: string,
    data: Data,
    variable: Variable,
    numberOfClasses?: number,
    classificationMethod: ClassificationMethod,
    colorScheme: string
};

export { MapWidgetProps };