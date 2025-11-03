import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const getChat = async () => {
  const res = await axios.get("http://127.0.0.1:8080/");
  console.log(res.data);
  return res.data;
};

export const useFetchChat = () => {
  return useQuery({
    queryKey: ["fetchChat"],
    queryFn: getChat,
  });
};

interface ChatMessagePayload {
  username: string;
  user_input: string;
  input_params: {
    data: string;
    height?: number;
    weight?: number;
    gender?: string;
    age?: number;
    training_type?: string;
    experience_level?: string;
    limitations?: string;
  };
}

const sendChatMessage = async (payload: ChatMessagePayload) => {
  const res = await axios.post("http://127.0.0.1:8080/chat", payload);
  return res.data;
};

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: sendChatMessage,
  });
};
