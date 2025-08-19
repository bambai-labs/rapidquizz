import axios from 'axios'

export const OpenAiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
  },
})
