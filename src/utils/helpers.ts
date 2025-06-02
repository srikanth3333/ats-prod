export function splitArrayInHalf(arr: any) {
  const half = Math.ceil(arr?.length / 2); // If odd, the first half gets the extra item
  const firstHalf = arr?.slice(0, half);
  return firstHalf;
}

export function getLabel(arr: any, value: string | number) {
  const foundLabel = arr?.find((record: any) => record?.value === value)?.label;
  return foundLabel;
}
