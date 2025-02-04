export const FormatDateTime = {
  to_database_entry: (givenDate) => {
    if (givenDate) {
      return new Date(givenDate).toISOString();
    }

    return new Date().toISOString(); //.split("T")[0]
  },
};
