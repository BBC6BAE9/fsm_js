
class FSM {
    constructor (defines, initialState) {
        this.initialState = initialState
        this.defines = defines
        this.state = initialState;
    }

    // 发送消息
    send (event) {
        this.defines.forEach((define, i) => {
            if (this.state == define.from && event == define.event) {
                this.stateWillChange(define.from, define.to)
                this.state = define.to;
                this.stateDidChange(define.from, define.to)
            }
        })
    }

    // 状态即将发生变化
    stateWillChange (oldState, newState) {

    }

    // 状态已经发生变化
    stateDidChange (oldState, newState) {

    }

    // 持久化存储的字符串
    persistenceStateJsonString () {
        return this.state;
    }

    // 恢复状态机机
    resume (jsonStr) {
        this.state = jsonStr
    }

    // 强制跳转到某个新状态
    forceChangeState (newState) {
        this.state = newState
    }

    // 获取当前状态
    stateValue () {
        return this.state;
    }

    // 重置状态机
    reset () {
        this.state = this.initialState
    }
}

// 节点状态
const State = {
    idle: 'idle', // 出事状态
    processing: 'processing', // 处理中
    success: 'success', // 成功
    failure: 'failure', // 失败
    cancel: 'cancel' // 取消
};

// 节点事件
const Event = {
    startProcess: 'START_PROCESS', // 开始处理
    processSuccess: 'PROCESS_SUCCESS', // 处理成功
    processFail: 'PROCESS_FAIL', // 处理失败
    userCancel: 'USER_CANCEL' // 用户取消
};


const  defines = [
    {from:State.idle, to:State.processing, event:Event.startProcess},
    {from:State.idle, to:State.cancel, event:Event.userCancel},
    {from:State.processing, to:State.success, event:Event.processSuccess},
    {from:State.processing, to:State.failure, event:Event.processFail},
    {from:State.processing, to:State.cancel, event:Event.userCancel},
    {from:State.failure, to:State.cancel, event:Event.userCancel},
    {from:State.failure, to:State.success, event:Event.processSuccess}
]

const  initialState = State.idle;
const fsm = new FSM(defines, initialState)

console.log(fsm.stateValue());
fsm.send(Event.startProcess)
console.log(fsm.stateValue());

fsm.send(Event.processSuccess)
console.log(fsm.stateValue());
fsm.reset()
console.log(fsm.stateValue());


