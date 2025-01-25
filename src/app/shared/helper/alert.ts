import Swal from "sweetalert2";

const showErrorAlert = (title: string, text?: string, confirmButtonText?: string) => {
  return Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: confirmButtonText,
  });
}

const showSuccessAlert = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 1200,
    showConfirmButton: false,

  });
}

const showConfirmAlert = (title: string, text?: string,btnConfirmText?:string,btnCancelText?:string) => {
  return Swal.fire({
    titleText: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: btnConfirmText ?? "Bəli",
    cancelButtonText:  btnCancelText ?? "Ləğv et",
  });
}


const showInfoAlert = (title: string, text:string, cBtn?: boolean, dBtn?: boolean, close?: string, confirm?: string, timer?: number ) => {
  return Swal.fire({
    icon: 'info',
    title: title,
    html: text ,
    showConfirmButton: cBtn,
    showDenyButton: dBtn,
    denyButtonText: close,
    confirmButtonText: confirm,
    timer: timer,
    allowOutsideClick:  false
  });
}


export {
  showErrorAlert,
  showSuccessAlert,
  showConfirmAlert,
  showInfoAlert
}
