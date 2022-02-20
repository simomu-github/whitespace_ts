import { Executor } from "./executor";
import { Parser } from "./parser";
import * as fs from "fs"
import { version } from "./../package.json"

const usage = "Usage of whitespace ts\n  ws [FILE]\n"
const options = "  -v --version display version\n"

export class Interpreter {
  run(args: string[]) {
    if (args.length < 3) {
      console.log(usage + options) 
      return 1
    }

    const arg = args[2]
    if(arg === "-v" || arg === "--version") {
      console.log(`ws version ${version}`)
      return 0
    }

    const filePath = arg 
    let sourceCode = ""

    try {
      sourceCode = fs.readFileSync(filePath).toString()
    } catch(error) {
      console.error(`${error}`)
      return 1
    }

    const parser = new Parser(filePath, sourceCode);
    parser.parseAll();

    const executor = new Executor()
    executor.instructions = parser.instructions
    executor.labelPosition = parser.labelPosition

    try {
      executor.run()
    } catch(error) {
      console.error(`${error}`)
      return 1
    }

    return 0
  }
};
