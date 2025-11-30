import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const ai = new GoogleGenAI({ apiKey });

export interface StreamChunk {
  text: string;
  done: boolean;
  sessionId?: string;
}

const assertEnv = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase Edge Function credentials are missing.");
  }
};

const parseChunkLine = (
  line: string
): { text: string; done: boolean; sessionId?: string } => {
  try {
    const parsed = JSON.parse(line);
    return {
      text: parsed?.text ?? "",
      done: Boolean(parsed?.done),
      sessionId: parsed?.sessionId,
    };
  } catch {
    return { text: line, done: false };
  }
};

export const streamChat = async (
  message: string,
  persona: string,
  sessionId?: string,
  isAudio?: boolean,
  audioData?: string,
  onChunk?: (chunk: StreamChunk) => void
): Promise<void> => {
  assertEnv();

  if (!message) throw new Error("message is required");
  if (!persona) throw new Error("persona is required");
  if (!onChunk) throw new Error("onChunk callback is required");

  const response = await fetch(`${supabaseUrl}/functions/v1/gemini-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      message,
      persona,
      sessionId,
      isAudio,
      audioData,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "Unable to read body");
    throw new Error(`Edge Function request failed: ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const headerSessionId = response.headers.get("x-chat-session-id") || undefined;
  let resolvedSessionId = headerSessionId || sessionId;
  let buffer = "";
  let finished = false;

  const emit = (text: string, done: boolean, chunkSessionId?: string) => {
    if (chunkSessionId && !resolvedSessionId) {
      resolvedSessionId = chunkSessionId;
    }
    onChunk({
      text,
      done,
      sessionId: resolvedSessionId ?? chunkSessionId,
    });
    if (done) finished = true;
  };

  const flushLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const { text, done, sessionId: chunkSessionId } = parseChunkLine(trimmed);
    if (text || done) {
      emit(text, done, chunkSessionId);
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    const decoded = value ? decoder.decode(value, { stream: !done }) : "";
    buffer += decoded;

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf("\n")) > -1) {
      const line = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      flushLine(line);
    }

    if (done) {
      if (buffer.trim()) flushLine(buffer);
      if (!finished) emit("", true);
      break;
    }
  }
};

export const generateJournalSummary = async (entry: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `请将以下日记内容总结为一句温暖且富有洞察力的话，送给这位同学。关注潜在的情绪。请用中文回答。日记内容: "${entry}"`,
    });
    return response.text || "暂时无法生成总结。";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "暂时无法连接到 AI。";
  }
};

export const blobToB64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const base64Content = base64data.split(",")[1];
      resolve(base64Content);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const sendAudioMessage = async (
  chat: Chat,
  audioBlob: Blob
): Promise<string> => {
  try {
    const base64Audio = await blobToB64(audioBlob);
    const audioPart = {
      inlineData: {
        mimeType: audioBlob.type,
        data: base64Audio,
      },
    };

    const response: GenerateContentResponse = await chat.sendMessage({
      message: [audioPart],
    });

    return response.text || "我好像没听清，可以再说一遍吗？";
  } catch (error) {
    console.error("Error sending audio message:", error);
    return "语音连接似乎中断了，请尝试文字输入。";
  }
};

// 临时函数：创建聊天会话（使用本地 Gemini SDK）
// 窗口3会将此替换为调用 Edge Function
export const createChatSession = (
  systemInstruction: string,
  tools?: any[]
): Chat => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    systemInstruction,
    tools,
  });
};
