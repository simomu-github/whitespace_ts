import { Executor } from "./executor"
import { Parser } from "./parser"

export class ParseError extends Error {
  constructor(parser: Parser, message: string) {
    super(`Parse error: ${message} at ${parser.filename}:${parser.currentLine}:${parser.currentColumn}`)
  }
}

export class RuntimeError extends Error {
  constructor(executor: Executor, message: string) {
    super(`RuntimeError error: ${message}`)
  }
}