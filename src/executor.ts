import { RuntimeError } from "./errors";
import { Instruction } from "./instructions";
import { readStdInput } from "./stdinput";

export class Executor {
  instructions: Instruction[] = []
  programCounter: number = 0
  stack: number[] = []
  heap: { [address: number]: number } = {}
  callstack: number[] = []
  labelPosition: { [label: string]: number } = {}
  stdin = async (callback: (result: string) => void) => {
    const result = await readStdInput()
    callback(result)
  }
  stdout = (str: string) => {
    process.stdout.write(str)
  }

  run() {
    for(this.programCounter = 0; this.programCounter < this.instructions.length; this.programCounter++) {
      this.instructions[this.programCounter].execute(this)
    }
  }

  push(value: number) {
    this.stack.push(value)
  }

  pop() {
    const value = this.stack.pop()
    if(value === undefined) {
      throw new RuntimeError(this, "stack is empty")
    }
    return value
  }

  pushCallstack(counter: number) {
    this.callstack.push(counter)
  }

  popCallstack() {
    const counter = this.callstack.pop()
    if(counter === undefined) {
      throw new RuntimeError(this, "callstack is empty")
    }

    return counter
  }

  store(adderss: number, value: number) {
    this.heap[adderss] = value
  }

  fetch(address: number) {
    const value = this.heap[address]
    if(value === undefined) {
      throw new RuntimeError(this, `${address} is not stored`)
    }

    return this.heap[address]
  }

  fetchLabelPosition(label: string) {
    const position = this.labelPosition[label]
    if(position === undefined) {
      throw new RuntimeError(this, "label is not found")
    }

    return this.labelPosition[label]
  }
};
