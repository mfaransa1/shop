/** Official SHoP chessboard palette, based on the supplied reference image. */
export const standardBoardTheme = {
  name: "shop-classic",
  lightSquare: "#ecebd2",
  darkSquare: "#759653",
  coordinateLight: "#759653",
  coordinateDark: "#ecebd2",
  selected: "#f6d365",
  lastMove: "#d7c85a",
  legalMove: "rgba(25, 35, 20, 0.30)",
  check: "#cf4848",
  boardFrame: "#292a27",
} as const;

export type BoardOrientation = "white" | "black";
export type BoardSquare = `${"a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"}${1|2|3|4|5|6|7|8}`;
export type BoardPiece = { color: "w" | "b"; type: "p" | "n" | "b" | "r" | "q" | "k" };
