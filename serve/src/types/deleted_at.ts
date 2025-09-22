export enum DeletedAtStatus {
  NOT_DELETED = 0,
  DELETED = 1,
}

export const nowUtc = (): Date => {
  return new Date();
};
