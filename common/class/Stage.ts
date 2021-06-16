/**
 * @param {Array} stages 以数组方式传入多个阶段名称及时长。如：[{name: 'BEFORE_START', duration: 5}]
 * duration单位为秒；duration为0 表示0秒；duration为-1 表示无限时长(不会启动计时器)
 */
export default class Stage {
    stages!: any;
    timer: any = null;
    timer_i: any = null;
    processes = new Map();
    index = -1;
    duration = 0;
    startTime = 0;
    isBeforeAll = false;
    isAfterAll = false;
    preIndex = -1;
    nextIndex = -1;
    nextDuration!: any;

    constructor(stages: any) {
        this.stages = stages;
    }

    get endTime() {
        return this.startTime + this.duration;
    }

    get curStage() {
        return this.stages[this.index] && this.stages[this.index]['name'];
    }

    get preStage() {
        return this.stages[this.preIndex] && this.stages[this.preIndex]['name'];
    }

    get nextStage() {
        return (
            this.stages[this.nextIndex] && this.stages[this.nextIndex]['name']
        );
    }

    init() {
        this.switchStage(this.stages[0]['name']);
    }

    switchStage(stage = null, seconds = 0) {
        this._clearTimer();

        //手动切换
        if (stage) {
            this.preIndex = this.index;
            this.index = this._stageIndex(stage);
            this.nextIndex = this.index + 1;
            this.duration = seconds
                ? seconds * 1000
                : this._defaultDuration(this.curStage);
        } else {
            //自动切换
            this.preIndex = this.index;
            this.index = this.nextIndex;
            this.nextIndex = this.index + 1;
            this.duration = this.nextDuration
                ? this.nextDuration
                : this._defaultDuration(this.curStage);
            this.nextDuration = 0;
        }

        this._tryProcess();
    }

    restartCurrentStage(seconds = 0) {
        this._clearTimer();
        this.duration = seconds
            ? seconds * 1000
            : this._defaultDuration(this.curStage);
        this._tryProcess();
    }

    restart(seconds = 0) {
        this._clearTimer();
        this.switchStage(this.stages[0]['name'], seconds);
    }

    goException(error: any) {
        this._clearTimer();
        let exception = this.processes.get('exception');
        if (exception) exception(error);
    }

    setNextStage(nextStage: string, seconds = 0) {
        this.nextIndex = this._stageIndex(nextStage);
        this.nextDuration = seconds
            ? seconds * 1000
            : this._defaultDuration(nextStage);
    }

    on(stage: any, callback: any) {
        let callbacks = this.processes.get(stage);
        if (!callbacks) {
            callbacks = [];
            this.processes.set(stage, callbacks);
        }
        callbacks.push(callback);
    }

    onException(callback: any) {
        this.processes.set('exception', callback);
    }

    everySecond(callback: any) {
        this.processes.set('everySecond', callback);
    }

    beforeAll(callback: any) {
        this.processes.set('beforeAllStage', callback);
    }

    afterAll(callback: any) {
        this.processes.set('afterAllStage', callback);
    }

    beforeEach(callback: any) {
        this.processes.set('beforeEveryStage', callback);
    }

    afterEach(callback: any) {
        this.processes.set('afterEveryStage', callback);
    }

    private _defaultDuration(stageName: string) {
        let duration = 0;
        for (const stage of this.stages) {
            if (stage.name === stageName) {
                duration = stage.duration;
                break;
            }
        }
        return duration * 1000;
    }

    private _stageIndex(stageName: any) {
        let index = -1;
        for (let i = 0; i < this.stages.length; i++) {
            if (this.stages[i]['name'] === stageName) {
                index = i;
                break;
            }
        }
        if (index === -1) throw Error('can not find this stage!');
        return index;
    }

    private _tryProcess() {
        try {
            this._process();
        } catch (error) {
            this.goException(error);
        }
    }

    private _process() {
        if (this.duration < 0) {
            this.nextIndex = -1;
        } else {
            this._startTimer(this.duration);
        }

        this.startTime = Date.now();

        //第一个阶段开始前执行
        let beforeAll = this.processes.get('beforeAllStage');
        if (beforeAll && !this.isBeforeAll && this.index === 0) {
            beforeAll(this.curStage, this.preStage, this.nextStage);
            this.isBeforeAll = true;
            this.isAfterAll = false;
        }

        //每个阶段前执行
        let before = this.processes.get('beforeEveryStage');
        if (before) before(this.curStage, this.preStage, this.nextStage);

        //每个阶段执行
        let callbacks = this.processes.get(this.curStage);
        if (callbacks) {
            for (let callback of callbacks) {
                callback(this.curStage, this.preStage, this.nextStage);
            }
        }
    }

    private _startTimer(duration: number) {
        //每个阶段每秒执行
        let everySecond = this.processes.get('everySecond');
        if (everySecond) {
            this.timer_i = setInterval(() => {
                try {
                    everySecond(this.curStage, this.preStage, this.nextStage);
                } catch (error) {
                    this.goException(error);
                }
            }, 1000);
        }

        this.timer = setTimeout(() => {
            try {
                //每个阶段结束后执行
                let after = this.processes.get('afterEveryStage');
                if (after) after(this.curStage, this.preStage, this.nextStage);

                //最后一个阶段结束后执行
                let afterAll = this.processes.get('afterAllStage');
                if (
                    afterAll &&
                    !this.isAfterAll &&
                    this.index + 1 === this.stages.length
                ) {
                    afterAll(this.curStage, this.preStage, this.nextStage);
                    this.isAfterAll = true;
                    this.isBeforeAll = false;
                    this._clearTimer();
                }
            } catch (error) {
                this.goException(error);
            }

            if (this.nextStage) this.switchStage();
        }, duration);
    }

    private _clearTimer() {
        clearTimeout(this.timer);
        this.timer = null;

        clearInterval(this.timer_i);
        this.timer_i = null;
    }
}
