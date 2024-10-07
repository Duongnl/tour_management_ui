export const handleDate = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp =
    /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng ngày");
  }
  setValue(e);
};

export const handleNameAndNumber = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L}\p{N},() ]{2,2550}$/u;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng tên");
  }
  setValue(e);
};

export const handleAddress = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp = /^[\p{L}0-9 ,.\-]{0,255}$/u;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng tên");
  }
  setValue(e);
};

export const handleName = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng tên");
  }
  setValue(e);
};

export const handleNumber = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<number>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp = /^[0-9]*$/;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
    setValue(Number(e));
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng số lượng");
  }
};

export const handlePhoneNumber = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp = /^[+]?(\d[\d\s-\.()]{7,})\d$/;

  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng số ddieenj thoaij");
  }
  setValue(e);
};

export const handleEmail = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp =
    /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng Email");
  }
  setValue(e);
};

export const handleSlug = (
  e: string,
  setValidation: (isValid: boolean) => void,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setValueError?: React.Dispatch<React.SetStateAction<string>>
) => {
  const regex: RegExp =/^[a-zA-Z\-]+$/;
  if (regex.test(e)) {
    if (setValueError) setValueError("");
    setValidation(true);
  } else {
    setValidation(false);
    if (setValueError) setValueError("Lỗi định dạng đường dẫn");
  }
  setValue(e);
};
