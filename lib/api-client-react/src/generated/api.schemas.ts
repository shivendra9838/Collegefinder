// Mocked schemas
export type College = any;
export type Course = any;
export type Review = any;
export type Question = any;
export type Answer = any;

export enum PredictRequestExam {
  JEE_Main = "JEE Main",
  JEE_Advanced = "JEE Advanced",
  BITSAT = "BITSAT",
  VITEEE = "VITEEE",
  GATE = "GATE",
  CAT = "CAT",
  GMAT = "GMAT",
  GRE = "GRE",
  JAC_Delhi = "JAC Delhi",
  TNEA = "TNEA"
}

export enum PredictRequestCategory {
  General = "General",
  OBC = "OBC",
  SC = "SC",
  ST = "ST",
  EWS = "EWS"
}
