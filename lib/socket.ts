import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
const socket = io(URL as string, { autoConnect: false, secure: true });

export default socket;
