import type { ReactElement } from 'react';
import type { GenerateContentResponse } from '@google/genai';

export enum Role {
  User = 'user',
  Model = 'model',
}

export interface Attachment {
  data: string; // base64 data URL
  mimeType: string;
  name: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  attachment?: Attachment;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export type AiStreamChunk = GenerateContentResponse;

export enum Mode {
  Professor = 'Professor',
  Coder = 'Coder',
  Troubleshooter = 'Troubleshooter',
  Security = 'Security',
  TestCaseGenerator = 'TestCaseGenerator',
  SemanticDebugger = 'SemanticDebugger',
  CodeTranslator = 'CodeTranslator',
  ApiIntegrator = 'ApiIntegrator',
  KnowledgeBaseGenerator = 'KnowledgeBaseGenerator',
  PerformanceAnalyzer = 'PerformanceAnalyzer',
  GenerativeUiUxPrototyper = 'GenerativeUiUxPrototyper',
  SimulatedExperimentation = 'SimulatedExperimentation',
}

export interface ModeInfo {
  id: Mode;
  title: string;
  prompt: string;
  icon: ReactElement<{ className?: string }>;
  color: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  model: string; // Add model property
}