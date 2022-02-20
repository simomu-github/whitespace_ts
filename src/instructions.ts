import { ExecOptionsWithStringEncoding } from "child_process";
import { Executor } from "./executor";

export interface Instruction {
  execute: (executor: Executor) => void
}

export class Push implements Instruction {
  value: number

  constructor(value: number) {
    this.value = value
  }

  execute(executor: Executor) {
    executor.push(this.value)
  }
}

export class Swap implements Instruction {
  execute(executor: Executor) {
    const a = executor.pop()
    const b = executor.pop()

    executor.push(a)
    executor.push(b)
  }
}

export class Duplicate implements Instruction {
  execute(executor: Executor) {
    const value = executor.pop()
    executor.push(value)
    executor.push(value)
  }
}

export class Discard implements Instruction {
  execute(executor: Executor) {
    executor.pop()
  }
}

export class Addition implements Instruction {
  execute(executor: Executor) {
    const lhs = executor.pop()
    const rhs = executor.pop()
    executor.push(lhs + rhs)
  }
}

export class Subtraction implements Instruction {
  execute(executor: Executor) {
    const lhs = executor.pop()
    const rhs = executor.pop()
    executor.push(lhs - rhs)
  }
}

export class Multiplication implements Instruction {
  execute(executor: Executor) {
    const lhs = executor.pop()
    const rhs = executor.pop()
    executor.push(lhs * rhs)
  }
}

export class Division implements Instruction {
  execute(executor: Executor) {
    const lhs = executor.pop()
    const rhs = executor.pop()
    executor.push(lhs / rhs)
  }
}

export class Modulo implements Instruction {
  execute(executor: Executor) {
    const lhs = executor.pop()
    const rhs = executor.pop()
    executor.push(lhs % rhs)
  }
}

export class Getc implements Instruction {
  execute(executor: Executor) {
    let char = "" 
    executor.stdin((result) => { char = result})
    const value = char.charCodeAt(0)

    const address = executor.pop()
    executor.store(address, value)
  }
}

export class Getn implements Instruction {
  execute(executor: Executor) {
    let char = "" 
    executor.stdin((result) => { char = result})
    const value = parseInt(char) 

    const address = executor.pop()
    executor.store(address, value)
  }
}

export class Putc implements Instruction {
  execute(executor: Executor) {
    const value = executor.pop()
    executor.stdout(String.fromCharCode(value))
  }
}

export class Putn implements Instruction {
  execute(executor: Executor) {
    executor.stdout(executor.pop().toString())
  }
}

export class Store implements Instruction {
  execute(executor: Executor) {
    const value = executor.pop()
    const address = executor.pop()

    executor.store(address, value)
  }
}

export class Retrieve implements Instruction {
  execute(executor: Executor) {
    const address = executor.pop()
    const value = executor.fetch(address)
    executor.push(value)
  }
}

export class MarkLabel implements Instruction {
  execute(executor: Executor) {}
}

export class CallSubroutine implements Instruction {
  label: string
  
  constructor(label: string) {
    this.label = label
  }

  execute(executor: Executor) {
    const currentCounter = executor.programCounter
    executor.pushCallstack(currentCounter)

    const newCounter = executor.fetchLabelPosition(this.label)
    executor.programCounter = newCounter
  }
}

export class EndSubroutine implements Instruction {
  execute(executor: Executor) {
    const counter = executor.popCallstack()
    executor.programCounter = counter
  }
}

export class JumpLabel implements Instruction {
  label: string
  
  constructor(label: string) {
    this.label = label
  }

  execute(executor: Executor) {
    const newCounter = executor.fetchLabelPosition(this.label)
    executor.programCounter = newCounter
  }
}

export class JumpLabelWhenZero implements Instruction {
  label: string
  
  constructor(label: string) {
    this.label = label
  }

  execute(executor: Executor) {
    const value = executor.pop()
    if (value !== 0) {
      return
    }

    const newCounter = executor.fetchLabelPosition(this.label)
    executor.programCounter = newCounter
  }
}

export class JumpLabelWhenNegative implements Instruction {
  label: string
  
  constructor(label: string) {
    this.label = label
  }

  execute(executor: Executor) {
    const value = executor.pop()
    if (value >= 0) {
      return
    }

    const newCounter = executor.fetchLabelPosition(this.label)
    executor.programCounter = newCounter
  }
}

export class EndProgram implements Instruction {
  execute(executor: Executor) {
    executor.programCounter = executor.instructions.length
  }
}