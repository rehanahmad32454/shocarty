export const dateFormatter = (date) => {
  if (!date) return "";
  let updatedDate = new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return updatedDate;
};
