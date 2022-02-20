import {
  SPACE,
  TAB,
  LF,
  isWhitespaceToken
} from "./constants"
import { Instruction } from "./instructions"
import * as Instructions from "./instructions"
import { ParseError } from "./errors"

export class Parser {
  filename: string = ""
  rawSourceCode: string = ""
  currentIndex: number = -1
  currentLine: number = 0
  currentColumn: number = 0
  newLine: boolean = false
  instructions: Instruction[] = []
  labelPosition: { [label: string]: number } = {}

  constructor(filename: string, rawSourceCode: string) {
    this.filename = filename;
    this.rawSourceCode = rawSourceCode;
  }

  parseAll() {
    this.currentIndex = -1;
    this.currentLine = 1;
    this.currentColumn = 0;
    this.newLine = false;

    this.instructions = this.parse()
  }

  parse(): Instruction[] {
    const token = this.nextToken()
    switch(token) {
      case SPACE:
        return this.parseStackManipuration()
      case TAB:
        const nextToken = this.nextToken()
        switch(nextToken) {
          case SPACE:
            return this.parseArithmetic()
          case TAB:
            return this.parseHeapAccess()
          case LF:
             return this.parseIO()
          default:
            throw new ParseError(this, "expected instruction modification parameters")
        }
      case LF:
        return this.parseFlowControll()
      default:
        return this.instructions
    }
  }

  parseStackManipuration() {
    const token = this.nextToken()
    switch(token) {
      case SPACE:
        const value = this.parseNumber()
        return this.addInstruction(new Instructions.Push(value))
      case LF:
        const nextToken = this.nextToken()
        switch(nextToken) {
          case SPACE:
            return this.addInstruction(new Instructions.Duplicate())
          case TAB:
            return this.addInstruction(new Instructions.Swap())
          case LF:
            return this.addInstruction(new Instructions.Discard())
          default:
            throw new ParseError(this, "expected stack manipulation command")
        }
      default:
        throw new ParseError(this, "expected stack manipulation command")
    }
  }

  parseArithmetic() {
    const token = this.nextToken()
    const nextToken = this.nextToken()
    switch(token) {
      case SPACE:
        switch(nextToken) {
          case SPACE:
            return this.addInstruction(new Instructions.Addition())
          case TAB:
            return this.addInstruction(new Instructions.Subtraction())
          case LF:
            return this.addInstruction(new Instructions.Multiplication())
          default:
            throw new ParseError(this, "expected arithmetic command")
        }
      case TAB:
        switch(nextToken) {
          case SPACE:
            return this.addInstruction(new Instructions.Division())
          case TAB:
            return this.addInstruction(new Instructions.Modulo())
          default:
            throw new ParseError(this, "expected arithmetic command")
        }
      default:
        throw new ParseError(this, "expected arithmetic command")
    }
  }

  parseHeapAccess() {
    const token = this.nextToken()
    switch(token) {
      case SPACE:
        return this.addInstruction(new Instructions.Store())
      case TAB:
        return this.addInstruction(new Instructions.Retrieve())
      default:
        throw new ParseError(this, "expected heap access command")
    }
  }

  parseIO() {
    const token = this.nextToken()
    const nextToken = this.nextToken()
    switch(token) {
      case SPACE:
        switch(nextToken) {
          case SPACE:
            return this.addInstruction(new Instructions.Putc())
          case TAB:
            return this.addInstruction(new Instructions.Putn())
          default:
            throw new ParseError(this, "expected IO command")
        }
      case TAB:
        switch(nextToken) {
          case SPACE:
            return this.addInstruction(new Instructions.Getc())
          case TAB:
            return this.addInstruction(new Instructions.Getn())
          default:
            throw new ParseError(this, "expected IO command")
        }
      default:
        throw new ParseError(this, "expected IO command")
    }
  }

  parseFlowControll() {
    const token = this.nextToken()
    const nextToken = this.nextToken()
    let label = ""
    switch(token) {
      case SPACE:
        switch(nextToken) {
          case SPACE:
            label = this.parseLabel()
            this.labelPosition[label] = this.instructions.length + 1;
            return this.addInstruction(new Instructions.MarkLabel())
          case TAB:
            label = this.parseLabel()
            return this.addInstruction(new Instructions.CallSubroutine(label))
          case LF:
            label = this.parseLabel()
            return this.addInstruction(new Instructions.JumpLabel(label))
          default:
            throw new ParseError(this, "expected flow controll command")
        }
      case TAB:
        switch(nextToken) {
          case SPACE:
            label = this.parseLabel()
            return this.addInstruction(new Instructions.JumpLabelWhenZero(label))
          case TAB:
            label = this.parseLabel()
            return this.addInstruction(new Instructions.JumpLabelWhenNegative(label))
          case LF:
            return this.addInstruction(new Instructions.EndSubroutine())
          default:
            throw new ParseError(this, "expected flow controll command")
        }
      case LF:
        if(nextToken === LF) {
            return this.addInstruction(new Instructions.EndProgram())
        } else {
            throw new ParseError(this, "expected flow controll command")
        }
      default:
        throw new ParseError(this, "expected flow controll command")
    }
  }

  parseNumber() {
    const token = this.nextToken()
    let sign: -1 | 1 = 1

    switch(token) {
      case SPACE:
        sign = 1
        break
      case TAB:
        sign = -1
        break
      default:
        throw new ParseError(this, "expected sign")
    }

    const n = this.parseBinaryNumber(0, 0, this.nextToken())
    return sign * n
  }

  parseBinaryNumber(n: number, digits: number, token: string): number {
    switch(token) {
      case SPACE:
        return this.parseBinaryNumber(2 * n, digits + 1, this.nextToken())
      case TAB:
        return this.parseBinaryNumber(2 * n + 1, digits + 1, this.nextToken())
      case LF:
        if(digits <= 0) throw new ParseError(this, "expected number")

        return n
      default:
        throw new ParseError(this, "expected numeric parameter end with a linefeed")
    }
  }

  parseLabel() {
    let label = ""
    let token = this.nextToken()
    while(token === SPACE || token === TAB) {
      label += token
      token = this.nextToken()
    }

    if (token !== LF) {
      throw new ParseError(this, "expected label parameter end with a linefeed")
    }

    if (label.length === 0) {
      throw new ParseError(this, "expected label")
    }

    return label
  }

  addInstruction(instruction: Instruction): Instruction[] {
    this.instructions.push(instruction)
    return this.parse()
  }

  nextToken() {
    this.currentIndex++

    if (this.newLine) {
      this.newLine = false
      this.currentColumn = 0
    }

    this.currentColumn++

    if(this.currentIndex >= this.rawSourceCode.length) {
      return String.fromCharCode(0);
    }

    while(!isWhitespaceToken(this.currentToken())) {
      this.currentIndex++
      if(this.currentIndex >= this.rawSourceCode.length) {
        return String.fromCharCode(0);
      }
    }

    if (this.currentToken() === LF) {
      this.currentLine++
      this.newLine = true
    }

    return this.currentToken()
  }

  currentToken(): string {
    return this.rawSourceCode[this.currentIndex];
  }
};
