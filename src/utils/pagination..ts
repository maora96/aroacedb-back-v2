export function getLimitAndOffset(
  amount: number,
  page: number,
): {
  limit: number;
  offset: number;
} {
  const computedPage = !page || page < 1 ? 1 : page;
  const limit = !amount || amount < 1 ? 10 : amount;
  const offset = (computedPage - 1) * limit;

  return { limit, offset };
}
