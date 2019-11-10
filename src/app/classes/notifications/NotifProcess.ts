export class NotifProcess {
    private repeatTime?: number;
    private process: () => void;

    private watch: any;

    public constructor(process: () => void, repeatTime?: number) {
        this.repeatTime = repeatTime > 0 ? repeatTime : 0;
        this.process = process;
    }

    public start() {
        this.process();

        if(this.repeatTime) {
            this.watch = setInterval(() => this.process(), this.repeatTime * 60000);
        }
    }

    public stop() {
        if(this.watch) {
            clearInterval(this.watch);
        }
    }
}