type Attribution = {
    url: string,
    label: string
};

type Data = {
    source: string,
    variable: Variable,
    attribution?: Attribution
};

type Variable = {
    id: string,
    label?: string,
    unit?: string
};

type ClassificationMethod = "EQUAL_INTERVAL" | "JENKS" | "QUANTILES" | "QUALITATIVE";

type MapWidget = {
    title?: string,
    data: Data,
    classificationMethod: ClassificationMethod,
    colorScheme: string,
    classLabels: string[]
};

export { MapWidget };