import type { Author } from "./Author";
import type { Task } from "./Task";

type Experiment = {
    title: string,
    description?: string,
    authors: Author[],
    tasks: Task[]
};

export { Experiment };