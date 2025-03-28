import { toast } from "react-toastify";

export const showToast = (type, message) => {
  const config = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  if (type === "success") {
    toast.success(`${message}`, config);
  } else if (type === "error") {
    toast.error(`${message}`, config);
  } else {
    toast.info(`${message}`, config);
  }
};
