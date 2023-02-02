const {NodeState, NodeEvent} = require("./dispatcher/define/define");
const {mapState} = require("xstate");

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
                this.state = define.to;
            }
        })
    }

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


const  defines = Array()
defines.push({from:State.idle, to:State.processing, event:Event.startProcess})
defines.push({from:State.idle, to:State.cancel, event:Event.userCancel})

defines.push({from:State.processing, to:State.success, event:Event.processSuccess})
defines.push({from:State.processing, to:State.failure, event:Event.processFail})
defines.push({from:State.processing, to:State.cancel, event:Event.userCancel})

defines.push({from:State.failure, to:State.cancel, event:Event.userCancel})
defines.push({from:State.failure, to:State.success, event:Event.processSuccess})


const  initialState = State.idle;
const fsm = new FSM(defines, initialState)
console.log(fsm.stateValue());
fsm.send(NodeEvent.startProcess)
console.log(fsm.stateValue());

fsm.send(NodeEvent.processSuccess)
console.log(fsm.stateValue());
fsm.reset()
console.log(fsm.stateValue());


