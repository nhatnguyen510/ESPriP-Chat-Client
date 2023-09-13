import { format } from "date-fns";

const useFormattedTime = (timestamp: string) => {
  let formattedTime = "";

  const currentTime = new Date().getTime();
  const messageTime = new Date(timestamp).getTime();

  const timeDifference = currentTime - messageTime;

  if (timeDifference < 24 * 60 * 60 * 1000) {
    formattedTime = format(new Date(timestamp), "h:mm a");
  } else if (timeDifference < 7 * 24 * 60 * 60 * 1000) {
    formattedTime = format(new Date(timestamp), "EEE");
  } else if (timeDifference < 365 * 24 * 60 * 60 * 1000) {
    formattedTime = format(new Date(timestamp), "MMM dd");
  } else {
    formattedTime = format(new Date(timestamp), "MM/dd/yyyy");
  }

  // check if timestamp is null
  if (!timestamp) {
    return;
  }

  return formattedTime;
};

export default useFormattedTime;
