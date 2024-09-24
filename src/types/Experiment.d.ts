import type { Author } from "./Author";
import type { Task } from "./Task";

type Experiment = {
    title: string,
    description?: string,
    authors: Author[],
    measureTaskCompletionTime?: boolean,
    enableRestart?: boolean,
    tasks: Task[]
};

export { Experiment };