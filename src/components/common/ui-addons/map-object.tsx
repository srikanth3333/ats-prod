export default function MapObject({ val, mapObject }: any) {
  const item = mapObject?.find((record: any) => record?.value === val);
  return <div>{item?.label}</div>;
}
