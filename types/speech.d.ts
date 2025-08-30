interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

// React Markdown Component Types
import { ReactMarkdownProps } from 'react-markdown'
import { ReactNode, HTMLAttributes } from 'react'

interface MarkdownComponents {
  h1?: (props: HTMLAttributes<HTMLHeadingElement> & { node?: any }) => ReactNode
  h2?: (props: HTMLAttributes<HTMLHeadingElement> & { node?: any }) => ReactNode
  h3?: (props: HTMLAttributes<HTMLHeadingElement> & { node?: any }) => ReactNode
  h4?: (props: HTMLAttributes<HTMLHeadingElement> & { node?: any }) => ReactNode
  p?: (props: HTMLAttributes<HTMLParagraphElement> & { node?: any }) => ReactNode
  ul?: (props: HTMLAttributes<HTMLUListElement> & { node?: any }) => ReactNode
  ol?: (props: HTMLAttributes<HTMLOListElement> & { node?: any }) => ReactNode
  li?: (props: HTMLAttributes<HTMLLIElement> & { node?: any }) => ReactNode
  strong?: (props: HTMLAttributes<HTMLElement> & { node?: any }) => ReactNode
  em?: (props: HTMLAttributes<HTMLElement> & { node?: any }) => ReactNode
  code?: (props: HTMLAttributes<HTMLElement> & { node?: any; inline?: boolean }) => ReactNode
  pre?: (props: HTMLAttributes<HTMLPreElement> & { node?: any }) => ReactNode
  a?: (props: HTMLAttributes<HTMLAnchorElement> & { node?: any }) => ReactNode
  blockquote?: (props: HTMLAttributes<HTMLQuoteElement> & { node?: any }) => ReactNode
  table?: (props: HTMLAttributes<HTMLTableElement> & { node?: any }) => ReactNode
  th?: (props: HTMLAttributes<HTMLTableCellElement> & { node?: any }) => ReactNode
  td?: (props: HTMLAttributes<HTMLTableCellElement> & { node?: any }) => ReactNode
  hr?: (props: HTMLAttributes<HTMLHRElement> & { node?: any }) => ReactNode
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export { MarkdownComponents }
