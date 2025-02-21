const random_num = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const random_aph = (count) => {
  let alphabets = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  let rand_aph = "";
  //loop through count
  for (let x = 0; x < count; x++) {
    const aph = alphabets[random_num(0, alphabets.length - 1)];

    rand_aph += `${aph}`;
  }

  return rand_aph;
};

export const IdGenerator = {
  user_id: () => {
    const dt = new Date();
    return `UID-${random_num(10, 99)}${random_aph(3)}${dt.getTime()}`;
  },
  user_name: (first_name) =>
    `${first_name}-${random_num(10, 999)}${random_aph(
      random_num(2, 4)
    )}${random_num(10, 999)}`,
  package_id: () => {
    const dt = new Date();

    return `PID-${random_num(10, 99)}${random_aph(
      random_num(2, 4)
    )}${dt.getTime()}`;
  },
  transaction_ref: () => {
    const dt = new Date();
    return `TREF-${random_aph(5)}${dt.getTime()}${random_num(10, 99)}`;
  },
  deposit_id: () => {
    const dt = new Date();
    return `DEPOSIT-${random_num(10, 99)}${random_aph(2)}${dt.getTime()}`;
  },
  photo_upload_name: () => {
    const ext = "jpeg";
    const dt = new Date();

    let year = dt.getFullYear();
    let month = String(Number(dt.getMonth() + 1)).padStart(2, "0");
    let date = String(dt.getDate()).padStart(2, "0");

    return `PHOTO-${year}${month}${date}-${random_aph(
      random_num(5, 10)
    )}${dt.getTime()}${random_num(10, 99)}.${ext}`;
  },
  otp: random_num(100000, 999999),
  faq_id: () => {
    const dt = new Date();
    return `FAQs-${random_num(10, 99)}${random_aph(
      random_num(2, 4)
    )}${dt.getTime()}`;
  },
  notification_id: () => {
    const dt = new Date();
    return `NOTICE-${random_num(10, 99)}${random_aph(
      random_num(2, 4)
    )}${dt.getTime()}`;
  },
  admin_id: () => {
    const dt = new Date();
    return `ADMIN-${random_num(10, 99)}${random_aph(3)}${dt.getTime()}`;
  },
  admin_name: (first_name) =>
    `${first_name}-${random_num(10, 999)}${random_aph(
      random_num(2, 4)
    )}${random_num(10, 999)}`,
};
