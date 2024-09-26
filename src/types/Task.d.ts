import type { Widget } from "./widgets/Widget";

type Task = {
    title?: string,
    widgets: Widget[]
};

export { Task };