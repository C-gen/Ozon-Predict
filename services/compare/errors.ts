export class UnknownNicheIdsError extends Error {
  readonly name = "UnknownNicheIdsError";

  constructor(readonly ids: string[]) {
    super(`Неизвестные id ниш: ${ids.join(", ")}`);
  }
}

/** Niche exists in catalog but is not in the current analysis (e.g. excluded category). */
export class NichesUnavailableForCompareError extends Error {
  readonly name = "NichesUnavailableForCompareError";

  constructor(readonly ids: string[]) {
    super(
      `Ниши недоступны для сравнения при текущих целях (исключены или отфильтрованы): ${ids.join(", ")}`,
    );
  }
}
