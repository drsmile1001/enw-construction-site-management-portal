import dayjs from "dayjs";

/** 格式化時間 */
export const formatDateTime = (
  time: string | number | Date,
  template = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!time) {
    return "N/A";
  }
  const date = new Date(time);

  return dayjs(date).format(template);
};
