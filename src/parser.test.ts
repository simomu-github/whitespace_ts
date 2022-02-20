import { Parser } from "./parser"
import { SPACE, TAB, LF } from "./constants"
import * as Instructions from "./instructions"

describe("Parse number", () => {
  test("Parse positive number", () => {
    const code = SPACE + TAB + SPACE + LF
    const parser = new Parser("", code)
    expect(parser.parseNumber()).toBe(2)
  })

  test("Parse negative number", () => {
    const code = TAB + TAB + SPACE + LF
    const parser = new Parser("", code)
    expect(parser.parseNumber()).toBe(-2)
  })
})

describe("Parse stack manipulation", () => {
  test("parse push", () => {
    const code = SPACE + SPACE + SPACE + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Push(1)])
  })

  test("parse duplicate", () => {
    const code = SPACE + LF + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Duplicate()])
  })

  test("parse swap", () => {
    const code = SPACE + LF + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Swap()])
  })

  test("parse discard", () => {
    const code = SPACE + LF + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Discard()])
  })
})

describe("Parse arithmetic", () => {
  test("parse push", () => {
    const code = TAB + SPACE + SPACE + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Addition()])
  })

  test("parse duplicate", () => {
    const code = TAB + SPACE + SPACE + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Subtraction()])
  })

  test("parse swap", () => {
    const code = TAB + SPACE + SPACE + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Multiplication()])
  })

  test("parse discard", () => {
    const code = TAB + SPACE + TAB + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Division()])
  })

  test("parse discard", () => {
    const code = TAB + SPACE + TAB + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Modulo()])
  })
})

describe("Parse heap access", () => {
  test("parse store", () => {
    const code = TAB + TAB + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Store()])
  })

  test("parse retrieve", () => {
    const code = TAB + TAB + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Retrieve()])
  })
})

describe("Parse IO", () => {
  test("parse getc", () => {
    const code = TAB + LF + TAB + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Getc()])
  })

  test("parse getn", () => {
    const code = TAB + LF + TAB + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Getn()])
  })

  test("parse putc", () => {
    const code = TAB + LF + SPACE + SPACE
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Putc()])
  })

  test("parse putn", () => {
    const code = TAB + LF + SPACE + TAB
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.Putn()])
  })
})

describe("Parse flow controll", () => {
  test("parse mark label", () => {
    const code = LF + SPACE + SPACE + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.MarkLabel()])
    expect(parser.labelPosition).toStrictEqual({ [TAB]: 1 })
  })

  test("parse call subroutine", () => {
    const code = LF + SPACE + TAB + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.CallSubroutine(TAB)])
  })

  test("parse jump label", () => {
    const code = LF + SPACE + LF + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.JumpLabel(TAB)])
  })

  test("parse jump label when zero", () => {
    const code = LF + TAB + SPACE + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.JumpLabelWhenZero(TAB)])
  })

  test("parse jump label when negative", () => {
    const code = LF + TAB + TAB + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.JumpLabelWhenNegative(TAB)])
  })

  test("parse end subroutine", () => {
    const code = LF + TAB + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.EndSubroutine()])
  })

  test("parse end program", () => {
    const code = LF + LF + LF
    const parser = new Parser("", code)
    expect(parser.parse()).toStrictEqual([new Instructions.EndProgram()])
  })
})

describe("Parse all", () => {
  const code =
    SPACE + SPACE + SPACE + TAB + LF +
    SPACE + LF + SPACE +
    SPACE + LF + TAB +
    SPACE + LF + LF +
    LF + LF + LF
  const parser = new Parser("", code)
  parser.parseAll()
  expect(parser.instructions).toStrictEqual(
    [
      new Instructions.Push(1),
      new Instructions.Duplicate(),
      new Instructions.Swap(),
      new Instructions.Discard(),
      new Instructions.EndProgram()
    ]
  )
})
