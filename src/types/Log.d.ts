type Answer = {
    task?: number,
    question: string,
    input: string
}

type TaskCompletionTime = {
    taskId: number,
    time: string
}

type ExperimentLog = {
    experimentId: string,
    timestamp: string,
    answers: Answer[]
    taskCompletionTimes?: TaskCompletionTime[]
}

export { ExperimentLog }