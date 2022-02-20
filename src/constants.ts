export const SPACE: " " = " "
export const TAB: "\t" = "\t"
export const LF: "\n" = "\n"
export function isWhitespaceToken(str: string) {
  return (str === SPACE || str === TAB || str === LF)
}