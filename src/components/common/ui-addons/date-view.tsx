import moment from "moment";

function DateView({ val }: any) {
  return <div>{moment(val).format("DD/MM/YYYY")}</div>;
}

export default DateView;
