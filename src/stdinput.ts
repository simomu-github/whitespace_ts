import * as readline from "readline"

export function readStdInput() {
  return new Promise<string>((resolve) => {
    let content = ""
    let chunk = ""

    process.stdin
      .setEncoding("utf-8")
      .on("readable", () => {
        while ((chunk = process.stdin.read()) !== null) {
          content += chunk
        }
      })
      .on("end",() => resolve(content))
  })
}