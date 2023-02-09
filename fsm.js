
class FSM {
    constructor (defines, initialState) {
        this.initialState = initialState
        this.defines = defines
        this.state = initialState;
    }

    // 发送消息
    send (event) {
        for (let i = 0; i < this.defines.length; i ++) {
            const define = this.defines[i];
            if (this.state === define.from && event === define.event) {
                this.stateWillChange(define.from, define.to)
                this.state = define.to;
                this.stateDidChange(define.from, define.to)
                break;
            }
        }
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
    off:'off', // 关闭
    level1Cold: 'level1Cold', // 一档冷光
    level2Cold: 'level2Cold', // 二档冷光
    level3Cold: 'level3Cold', // 三档冷光
    level2Warm: 'level2Warm', // 二档暖光
    level3Warm: 'level3Warm' // 三档暖光
};

const Event = {
    lBtnTap: 'lBtnTap', // 左侧按钮点击
    rBtnTap: 'rBtnTap', // 右侧按钮点击
};

const  defines = [
    {from:State.off, to:State.level1Cold, event:Event.lBtnTap},
    {from:State.level1Cold, to:State.level2Cold, event:Event.lBtnTap},
    {from:State.level2Cold, to:State.level3Cold, event:Event.lBtnTap},
    {from:State.level2Cold, to:State.level2Warm, event:Event.rBtnTap},
    {from:State.level2Warm, to:State.level2Cold, event:Event.rBtnTap},
    {from:State.level3Cold, to:State.level3Warm, event:Event.rBtnTap},
    {from:State.level3Warm, to:State.level3Cold, event:Event.rBtnTap},
    {from:State.level3Cold, to:State.off, event:Event.lBtnTap},
    {from:State.level3Warm, to:State.off, event:Event.lBtnTap},
]

const  initialState = State.off;
const fsm = new FSM(defines, initialState)

console.log(fsm.stateValue());
fsm.send(Event.lBtnTap)
fsm.send(Event.lBtnTap)
fsm.send(Event.lBtnTap)
fsm.send(Event.lBtnTap)
fsm.send(Event.lBtnTap)
fsm.send(Event.lBtnTap)
console.log(fsm.stateValue());
fsm.send(Event.rBtnTap)
console.log(fsm.stateValue());
