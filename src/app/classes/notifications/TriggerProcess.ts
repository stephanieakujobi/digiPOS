/**
 * A TriggerProcess maps to a function that can be called repeatedly after a set amount of minutes or triggered manually.
 */
export class TriggerProcess {
    private repeatTime?: number;
    private process: () => void;

    private watchInterval: any;

    /**
     * Creates a new TriggerProcess
     * @param process The function to execute when triggered.
     * @param repeatTime An optional time interval (in minutes) to repeat the function execution.
     */
    public constructor(process: () => void, repeatTime?: number) {
        this.repeatTime = repeatTime > 0 ? repeatTime : 0;
        this.process = process;
    }

    /**
     * Executes the process associated with this TriggerProcess and repeats execution after the specified number of minutes, if applicable.
     */
    public start() {
        this.process();

        if(this.repeatTime) {
            this.watchInterval = setInterval(() => this.process(), this.repeatTime * 60000);
        }
    }

    /** 
     * Stops repeated-execution of the process associated with this TriggerProcess.
     */
    public stop() {
        if(this.watchInterval) {
            clearInterval(this.watchInterval);
        }
    }
}