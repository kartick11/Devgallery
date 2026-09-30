import { toast } from 'react-toastify';

const handleSuccess = (msg) => {
  toast.success(msg, { position: 'top-right' });
};

const handleError = (msg) => {
  toast.error(msg, { position: 'top-right' });
};

// Bundle the functions into the utils object before exporting
const utils = {
  handleSuccess,
  handleError,
};

export default utils;