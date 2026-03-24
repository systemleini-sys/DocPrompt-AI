const ZHIPU_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';
const ZHIPU_MODEL = 'glm-5-turbo';

const STYLE_PROMPTS: Record<string, string> = {
  formal: '请将以下文档内容改写为正式、专业的风格，保持原意不变。',
  casual: '请将以下文档内容改写为通俗易懂、口语化的风格，保持原意不变。',
  academic: '请将以下文档内容改写为学术、严谨的风格，使用专业术语，保持原意不变。',
  creative: '请将以下文档内容进行创意改写，使表达更加生动有趣，保持核心原意不变。',
  concise: '请将以下文档内容精简浓缩，去除冗余，保持核心信息完整。',
  expand: '请将以下文档内容进行扩展润色，丰富细节和表达，保持原意不变。',
};

export async function rewriteDocument(content: string, style: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) throw new Error('AI API key not configured');

  const systemPrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.formal;

  const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ZHIPU_MODEL,
      messages: [
        { role: 'system', content: systemPrompt + '\n\n直接输出改写后的内容，不要添加任何解释或前言。' },
        { role: 'user', content: content },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function extractTextFromImage(imageBase64: string, mimeType: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) throw new Error('AI API key not configured');

  const response = await fetch(`${ZHIPU_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: ZHIPU_MODEL,
      messages: [
        { role: 'system', content: '你是一个专业的 OCR 文字识别助手。请精确识别图片中的所有文字内容，保持原文格式。直接输出识别结果，不要添加任何解释。' },
        { role: 'user', content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
          { type: 'text', text: '请识别这张图片中的所有文字内容。' },
        ] },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OCR API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
