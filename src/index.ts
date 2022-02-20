import { Executor } from "./executor";
import { Interpreter } from "./interpreter";

process.exitCode = (new Interpreter).run(process.argv)