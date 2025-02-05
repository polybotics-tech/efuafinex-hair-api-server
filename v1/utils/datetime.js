export const FormatDateTime = {
  to_database_entry: (givenDate) => {
    if (givenDate) {
      return new Date(givenDate).toISOString();
    }

    return new Date().toISOString(); //.split("T")[0]
  },
  to_future_deadline_from_duration: (duration = 0) => {
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + duration);

    return currentDate.toISOString().split("T")[0]; // Returns in YYYY-MM-DD format
  },
};
