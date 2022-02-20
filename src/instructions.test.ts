import { SPACE, TAB } from "./constants";
import { Executor } from "./executor";
import * as Instructions from "./instructions";

test("Push instruction", () => {
  const executor = new Executor()
  const push = new Instructions.Push(5)
  push.execute(executor)
  expect(executor.stack).toStrictEqual([5])
})

test("Swap instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const swap = new Instructions.Swap()
  swap.execute(executor)
  expect(executor.stack).toStrictEqual([5, 2])
})

test("Duplicate instruction", () => {
  const executor = new Executor()
  executor.push(5)

  const dup = new Instructions.Duplicate()
  dup.execute(executor)
  expect(executor.stack).toStrictEqual([5, 5])
})

test("Discard instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const discard = new Instructions.Discard()
  discard.execute(executor)
  expect(executor.stack).toStrictEqual([2])
})

test("Addition instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const add = new Instructions.Addition()
  add.execute(executor)
  expect(executor.stack).toStrictEqual([7])
})

test("Subtraction instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const sub = new Instructions.Subtraction()
  sub.execute(executor)
  expect(executor.stack).toStrictEqual([3])
})

test("Multiplication instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const mul = new Instructions.Multiplication()
  mul.execute(executor)
  expect(executor.stack).toStrictEqual([10])
})

test("Modulo instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const mod = new Instructions.Modulo()
  mod.execute(executor)
  expect(executor.stack).toStrictEqual([1])
})

test("Getc instruction", () => {
  const executor = new Executor()
  const stdinMock = jest.fn(x => x("A"))
  executor.stdin = stdinMock 
  executor.push(5)

  const getc = new Instructions.Getc()
  getc.execute(executor)
  expect(stdinMock).toHaveBeenCalled()
  expect(executor.stack).toStrictEqual([])
  expect(executor.heap).toStrictEqual({ 5: 65})
})

test("Getn instruction", () => {
  const executor = new Executor()
  const stdinMock = jest.fn(x => x("65"))
  executor.stdin = stdinMock 
  executor.push(5)

  const getn = new Instructions.Getn()
  getn.execute(executor)
  expect(stdinMock).toHaveBeenCalled()
  expect(executor.stack).toStrictEqual([])
  expect(executor.heap).toStrictEqual({ 5: 65})
})

test("Putc instruction", () => {
  const executor = new Executor()
  const stdoutMock = jest.fn()
  executor.stdout = stdoutMock 
  executor.push(65)

  const putc = new Instructions.Putc()
  putc.execute(executor)
  expect(stdoutMock).toHaveBeenCalledWith("A")
  expect(executor.stack).toStrictEqual([])
})

test("Putc instruction", () => {
  const executor = new Executor()
  const stdoutMock = jest.fn()
  executor.stdout = stdoutMock 
  executor.push(65)

  const putn = new Instructions.Putn()
  putn.execute(executor)
  expect(stdoutMock).toHaveBeenCalledWith("65")
  expect(executor.stack).toStrictEqual([])
})

test("Store instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.push(5)

  const store = new Instructions.Store()
  store.execute(executor)
  expect(executor.heap).toStrictEqual({2: 5})
})

test("Retrievfe instruction", () => {
  const executor = new Executor()
  executor.push(2)
  executor.store(2, 5)

  const retrieve = new Instructions.Retrieve()
  retrieve.execute(executor)
  expect(executor.stack).toStrictEqual([5])
})

test("CallSubroutine instruction", () => {
  const executor = new Executor
  executor.instructions.push(new Instructions.MarkLabel())
  executor.labelPosition[TAB + SPACE] = 0
  executor.programCounter = 1

  const callSubroutine = new Instructions.CallSubroutine(TAB + SPACE)
  callSubroutine.execute(executor)
  expect(executor.programCounter).toBe(0)
  expect(executor.callstack).toStrictEqual([1])
})

test("EndSubroutine instruction", () => {
  const executor = new Executor
  executor.programCounter = 10
  executor.pushCallstack(0)

  const endSubroutine = new Instructions.EndSubroutine()
  endSubroutine.execute(executor)
  expect(executor.programCounter).toBe(0)
})

test("JumpLabel instruction", () => {
  const executor = new Executor
  executor.instructions.push(new Instructions.MarkLabel())
  executor.labelPosition[TAB + SPACE] = 0
  executor.programCounter = 1

  const callSubroutine = new Instructions.JumpLabel(TAB + SPACE)
  callSubroutine.execute(executor)
  expect(executor.programCounter).toBe(0)
  expect(executor.callstack).toStrictEqual([])
})

test("JumpLabel instruction", () => {
  const executor = new Executor
  executor.instructions.push(new Instructions.MarkLabel())
  executor.labelPosition[TAB + SPACE] = 0
  executor.programCounter = 1

  const callSubroutine = new Instructions.JumpLabel(TAB + SPACE)
  callSubroutine.execute(executor)
  expect(executor.programCounter).toBe(0)
  expect(executor.callstack).toStrictEqual([])
})

describe("JumpLabelWhenZero instruction", () => {
  describe("when value is zero", () => {
    test("jump", () => {
      const executor = new Executor()
      executor.instructions.push(new Instructions.MarkLabel())
      executor.labelPosition[TAB + SPACE] = 0
      executor.programCounter = 1
      executor.push(0)

      const jump = new Instructions.JumpLabelWhenZero(TAB + SPACE)
      jump.execute(executor)
      expect(executor.programCounter).toBe(0)
    })
  })

  describe("when value is not zero", () => {
    test("does not jump", () => {
      const executor = new Executor()
      executor.instructions.push(new Instructions.MarkLabel())
      executor.labelPosition[TAB + SPACE] = 0
      executor.programCounter = 1
      executor.push(1)

      const jump = new Instructions.JumpLabelWhenZero(TAB + SPACE)
      jump.execute(executor)
      expect(executor.programCounter).toBe(1)
    })
  })
})

describe("JumpLabelWhenNegative instruction", () => {
  describe("when value is negative", () => {
    test("jump", () => {
      const executor = new Executor()
      executor.instructions.push(new Instructions.MarkLabel())
      executor.labelPosition[TAB + SPACE] = 0
      executor.programCounter = 1
      executor.push(-1)

      const jump = new Instructions.JumpLabelWhenNegative(TAB + SPACE)
      jump.execute(executor)
      expect(executor.programCounter).toBe(0)
    })
  })

  describe("when value is not negative", () => {
    test("does not jump", () => {
      const executor = new Executor()
      executor.instructions.push(new Instructions.MarkLabel())
      executor.labelPosition[TAB + SPACE] = 0
      executor.programCounter = 1
      executor.push(1)

      const jump = new Instructions.JumpLabelWhenNegative(TAB + SPACE)
      jump.execute(executor)
      expect(executor.programCounter).toBe(1)
    })
  })
})

test("EndProgram instruction", () => {
  const executor = new Executor()
  executor.instructions.push(new Instructions.Push(5))
  executor.programCounter = 0

  const endProgram = new Instructions.EndProgram()
  endProgram.execute(executor)
  expect(executor.programCounter).toBe(1)
  expect(executor.stack).toStrictEqual([])
})