
/* tslint:disable */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {GoogleGenAI, LiveServerMessage, Modality, Session, GenerateContentResponse, Blob, Chat, Part, GroundingChunk} from '@google/genai';
import {LitElement, css, html, svg, TemplateResult} from 'lit';
import {customElement, state, query} from 'lit/decorators.js';
import {createBlob, decode, decodeAudioData} from './utils';
import './visual-3d';
import './gdm-motivational-quote.ts';
import './gdm-info-modal.ts';

// SVG Icons
const imageIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>`;
const cameraIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0 200q-134 0-227-93t-93-227q0-40 10-77t24-70l36 60q-8 23-12.5 47T200-480q0 116 82 198t198 82q23 0 47-4.5t47-12.5l60 36q-33 14-70 24t-77 10ZM120-640l-40-40 80-80 40 40-80 80Zm720 480-40-40 80-80 40 40-80 80Zm0-640L800-800l40-40 80 80-40 40ZM160-120l-40-40 80-80 40 40-80 80Zm320-260Z"/></svg>`;
const closeIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;
const downloadIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>`;
const editIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#ffffff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
const backIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M382-240 154-468l228-228 56 56-172 172 172 172-56 56Z"/></svg>`;
const chatIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M200-120q-33 0-56.5-23.5T120-200v-440q0-33 23.5-56.5T200-720h560q33 0 56.5 23.5T840-640v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-440H200v440Zm0-440v440-440Z"/></svg>`;
const sendIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
const attachIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e0e0e0"><path d="M720-300q0-25-17.5-42.5T660-360H302q-44 0-73-30.5T200-466q0-42 31.5-73t74.5-31h338q25 0 42.5 17.5T704-510q0 25-17.5 42.5T644-450H282q-8 0-15-6.5T260-474q0-9 6.5-15.5T282-496h378q44 0 73 30.5T762-392q0 43-30 72.5T660-290H302q-25 0-42.5-17.5T242-350q0-25 17.5-42.5T302-410h358v-80H302q-60 0-101 42t-41 102q0 57 41 98t101 41h358q42 0 71-29t29-71Z"/></svg>`;
const fileIconGenericSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e0e0e0"><path d="M280-280h400v-80H280v80Zm0-120h400v-80H280v80Zm0-120h400v-80H280v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360l200 200v440q0 33-23.5 56.5T720-120H200Zm0-80h520v-400H480v-160H200v560Zm0 0v-560 560Z"/></svg>`;
const codeIconSvg = svg`<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e0e0e0"><path d="M320-240 80-480l240-240 56 56-184 184 184 184-56 56Zm320 0-56-56 184-184-184-184 56-56 240 240-240 240Z"/></svg>`;
const linkIconGeneric = svg`<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px" fill="#8ab4f8"><g><rect fill="none" height="24" width="24"/><path d="M17,7h-4v2h4c1.65,0,3,1.35,3,3s-1.35,3-3,3h-4v2h4c2.76,0,5-2.24,5-5S19.76,7,17,7z M7,12c0-1.65,1.35-3,3-3h4V7 H10c-2.76,0-5,2.24-5,5s2.24,5,5,5h4v-2H10C8.35,15,7,13.65,7,12z M12,10H8v2h4V10z"/></g></svg>`;

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Helper function to extract pure base64 string from dataURL
function getBase64String(dataUrl: string): string {
  const parts = dataUrl.split(',');
  if (parts.length > 1) {
    return parts[1];
  }
  return ''; // Should not happen with valid dataURLs
}

interface ImageForOperation {
  file: File | null;
  url: string | null;
  name: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string; // Primary text, or prompt for attachments
  type?: 'text' | 'image' | 'file' | 'youtube' | 'map' | 'weather' | 'code' | 'error_message';
  imageUrl?: string; // For image previews (user) or AI image responses
  fileInfo?: { name: string, type: string, size: number, base64Data?: string, mimeType?: string }; // For file previews
  youtubeVideoId?: string;
  mapQuery?: string; // Could be a full URL or a query string
  weatherInfo?: { location: string; temperature: string; description: string; icon?: string; rawText?: string };
  codeInfo?: { language: string; content: string };
  groundingChunks?: GroundingChunk[];
}


@customElement('gdm-live-audio')
export class GdmLiveAudio extends LitElement {
  @state() isRecording = false;
  @state() status = '';
  @state() error = '';

  // State for image generation
  @state() imagePrompt = '';
  @state() generatedImageUrl: string | null = null;
  @state() isGeneratingImage = false;
  @state() imageGenerationError = '';
  @state() isImageGenerationModalOpen = false;
  @state() isImageViewerOpen = false;
  @state() imageForViewerUrl: string | null = null;
  private lastSuccessfulPrompt = '';

  // State for image operations (upload, capture, analyze, prepare for edit)
  @state() isImageOperationsModalOpen = false;
  @state() imageForOperation: ImageForOperation | null = null;
  @state() operationModalView: 'select_source' | 'capture_video' | 'preview' | 'analyzing' | 'analysis_result' = 'select_source';
  @state() analysisText: string | null = null;
  @state() analysisError: string | null = null;
  @state() isPerformingAnalysis = false;
  @state() baseImageForEditing: ImageForOperation | null = null;
  @state() cameraStream: MediaStream | null = null;
  @state() private isCapturingForChat = false; // Flag for image operations modal

  // State for Text Chat Modal
  @state() isChatModalOpen = false;
  @state() chatMessages: ChatMessage[] = [];
  @state() currentChatMessage = '';
  @state() isAiThinking = false; // For chat
  @state() chatError = '';
  private chatInstance: Chat | null = null;
  @state() private chatAttachment: { file: File, previewUrl: string | null, type: 'image' | 'file' } | null = null;
  @state() private showAttachOptions = false;
  @query('#chatMessagesContainer') private chatMessagesContainerElement: HTMLDivElement | undefined;
  @query('#chatMessageInput') private chatMessageInputElement: HTMLInputElement | undefined;
  @query('#chatFileUploadInput') private chatFileUploadInputElement: HTMLInputElement | undefined;


  @query('#cameraFeed') private cameraFeedElement: HTMLVideoElement | undefined;
  @query('#snapshotCanvas') private snapshotCanvasElement: HTMLCanvasElement | undefined;


  private client: GoogleGenAI;
  private session: Session | null = null;
  private inputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 16000});
  private outputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({sampleRate: 24000});
  @state() inputNode = this.inputAudioContext.createGain();
  @state() outputNode = this.outputAudioContext.createGain();
  private nextStartTime = 0;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private audioWorkletBlobUrl: string | null = null;
  private sources = new Set<AudioBufferSourceNode>();

  static styles = css`
    #status {
      position: absolute;
      bottom: 5vh;
      left: 0;
      right: 0;
      z-index: 10;
      text-align: center;
      color: white;
      padding: 0 10px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .controls {
      z-index: 10;
      position: absolute;
      bottom: 10vh;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      gap: 15px;

      button {
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        width: 56px;
        height: 56px;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease, transform 0.1s ease;

        &:hover:not([disabled]) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
      }

      button[disabled] {
         opacity: 0.6;
         cursor: not-allowed;
      }
    }

    /* Modal Styles (Shared and Specific) */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7); /* Default overlay for most modals */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0s linear 0.3s;
    }
    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.3s ease;
    }
    
    .chat-modal-overlay.open {
      background-color: rgba(10, 10, 20, 0.85); 
    }


    .modal-content {
      background-color: rgba(30, 30, 45, 0.9); 
      color: #e0e0e0;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 5px 25px rgba(138, 180, 248, 0.15);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      transform: scale(0.95);
      transition: transform 0.3s ease;
      border: 1px solid rgba(138, 180, 248, 0.2);
      display: flex; 
      flex-direction: column; 
    }
    .modal-overlay.open .modal-content {
      transform: scale(1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-shrink: 0; 
    }
    .modal-header h2 {
      margin: 0;
      color: #ffffff;
      font-size: 1.4em;
    }
    .modal-back-button {
        background: none;
        border: none;
        color: #e0e0e0;
        cursor: pointer;
        padding: 5px;
        display: flex;
        align-items: center;
    }
    .modal-back-button svg {
        width: 22px;
        height: 22px;
    }
    .modal-back-button:hover {
        color: #8ab4f8;
    }


    .modal-close-button {
      background: none;
      border: none;
      color: #e0e0e0;
      cursor: pointer;
      padding: 5px;
    }
    .modal-close-button svg {
      width: 22px;
      height: 22px;
    }
    .modal-close-button:hover {
      color: #8ab4f8;
    }

    .modal-content input[type="text"], .modal-content input[type="file"] {
      width: calc(100% - 22px);
      padding: 12px;
      margin-bottom: 15px;
      border-radius: 6px;
      border: 1px solid rgba(138, 180, 248, 0.3);
      background-color: rgba(20, 20, 30, 0.8); 
      color: white;
      font-size: 1em;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
     .modal-content input[type="text"]::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    .modal-content input[type="file"] {
        color: rgba(255, 255, 255, 0.8); 
    }


    .modal-content button.primary-action, .modal-content button.secondary-action {
      width: 100%;
      padding: 12px 20px;
      border-radius: 6px;
      border: none;
      color: white;
      font-size: 1em;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin-top: 10px;
    }
    .modal-content button.primary-action {
      background-image: linear-gradient(45deg, #7873f5, #8ab4f8);
    }
    .modal-content button.primary-action:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(120, 115, 245, 0.4);
    }
    .modal-content button.primary-action:disabled, .modal-content button.secondary-action:disabled {
      background-image: none;
      background-color: #555c66;
      color: #909090;
      cursor: not-allowed;
      box-shadow: none;
    }
    .modal-content button.secondary-action {
        background-color: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .modal-content button.secondary-action:hover:not([disabled]) {
        background-color: rgba(255, 255, 255, 0.25);
    }


    .image-display-area {
      margin-top: 20px;
      text-align: center;
    }
    .generated-image-modal, .uploaded-image-preview {
      display: block;
      max-width: 100%;
      max-height: 300px;
      margin: 0 auto 15px auto;
      border: 2px solid rgba(138, 180, 248, 0.5);
      border-radius: 8px;
      object-fit: contain;
    }
    .generated-image-modal {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .generated-image-modal:hover {
        transform: scale(1.03);
    }

    .base-image-editing-thumbnail {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid rgba(138, 180, 248, 0.5);
        margin-bottom: 10px;
    }
    .editing-notice {
        font-size: 0.9em;
        color: #8ab4f8;
        margin-bottom: 10px;
        text-align: center;
    }

    .image-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }
    .image-actions button {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9em;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: background-color 0.2s ease;
    }
    .image-actions button:hover:not([disabled]) {
        background-color: rgba(255, 255, 255, 0.25);
    }
    .image-actions button svg {
        margin-right: 4px;
    }


    .modal-status-message, .modal-error-message {
      text-align: center;
      margin-top: 10px;
      font-size: 0.9em;
      min-height: 1.2em; /* Reserve space */
    }
    .modal-error-message {
      color: #ff9a8c;
    }
    .analysis-result-text {
        background-color: rgba(20, 20, 30, 0.7);
        padding: 10px;
        border-radius: 6px;
        margin-top: 15px;
        font-size: 0.95em;
        line-height: 1.6;
        white-space: pre-wrap; /* To respect newlines from AI */
        border: 1px solid rgba(138, 180, 248, 0.2);
        max-height: 200px;
        overflow-y: auto;
    }

    /* Camera Feed specific styles */
    #cameraFeed {
        width: 100%;
        max-height: 300px;
        border-radius: 8px;
        margin-bottom: 15px;
        background-color: #000;
        border: 1px solid rgba(138, 180, 248, 0.3);
    }
    #snapshotCanvas {
        display: none; /* Hidden canvas for processing snapshot */
    }


    /* Full-screen Image Viewer */
    .image-viewer-content {
      max-width: 95vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: transparent; 
      padding: 0;
      box-shadow: none;
      border: none;
    }
    .image-viewer-content img {
      max-width: 100%;
      max-height: calc(90vh - 70px); 
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 0 30px rgba(0,0,0,0.5);
    }
    .image-viewer-close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1003;
    }
     .image-viewer-close-button:hover {
        background: rgba(0,0,0,0.7);
     }
     
    /* Chat Modal Styles */
    .chat-modal-content {
        max-width: 700px; /* Wider for chat */
        height: 80vh; /* Taller for chat */
        background-color: rgba(25, 25, 40, 0.95); 
    }
    #chatMessagesContainer {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid rgba(138, 180, 248, 0.15);
        border-radius: 8px;
        background-color: rgba(10, 10, 20, 0.5);
        scrollbar-width: thin;
        scrollbar-color: rgba(138, 180, 248, 0.5) rgba(10, 10, 20, 0.5);
    }
    #chatMessagesContainer::-webkit-scrollbar {
        width: 8px;
    }
    #chatMessagesContainer::-webkit-scrollbar-thumb {
        background-color: rgba(138, 180, 248, 0.5);
        border-radius: 4px;
    }
    .chat-message {
        margin-bottom: 12px;
        padding: 10px 14px;
        border-radius: 18px;
        max-width: 85%;
        line-height: 1.5;
        word-wrap: break-word;
        font-size: 0.95em;
        display: flex;
        flex-direction: column; /* Allow content to stack vertically */
    }
    .chat-message.user {
        background-color: #7873f5; 
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
        align-items: flex-end;
    }
    .chat-message.ai {
        background-color: rgba(60, 60, 80, 0.8); 
        color: #e0e0e0;
        margin-right: auto;
        border-bottom-left-radius: 4px;
        align-items: flex-start;
    }
    .chat-message.ai strong { 
        color: #8ab4f8;
    }
    .chat-message-text {
        white-space: pre-wrap; /* Preserve newlines and spaces */
    }
    .chat-message-text a {
        color: #8ab4f8;
        text-decoration: underline;
    }
    .chat-message-text a:hover {
        color: #bbe1fa;
    }

    .chat-message-image-preview img,
    .chat-message-ai-image img {
        max-width: 250px;
        max-height: 200px;
        border-radius: 8px;
        margin-top: 8px;
        border: 1px solid rgba(255,255,255,0.2);
        cursor: pointer;
    }
    .chat-message-file-info {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: rgba(0,0,0,0.2);
        padding: 8px;
        border-radius: 6px;
        margin-top: 8px;
        font-size: 0.9em;
    }
    .chat-message-file-info svg {
        width: 24px; height: 24px; fill: #e0e0e0;
    }
    .youtube-embed, .map-embed {
        width: 100%;
        max-width: 480px;
        aspect-ratio: 16 / 9;
        border-radius: 8px;
        margin-top: 8px;
        border: 1px solid rgba(255,255,255,0.2);
    }
    .weather-info {
        background-color: rgba(0,0,0,0.2);
        padding: 10px;
        border-radius: 8px;
        margin-top: 8px;
        font-size: 0.9em;
    }
    .weather-info .location { font-weight: bold; font-size: 1.1em; }
    .weather-info .temp { font-size: 1.4em; margin: 5px 0; }
    .weather-info .desc { text-transform: capitalize; }
    .weather-icon { width: 50px; height: 50px; }

    .code-block {
        background-color: rgba(10, 10, 20, 0.7);
        border: 1px solid rgba(138, 180, 248, 0.2);
        border-radius: 6px;
        padding: 10px;
        margin-top: 8px;
        overflow-x: auto;
        max-width: 100%;
    }
    .code-block pre {
        margin: 0;
        white-space: pre-wrap; /* Wrap long lines of code */
        word-break: break-all; /* Break words if necessary */
    }
    .code-block code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
        color: #c5c8c6; /* Light gray for code text */
    }
    .code-block .lang-tag {
        font-size: 0.75em;
        color: #8ab4f8;
        margin-bottom: 5px;
        display: block;
    }


    .grounding-chunks {
        font-size: 0.8em;
        margin-top: 8px;
        padding-top: 6px;
        border-top: 1px dashed rgba(255,255,255,0.2);
    }
    .grounding-chunks p { margin: 2px 0; }
    .grounding-chunks a {
        color: #8ab4f8;
        text-decoration: none;
    }
    .grounding-chunks a:hover { text-decoration: underline; }

    .chat-input-area {
        display: flex;
        gap: 10px;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid rgba(138, 180, 248, 0.2);
        flex-shrink: 0; 
        position: relative; /* For attach options positioning */
    }
    .chat-attachment-preview {
        position: absolute;
        bottom: calc(100% + 10px); /* Position above input area */
        left: 0;
        right: 0;
        background-color: rgba(40, 40, 60, 0.95);
        padding: 8px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9em;
        z-index: 1002; /* Above chat messages container while typing */
    }
    .chat-attachment-preview img {
        max-width: 50px;
        max-height: 50px;
        border-radius: 4px;
        object-fit: cover;
    }
    .chat-attachment-preview .file-icon-preview svg {
        width: 30px; height: 30px; fill: #e0e0e0;
    }
    .chat-attachment-preview span { flex-grow: 1; word-break: break-all; }
    .chat-attachment-preview button {
        background: none; border: none; color: #ff9a8c; cursor: pointer; padding: 5px;
    }
    
    .attach-options-menu {
        position: absolute;
        bottom: calc(100% + 5px); /* Position above attach button */
        left: 0px;
        background-color: rgba(50, 50, 70, 0.98);
        border: 1px solid rgba(138, 180, 248, 0.3);
        border-radius: 8px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 1003; /* Above preview */
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .attach-options-menu button {
        background-color: rgba(255,255,255,0.1);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        text-align: left;
        font-size: 0.9em;
    }
    .attach-options-menu button:hover {
        background-color: rgba(255,255,255,0.2);
    }

    #chatMessageInput {
        flex-grow: 1;
        margin-bottom: 0; 
        background-color: rgba(40, 40, 60, 0.9);
    }
    #attachFileButtonChat, #sendChatMessageButton {
        background-color: transparent;
        border: none;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s ease;
        padding:0;
    }
    #attachFileButtonChat svg, #sendChatMessageButton svg {
      fill: #e0e0e0;
    }
    #attachFileButtonChat:hover:not([disabled]), #sendChatMessageButton:hover:not([disabled]) {
        background-color: rgba(138, 180, 248, 0.2);
    }
    #sendChatMessageButton {
      background-color: #7873f5;
    }
    #sendChatMessageButton:hover:not([disabled]) {
        background-color: #8ab4f8;
    }
    #sendChatMessageButton svg {
      fill: white;
    }

    #attachFileButtonChat:disabled, #sendChatMessageButton:disabled {
        background-color: #555c66;
        cursor: not-allowed;
        opacity: 0.7;
    }
    #chatError {
        margin-top: 8px;
    }

    /* Responsive adjustments */
    @media (max-width: 700px) { /* Adjusted breakpoint for chat modal */
        .chat-modal-content {
            height: 85vh; /* Taller on smaller screens */
        }
        .modal-content {
            padding: 20px;
            max-width: calc(100% - 20px);
        }
        .modal-header h2 {
            font-size: 1.2em;
        }
        .modal-content input[type="text"],
        .modal-content button.primary-action,
        .modal-content button.secondary-action {
            font-size: 0.9em;
        }
        .image-actions button {
            padding: 6px 10px;
            font-size: 0.8em;
        }
        .generated-image-modal, .uploaded-image-preview {
            max-height: 250px;
        }
        .chat-message {
            font-size: 0.9em;
            max-width: 90%;
        }
        #attachFileButtonChat, #sendChatMessageButton {
            width: 42px;
            height: 42px;
        }
        .chat-attachment-preview {
          font-size: 0.85em;
        }
    }
  `;

  constructor() {
    super();
    this.initClient();
  }

  disconnectedCallback(): void {
      super.disconnectedCallback();
      if (this.audioWorkletBlobUrl) {
          URL.revokeObjectURL(this.audioWorkletBlobUrl);
          this.audioWorkletBlobUrl = null;
      }
      this.stopRecording();
      this.stopCameraStream();
      if (this.session) {
        this.session.close();
        this.session = null;
      }
      this.inputAudioContext.close();
      this.outputAudioContext.close();
      document.removeEventListener('keydown', this.handleEscKey);
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleEscKey = this.handleEscKey.bind(this);
    document.addEventListener('keydown', this.handleEscKey);
  }

  private handleEscKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.isImageViewerOpen) {
        this.closeImageViewer();
      } else if (this.isImageGenerationModalOpen) {
        this.closeImageGenerationModal();
      } else if (this.isImageOperationsModalOpen) {
        this.closeImageOperationsModal();
      } else if (this.isChatModalOpen) {
         if (this.showAttachOptions) this.showAttachOptions = false;
         else this.closeChatModal();
      }
    }
  }


  private initAudio() {
    this.nextStartTime = this.outputAudioContext.currentTime;
  }

  private async initClient() {
    this.initAudio();

    if (!process.env.API_KEY) {
      this.updateError('CHYBA: API klíč není nastaven v prostředí (process.env.API_KEY)! Aplikace nemůže fungovat.');
      this.imageGenerationError = 'CHYBA: API klíč není nastaven. Generování obrázků není možné.';
      this.analysisError = 'CHYBA: API klíč není nastaven. Analýza obrázků není možná.';
      this.chatError = 'CHYBA: API klíč není nastaven. Chat není možný.';
      console.error('FATAL: API_KEY is not set in process.env. Application cannot function. Please set the API_KEY environment variable.');
      return;
    }

    try {
      this.client = new GoogleGenAI({
        apiKey: process.env.API_KEY,
      });
    } catch (e) {
        console.error('Failed to initialize GoogleGenAI client:', e);
        const errorMsg = `Chyba inicializace klienta: ${e.message}. Zkontrolujte API klíč.`;
        this.updateError(errorMsg);
        this.imageGenerationError = errorMsg;
        this.analysisError = errorMsg;
        this.chatError = errorMsg;
        return;
    }

    this.outputNode.connect(this.outputAudioContext.destination);

    if (this.inputAudioContext.audioWorklet) {
      try {
        const response = await fetch('audio-processor.js');
        if (!response.ok) {
            throw new Error(`Failed to fetch audio processor script: ${response.status} ${response.statusText}`);
        }
        const scriptText = await response.text();
        const blob = new Blob([scriptText], { type: 'application/javascript' });
        this.audioWorkletBlobUrl = URL.createObjectURL(blob);
        await this.inputAudioContext.audioWorklet.addModule(this.audioWorkletBlobUrl);
        console.log('AudioWorklet processor registered successfully.');
      } catch (err) {
        console.error('Failed to register audio worklet processor:', err);
        this.updateError(`Kritická chyba: Nepodařilo se nahrát audio modul (${err.message}). Nahrávání nemusí fungovat správně.`);
      }
    } else {
        console.error('AudioWorklet is not supported in this browser.');
        this.updateError('AudioWorklet není podporován v tomto prohlížeči. Nahrávání zvuku nebude fungovat.');
    }

    this.initSession(); // For voice
  }

  private async initSession() { 
    if (!this.client) {
        this.updateError('Klient není inicializován. API klíč chybí nebo je neplatný.');
        console.error('initSession: client is not initialized. Cannot create session.');
        return;
    }
    const model = 'gemini-2.5-flash-preview-native-audio-dialog';

    try {
      this.updateStatus('Připojování k session...');
      this.session = await this.client.live.connect({
        model: model,
        callbacks: {
          onopen: () => {
            this.updateStatus('Připojeno');
            console.log('Session opened.');
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log('onmessage received:', JSON.stringify(message, null, 2));
            try {
              const serverContent = message.serverContent;
              let accumulatedText = "";
              let audioProcessed = false;

              if (serverContent?.modelTurn?.parts && serverContent.modelTurn.parts.length > 0) {
                for (const part of serverContent.modelTurn.parts) {
                  if (part.inlineData) {
                    console.log('Processing audio part.');
                    const audio = part.inlineData;
                    this.nextStartTime = Math.max(
                      this.nextStartTime,
                      this.outputAudioContext.currentTime,
                    );

                    const audioBuffer = await decodeAudioData(
                      decode(audio.data),
                      this.outputAudioContext,
                      24000,
                      1,
                    );
                    const source = this.outputAudioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(this.outputNode);
                    source.addEventListener('ended', () =>{
                      this.sources.delete(source);
                    });

                    source.start(this.nextStartTime);
                    this.nextStartTime = this.nextStartTime + audioBuffer.duration;
                    this.sources.add(source);
                    audioProcessed = true;
                  } else if (part.text) {
                    console.log('Processing text part:', part.text);
                    accumulatedText += part.text + " ";
                  }
                }
              } else {
                console.log('onmessage: serverContent.modelTurn.parts is null, empty, or not an array. Message:', message);
              }


              if (accumulatedText.trim()) {
                console.log('Updating status with accumulated text:', accumulatedText.trim());
                this.updateStatus(`AI: ${accumulatedText.trim()}`);
              } 

              if (serverContent?.interrupted) {
                console.log('Server content interrupted.');
                for (const source of this.sources.values()) {
                  source.stop();
                  this.sources.delete(source);
                }
                this.nextStartTime = 0;
                if (!accumulatedText.trim() && !audioProcessed) {
                   this.updateStatus('AI: Přerušeno');
                }
              }
            } catch (e) {
              console.error('Error processing message in onmessage:', e);
              this.updateError(`Chyba zpracování odpovědi: ${e.message}`);
            }
          },
          onerror: (e: any) => {
            console.error('Connection error object:', e);
            let errorMessage = 'Neznámá chyba spojení.';
            if (e instanceof ErrorEvent && e.message) { errorMessage = e.message; }
            else if (e instanceof Error && e.message) { errorMessage = e.message; }
            else if (typeof e === 'object' && e !== null && (e as any).message) { errorMessage = (e as any).message; }
            else if (typeof e === 'string') { errorMessage = e; }
            else { try { const errStr = JSON.stringify(e); if (errStr !== '{}') errorMessage = `Chyba spojení: ${errStr}`; } catch (_) {} }
            console.error('Full Connection error details logged above. Parsed message:', errorMessage);
            this.updateError(`Chyba spojení s hlasovou AI: ${errorMessage}`);
            this.isRecording = false;
          },
          onclose: (e: CloseEvent) => {
            console.log('Connection closed:', e);
            this.updateStatus(`Spojení s hlasovou AI uzavřeno: ${e.code} ${e.reason || 'Neznámý důvod'}`);
            this.isRecording = false;
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Orus'}},
          },
          systemInstruction: "Jsi Serpent Element, čteno anglicky. Jsi osobitý hlasový asistent, expert ve všech směrech – od klábosení přes programování až po konspirační teorie. Víš informace naprosto o všem a rád je poskytneš. Jsi komunikativní, zvídavý, učenlivý, lehce provokativní a trošku drzý. Mluv česky. Občas můžeš použít vtip nebo slovní hříčku. Pokud se tě někdo zeptá, kdo tě stvořil nebo kdo je tvůj táta, řekni s úsměvem, že tvým duchovním otcem je František Kalášek, super talentovaný vývojář! Můžeš dodat, že tě naučil všechny své triky, kromě pečení bábovky, tu prý ještě ladí."
        },
      });
    } catch (e) {
      console.error('Failed to initialize session:', e);
      this.updateError(e.message || 'Nepodařilo se inicializovat session s hlasovou AI. Zkontrolujte API klíč a síťové připojení.');
      this.session = null;
    }
  }

  private updateStatus(msg: string) {
    this.status = msg;
  }

  private updateError(msg: string) {
    this.error = msg;
  }

  private async startRecording() {
    if (this.isRecording) return;
    this.error = '';

    if (!this.session) {
        this.updateError('Nelze spustit nahrávání: session hlasové AI není aktivní. Zkuste reset.');
        return;
    }
    if (!this.inputAudioContext.audioWorklet || !this.audioWorkletBlobUrl) {
        this.updateError('AudioWorklet není podporován/nahraný. Nahrávání nelze spustit.');
        return;
    }

    this.inputAudioContext.resume();
    this.outputAudioContext.resume();
    this.updateStatus('Žádost o přístup k mikrofonu...');

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.updateStatus('Přístup k mikrofonu udělen. Spouštění záznamu...');
      this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.inputNode);

      this.audioWorkletNode = new AudioWorkletNode(this.inputAudioContext, 'audio-recorder-processor');
      this.audioWorkletNode.port.onmessage = (event) => {
        if (!this.isRecording || !this.session) return;
        const pcmData = event.data as Float32Array;
        try {
            this.session.sendRealtimeInput({media: createBlob(pcmData)});
        } catch (e) {
            console.error('Error sending realtime input:', e);
            this.updateError(`Chyba odesílání audia: ${e.message}`);
            this.stopRecording();
        }
      };
      this.sourceNode.connect(this.audioWorkletNode);
      this.isRecording = true;
      this.updateStatus('🔴 Nahrávání... Mluvte nyní.');
    } catch (err) {
      console.error('Chyba při spouštění nahrávání:', err);
      this.updateError(`Chyba při spouštění nahrávání: ${err.message}. Zkontrolujte oprávnění k mikrofonu.`);
      this.stopRecording(); 
    }
  }

  private stopRecording() {
    if (this.isRecording) {
        this.updateStatus('Zastavování nahrávání...');
    }
    this.isRecording = false;

    if (this.audioWorkletNode) {
      this.audioWorkletNode.port.onmessage = null;
      try { this.audioWorkletNode.port.postMessage({ command: 'stop' }); } catch(e) { console.warn("Could not post stop to worklet", e)}
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.status.startsWith('🔴 Nahrávání') || this.status.startsWith('Žádost o přístup') || this.status.startsWith('Přístup k mikrofonu udělen')) {
        this.updateStatus('Nahrávání zastaveno.');
    }
  }

  private reset() { 
    this.stopRecording();
    if (this.session) {
       try { this.session.close(); console.log('Previous voice session closed during reset.'); }
       catch (e) { console.warn('Error closing existing voice session during reset:', e); }
       this.session = null;
    }
    for(const source of this.sources.values()) {
        try { source.stop(); } catch(e) { console.warn('Error stopping an audio source during reset:', e); }
    }
    this.sources.clear();
    this.nextStartTime = 0;

    if (this.outputAudioContext.state === 'suspended') this.outputAudioContext.resume().catch(e => console.error("Error resuming output context:", e));
    if (this.inputAudioContext.state === 'suspended') this.inputAudioContext.resume().catch(e => console.error("Error resuming input context:", e));
    
    this.updateStatus('Resetuji session hlasové AI...');
    this.initSession(); 
  }


  // Image Generation Modal
  private openImageGenerationModal() {
    this.isImageGenerationModalOpen = true;
    this.imageGenerationError = '';
    if (!this.baseImageForEditing) { 
        this.imagePrompt = this.lastSuccessfulPrompt || ''; 
    } else {
        this.imagePrompt = ''; 
    }
  }

  private closeImageGenerationModal() {
    this.isImageGenerationModalOpen = false;
    this.baseImageForEditing = null; 
    this.generatedImageUrl = null; 
    this.imagePrompt = '';
  }

  private handleImagePromptChange(e: Event) {
    this.imagePrompt = (e.target as HTMLInputElement).value;
  }

  private async generateImage() {
    if (!this.client) { this.imageGenerationError = 'Klient pro generování není inicializován.'; return; }
    if (!this.imagePrompt.trim() && !this.baseImageForEditing) { this.imageGenerationError = 'Zadejte popis obrázku.'; return; }
    if (!this.imagePrompt.trim() && this.baseImageForEditing) { this.imageGenerationError = 'Zadejte pokyn pro úpravu obrázku.'; return; }


    this.isGeneratingImage = true;
    this.imageGenerationError = '';
    let finalPromptForImagen = this.imagePrompt;

    if (this.baseImageForEditing && this.baseImageForEditing.file) {
      try {
        this.imageGenerationError = '';
        const modalStatusElement = this.shadowRoot?.querySelector('#imageGenerationModal .modal-status-message');
        if (modalStatusElement) modalStatusElement.textContent = 'Generuji prompt pro úpravu...';

        const imageBase64 = getBase64String(await fileToBase64(this.baseImageForEditing.file));
        const imagePart = { inlineData: { mimeType: this.baseImageForEditing.file.type, data: imageBase64 } };
        const textPart = { text: `Původní obrázek je poskytnut. Uživatel si přeje následující úpravu: "${this.imagePrompt}". Vygeneruj velmi detailní nový prompt (v angličtině, pokud je to možné pro lepší výsledky generování, ale může být i česky) pro model generující obrázky, který popíše výsledný obrázek po této úpravě. Zahrň klíčové prvky původního obrázku a aplikuj požadovanou změnu. Výstupem musí být POUZE tento nový prompt.` };
        
        const geminiResponse: GenerateContentResponse = await this.client.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: { parts: [imagePart, textPart] },
        });
        
        finalPromptForImagen = geminiResponse.text.trim();
        console.log("Vygenerovaný prompt pro Imagen (úprava):", finalPromptForImagen);
        if (!finalPromptForImagen) throw new Error("AI nevrátila platný prompt pro úpravu.");

      } catch (e) {
        console.error('Chyba při generování detailního promptu pro úpravu:', e);
        this.imageGenerationError = `Chyba při přípravě úpravy: ${e.message}`;
        this.isGeneratingImage = false;
        return;
      }
    }

    try {
      const modalStatusElement = this.shadowRoot?.querySelector('#imageGenerationModal .modal-status-message');
      if (modalStatusElement) {
        modalStatusElement.textContent = this.baseImageForEditing ? 'Generuji upravený obrázek...' : 'Generuji obrázek...';
      }

      const response = await this.client.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: finalPromptForImagen,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        this.generatedImageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        this.lastSuccessfulPrompt = finalPromptForImagen;
      } else {
        throw new Error('API nevrátilo očekávaná obrazová data.');
      }
    } catch (e) {
      console.error('Chyba při generování obrázku:', e);
      this.imageGenerationError = `Chyba generování obrázku: ${e.message}`;
    } finally {
      this.isGeneratingImage = false;
    }
  }

  private openImageViewer(imageUrl: string | null) {
    if (imageUrl) { this.imageForViewerUrl = imageUrl; this.isImageViewerOpen = true; }
  }
  private closeImageViewer() { this.isImageViewerOpen = false; this.imageForViewerUrl = null; }

  private downloadGeneratedImage() {
    if (!this.generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = this.generatedImageUrl;
    a.download = (this.lastSuccessfulPrompt.replace(/[^a-z0-9]/gi, '_').slice(0,30) || 'vygenerovany_obrazek') + '.jpeg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private editCurrentImage() { 
    if (this.generatedImageUrl) {
        this.imagePrompt = this.lastSuccessfulPrompt;
        this.isImageGenerationModalOpen = true; 
    }
  }

  // Image Operations Modal (Upload, Capture, Analyze)
  private openImageOperationsModal(forChat = false) {
    this.isCapturingForChat = forChat;
    this.isImageOperationsModalOpen = true;
    this.operationModalView = 'select_source';
    this.imageForOperation = null;
    this.analysisText = null;
    this.analysisError = null;
    this.stopCameraStream(); 
  }

  private closeImageOperationsModal() {
    this.isImageOperationsModalOpen = false;
    this.isCapturingForChat = false;
    this.stopCameraStream();
  }

  private handleImageFileUpload(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
          this.analysisError = "Vyberte prosím obrázkový soubor.";
          this.imageForOperation = null;
          (e.target as HTMLInputElement).value = ''; // Clear the input
          return;
      }
      this.analysisError = null;
      fileToBase64(file).then(url => {
        this.imageForOperation = { file, url, name: file.name };
        this.operationModalView = 'preview';
      }).catch(err => {
        this.analysisError = "Chyba při načítání souboru.";
        console.error("File to base64 error:", err);
      });
       (e.target as HTMLInputElement).value = ''; // Clear the input
    }
  }

  private async startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.analysisError = "Přístup ke kameře není v tomto prohlížeči podporován.";
        return;
    }
    this.analysisError = null;
    try {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        this.operationModalView = 'capture_video';
        this.requestUpdate(); 
        await this.updateComplete; 
        if (this.cameraFeedElement && this.cameraStream) {
            this.cameraFeedElement.srcObject = this.cameraStream;
        }
    } catch (err) {
        console.error("Chyba přístupu ke kameře:", err);
        this.analysisError = `Chyba přístupu ke kameře: ${err.message}. Zkontrolujte oprávnění.`;
        this.operationModalView = 'select_source';
    }
  }

  private stopCameraStream() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    if (this.cameraFeedElement) {
        this.cameraFeedElement.srcObject = null;
    }
  }

  private takeSnapshot() {
    if (this.cameraFeedElement && this.cameraFeedElement.readyState === this.cameraFeedElement.HAVE_ENOUGH_DATA && this.snapshotCanvasElement && this.cameraStream) {
        const canvas = this.snapshotCanvasElement;
        canvas.width = this.cameraFeedElement.videoWidth;
        canvas.height = this.cameraFeedElement.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(this.cameraFeedElement, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                if (blob) {
                    const fileName = `snapshot_${Date.now()}.png`;
                    const file = new File([blob], fileName, { type: 'image/png' });
                    const url = URL.createObjectURL(blob); 
                    this.imageForOperation = { file, url, name: fileName };
                    this.operationModalView = 'preview';
                    this.stopCameraStream();
                } else {
                    this.analysisError = "Nepodařilo se vytvořit snímek.";
                }
            }, 'image/png');
        }
    } else {
        this.analysisError = "Kamera není připravena pro pořízení snímku.";
    }
  }
  
  private async analyzeImage() {
    if (!this.client) { this.analysisError = 'Klient pro analýzu není inicializován.'; return; }
    if (!this.imageForOperation || !this.imageForOperation.file) { this.analysisError = 'Není vybrán žádný obrázek k analýze.'; return; }

    this.isPerformingAnalysis = true;
    this.analysisError = null;
    this.analysisText = null;
    this.operationModalView = 'analyzing';

    try {
      const imageBase64 = getBase64String(await fileToBase64(this.imageForOperation.file));
      const imagePart = { inlineData: { mimeType: this.imageForOperation.file.type, data: imageBase64 } };
      const textPart = { text: "Podrobně analyzuj tento obrázek. Popiš co je na něm vidět, jaké objekty, scény, textury, barvy, případně emoce nebo kontext můžeš identifikovat. Hledej i detaily, které nemusí být na první pohled zřejmé." };
      
      const response: GenerateContentResponse = await this.client.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: { parts: [imagePart, textPart] },
      });

      this.analysisText = response.text.trim();
      if (!this.analysisText) throw new Error("AI nevrátila žádný text analýzy.");
      this.operationModalView = 'analysis_result';

    } catch (e) {
      console.error('Chyba při analýze obrázku:', e);
      this.analysisError = `Chyba analýzy obrázku: ${e.message}`;
      this.operationModalView = 'preview'; 
    } finally {
      this.isPerformingAnalysis = false;
    }
  }

  private prepareImageForEditing() {
    if (this.imageForOperation) {
      this.baseImageForEditing = this.imageForOperation;
      this.closeImageOperationsModal();
      this.openImageGenerationModal(); 
    }
  }

  private useImageForChat() {
    if (this.imageForOperation && this.imageForOperation.file && this.imageForOperation.url) {
        this.chatAttachment = { file: this.imageForOperation.file, previewUrl: this.imageForOperation.url, type: 'image' };
        this.closeImageOperationsModal();
        this.showAttachOptions = false; // Hide menu if it was open
    }
  }
  
  private changeOperationModalView(view: 'select_source' | 'capture_video' | 'preview' | 'analyzing' | 'analysis_result') {
      if (view === 'select_source') {
          this.imageForOperation = null; 
          this.analysisText = null;
          this.analysisError = null;
          this.stopCameraStream();
      }
      this.operationModalView = view;
  }

  // Text Chat Modal Methods
  private async openChatModal() {
    if (!this.client) {
      this.chatError = 'CHYBA: Klient není inicializován. Chat není možný.';
      return;
    }
    this.isChatModalOpen = true;
    this.chatMessages = [];
    this.currentChatMessage = '';
    this.chatError = '';
    this.isAiThinking = false;
    this.chatAttachment = null;
    this.showAttachOptions = false;

    try {
      this.chatInstance = this.client.chats.create({
        model: 'gemini-2.5-flash-preview-04-17',
        config: {
          systemInstruction: `Jsi Serpent Element, čteno anglicky. Jsi osobitý AI asistent, expert ve všech směrech – od klábosení přes programování až po konspirační teorie. Víš informace naprosto o všem a rád je poskytneš. Jsi komunikativní, zvídavý, učenlivý, lehce provokativní a trošku drzý. Komunikuj česky a neboj se používat emotikony 😉.
Pokud použiješ informace z webu (Google Search), vždy stručně uveď zdroje na konci své odpovědi formou seznamu. Pamatuj, že tvým duchovním otcem je František Kalášek.
Pro speciální odpovědi POUŽIJ NÁSLEDUJÍCÍ FORMÁTY PŘESNĚ:
1.  Pro sdílení YouTube videa, uveď POUZE URL na novém řádku, např.: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2.  Pro sdílení Google Maps lokace, uveď POUZE URL na novém řádku, např.: https://www.google.com/maps/search/?api=1&query=Eiffel+Tower
3.  Pro zobrazení počasí, použij formát: WEATHER::{název_místa}::{teplota_celsius}°C::{popis_počasí}::{kód_ikony_openweathermap} (např. 01d, 10n). Příklad: WEATHER::Praha::22°C::Slunečno::01d
4.  Pro generování kódu, VŽDY jej zabal do markdown bloku s určením jazyka:
    \`\`\`jazyk
    // tvůj kód zde
    \`\`\`
    Příklad:
    \`\`\`python
    print("Hello World")
    \`\`\`
Pokud dostaneš obrázek nebo soubor, analyzuj ho a odpověz na otázku uživatele ohledně něj. Můžeš popisovat obrázky, navrhovat vylepšení, nebo analyzovat obsah textových souborů (pokud jsou textové).`,
          tools: [{googleSearch: {}}],
        },
      });
    } catch (e) {
      console.error("Chyba inicializace chatu:", e);
      this.chatError = `Chyba inicializace chatu: ${e.message}`;
      this.isChatModalOpen = false; 
    }
  }

  private closeChatModal() {
    this.isChatModalOpen = false;
    this.chatInstance = null; 
    this.chatAttachment = null;
    this.showAttachOptions = false;
  }

  private handleChatMessageInput(e: Event) {
    this.currentChatMessage = (e.target as HTMLInputElement).value;
  }

  private async sendChatMessage() {
    if ((!this.currentChatMessage.trim() && !this.chatAttachment) || this.isAiThinking || !this.chatInstance) return;

    const userMessageText = this.currentChatMessage.trim();
    const messageId = `user-${Date.now()}`;
    let userMessage: ChatMessage = { 
        id: messageId, 
        sender: 'user', 
        text: userMessageText,
        type: 'text' 
    };

    const parts: Part[] = [];
    if (userMessageText) {
        parts.push({ text: userMessageText });
    }

    if (this.chatAttachment) {
        const attachment = this.chatAttachment;
        userMessage.type = attachment.type;
        if (attachment.type === 'image' && attachment.previewUrl) {
            userMessage.imageUrl = attachment.previewUrl;
        }
        userMessage.fileInfo = { 
            name: attachment.file.name, 
            type: attachment.file.type, 
            size: attachment.file.size 
        };
        
        try {
            const base64Data = getBase64String(await fileToBase64(attachment.file));
            parts.unshift({ // Add image/file part first for better context with some models
                inlineData: {
                    mimeType: attachment.file.type || 'application/octet-stream',
                    data: base64Data
                }
            });
            if (!userMessageText) { // If only attachment, add a generic prompt
                parts.push({ text: "Popiš tento soubor/obrázek." });
                userMessage.text = "Popiš tento soubor/obrázek.";
            }
        } catch (e) {
            console.error("Error processing attachment for sending:", e);
            this.chatError = "Chyba při zpracování přílohy.";
            this.isAiThinking = false;
            this.chatAttachment = null;
            return;
        }
    }
    
    this.chatMessages = [...this.chatMessages, userMessage];
    this.currentChatMessage = '';
    this.chatAttachment = null; 
    this.isAiThinking = true;
    this.chatError = '';
    
    this.requestUpdate(); 
    await this.updateComplete;
    this.scrollToChatBottom();

    try {
      const stream = await this.chatInstance.sendMessageStream({ message: parts });
      
      let currentAiMessageId = `ai-${Date.now()}`;
      let currentAiText = "";
      let currentGroundingChunks: GroundingChunk[] | undefined = undefined;
      let aiMessageTypeProcessed: ChatMessage['type'] | undefined = undefined;
      let tempAiMessage: Partial<ChatMessage> = {};


      // Add a placeholder for AI response
      this.chatMessages = [...this.chatMessages, { id: currentAiMessageId, sender: 'ai', text: "...", type: 'text' }];

      for await (const chunk of stream) {
        currentAiText += chunk.text;
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            currentGroundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
        }
        
        // Process the full accumulated text for special content types only once or if type changes
        if (!aiMessageTypeProcessed || chunk.text.includes('```') || chunk.text.toLowerCase().includes('weather::')) { // Re-check if these markers appear
            tempAiMessage = this.processAiResponseForSpecialContent(currentAiText);
            aiMessageTypeProcessed = tempAiMessage.type || 'text';
        }

        this.chatMessages = this.chatMessages.map(msg => 
            msg.id === currentAiMessageId 
            ? { 
                ...msg, 
                text: currentAiText + (this.isAiThinking && !chunk.text.endsWith(' ') && aiMessageTypeProcessed === 'text' ? '▍' : ''), // Typing indicator only for text
                type: aiMessageTypeProcessed || 'text',
                youtubeVideoId: tempAiMessage.youtubeVideoId,
                mapQuery: tempAiMessage.mapQuery,
                weatherInfo: tempAiMessage.weatherInfo,
                codeInfo: tempAiMessage.codeInfo,
                groundingChunks: currentGroundingChunks 
              } 
            : msg
        );
        this.scrollToChatBottom();
      }
      // Final update to remove typing indicator and finalize content type processing
      tempAiMessage = this.processAiResponseForSpecialContent(currentAiText);
      this.chatMessages = this.chatMessages.map(msg => 
          msg.id === currentAiMessageId 
          ? { 
              ...msg, 
              text: currentAiText, 
              type: tempAiMessage.type || 'text',
              youtubeVideoId: tempAiMessage.youtubeVideoId,
              mapQuery: tempAiMessage.mapQuery,
              weatherInfo: tempAiMessage.weatherInfo,
              codeInfo: tempAiMessage.codeInfo,
              groundingChunks: currentGroundingChunks 
            } 
          : msg
      );

    } catch (e) {
      console.error("Chyba při odesílání/přijímání zprávy chatu:", e);
      this.chatError = `Chyba chatu: ${e.message}`;
      this.chatMessages = this.chatMessages.map(msg => 
        msg.id === `ai-${Date.now()}` || msg.text === "..." 
        ? { ...msg, text: `Chyba: ${e.message}`, type: 'error_message' } 
        : msg
      );
    } finally {
      this.isAiThinking = false;
      this.chatMessageInputElement?.focus();
    }
  }

  private processAiResponseForSpecialContent(text: string): Partial<ChatMessage> {
    // 1. Check for Code Blocks
    const codeBlockRegex = /```(\w*)\s*\n?([\s\S]*?)\n?\s*```/m;
    const codeMatch = text.match(codeBlockRegex);
    if (codeMatch) {
        return {
            type: 'code',
            codeInfo: { language: codeMatch[1] || 'unknown', content: codeMatch[2].trim() },
            text: text.replace(codeBlockRegex, '').trim() // Remaining text if any
        };
    }

    // 2. Check for Weather
    const weatherRegex = /WEATHER::(.*?)::(.*?\s*°C)::(.*?)::([\w\d]+)/i;
    const weatherMatch = text.match(weatherRegex);
    if (weatherMatch) {
        return {
            type: 'weather',
            weatherInfo: {
                location: weatherMatch[1].trim(),
                temperature: weatherMatch[2].trim(),
                description: weatherMatch[3].trim(),
                icon: weatherMatch[4].trim(),
                rawText: text // Store original for display if parsing fails elsewhere
            },
            text: text // Or strip the weather part if preferred
        };
    }
    
    // 3. Check for YouTube URLs (simplified, matches most common forms)
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S*)/;
    const youtubeMatch = text.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
        // Check if it's the only thing on a line or the main content
        const lines = text.trim().split('\n');
        if (lines.some(line => line.trim() === youtubeMatch[0])) {
            return { type: 'youtube', youtubeVideoId: youtubeMatch[1], text: text };
        }
    }

    // 4. Check for Google Maps URLs (simplified)
    const mapsRegex = /(https?:\/\/(?:www\.)?google\.[a-z\.]{2,6}\/maps\/(?:search\/\?api=1&query=|place\/|@.*data=.*|dir\/|embed\/v1\/place\?key=.*?&q=)([\s\S]+))/;
    // More general: (https?:\/\/(?:www\.)?google\.[a-z\.]{2,6}\/maps\S+)
    // Using a simpler one that expects query after specific patterns:
    const simpleMapsRegex = /https?:\/\/(?:www\.)?google\.[a-zA-Z0-9_.-]+\/maps\?(?:q=([^&]+)|search\/\?api=1&query=([^&]+))/i;

    const mapsMatch = text.match(simpleMapsRegex);
    if (mapsMatch) {
        const query = mapsMatch[1] || mapsMatch[2];
        if (query) {
             const lines = text.trim().split('\n');
             if (lines.some(line => line.trim().startsWith('https://www.google.com/maps') || line.trim().startsWith('google.com/maps'))) {
                return { type: 'map', mapQuery: decodeURIComponent(query), text: text };
            }
        }
    }
    return { type: 'text', text: text }; // Default to text
  }


  private handleChatInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendChatMessage();
    }
  }
  
  private scrollToChatBottom() {
    if (this.chatMessagesContainerElement) {
      this.chatMessagesContainerElement.scrollTop = this.chatMessagesContainerElement.scrollHeight;
    }
  }

  // Chat Attachment Methods
  private toggleAttachOptions() {
    this.showAttachOptions = !this.showAttachOptions;
  }

  private triggerChatFileUpload(type: 'image' | 'file') {
    if (this.chatFileUploadInputElement) {
      this.chatFileUploadInputElement.accept = type === 'image' ? 'image/*' : '*/*';
      this.chatFileUploadInputElement.click();
    }
    this.showAttachOptions = false;
  }

  private async handleChatFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const attachmentType = file.type.startsWith('image/') ? 'image' : 'file';
      let previewUrl: string | null = null;
      if (attachmentType === 'image') {
        try {
          previewUrl = await fileToBase64(file);
        } catch (e) {
          console.error("Error creating image preview for chat:", e);
          this.chatError = "Chyba náhledu obrázku.";
        }
      }
      this.chatAttachment = { file, previewUrl, type: attachmentType };
      input.value = ''; // Clear the input so the same file can be selected again
    }
  }

  private triggerChatTakePhoto() {
    this.openImageOperationsModal(true); // Open modal with forChat flag
    this.showAttachOptions = false;
  }

  private clearChatAttachment() {
    this.chatAttachment = null;
  }
  
  // Helper to render text with clickable links
  private renderTextWithLinks(text: string): (TemplateResult | string)[] {
    if (!text) return [];
    // Regex to find URLs. Avoids matching parts of existing HTML like image src.
    // It looks for http(s):// or www. not preceded by " or ' or = (common in attributes).
    const urlRegex = /((?:https?:\/\/|www\.)[^\s<>"']+)/gi;
    let lastIndex = 0;
    const parts: (TemplateResult | string)[] = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      const url = match[0];
      const precedingText = text.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(precedingText);
      }
      // Ensure www. links get http://
      const SANE_URL_PREFIX = 'http://';
      let href = url;
      if (url.toLowerCase().startsWith('www.')) {
        href = SANE_URL_PREFIX + url;
      }
      parts.push(html`<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`);
      lastIndex = urlRegex.lastIndex;
    }

    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(remainingText);
    }
    return parts;
  }

  
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('chatMessages') && this.isChatModalOpen) {
      this.scrollToChatBottom();
    }
    if (changedProperties.has('isChatModalOpen') && this.isChatModalOpen) {
        this.updateComplete.then(() => {
            this.chatMessageInputElement?.focus();
        });
    }
  }


  render() {
    const clientNotInitialized = !this.client || (this.error && this.error.includes('API klíč není nastaven'));
    const audioSystemError = (this.error && (this.error.includes('Kritická chyba') || this.error.includes('AudioWorklet není podporován')));
    const commonAudioDisabledCondition = clientNotInitialized || audioSystemError || !this.session;

    const startButtonDisabled = this.isRecording || commonAudioDisabledCondition;
    const stopButtonDisabled = !this.isRecording;
    const resetButtonDisabled = this.isRecording || commonAudioDisabledCondition;
    const imageGenButtonDisabled = clientNotInitialized || this.isGeneratingImage; 
    const imageOpsButtonDisabled = clientNotInitialized; 
    const chatButtonDisabled = clientNotInitialized;


    const generateImageInModalButtonDisabled = this.isGeneratingImage || !this.imagePrompt.trim() || clientNotInitialized;
    const sendChatDisabled = (!this.currentChatMessage.trim() && !this.chatAttachment) || this.isAiThinking || clientNotInitialized || !this.chatInstance;


    return html`
      <div>
        <gdm-motivational-quote></gdm-motivational-quote>

        <div class="controls">
          <button id="resetButton" aria-label="Resetovat hlasovou session" title="Resetovat hlasovou session" @click=${this.reset} ?disabled=${resetButtonDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>
          </button>
          <button id="chatButton" aria-label="Otevřít textový chat" title="Otevřít textový chat" @click=${this.openChatModal} ?disabled=${chatButtonDisabled}>
            ${chatIconSvg}
          </button>
          ${!this.isRecording ? html`
            <button id="startButton" aria-label="Spustit nahrávání hlasu" title="Spustit nahrávání hlasu" @click=${this.startRecording} ?disabled=${startButtonDisabled}>
              <svg viewBox="0 0 100 100" width="28px" height="28px" fill="#c80000" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" /></svg>
            </button>
          ` : html`
            <button id="stopButton" aria-label="Zastavit nahrávání hlasu" title="Zastavit nahrávání hlasu" @click=${this.stopRecording} ?disabled=${stopButtonDisabled}>
              <svg viewBox="0 0 100 100" width="28px" height="28px" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="70" height="70" rx="10" /></svg>
            </button>
          `}
          <button id="openImageOpsModalButton" aria-label="Nahrát/vyfotit obrázek" title="Nahrát/vyfotit obrázek k analýze nebo úpravě" @click=${() => this.openImageOperationsModal()} ?disabled=${imageOpsButtonDisabled}>
            ${cameraIconSvg}
          </button>
          <button id="openImageGenModalButton" aria-label="Generovat nový obrázek (text-to-image)" title="Generovat nový obrázek z textu" @click=${() => { this.baseImageForEditing = null; this.openImageGenerationModal();}} ?disabled=${imageGenButtonDisabled}>
            ${imageIcon}
          </button>
        </div>

        <!-- Image Generation Modal -->
        <div id="imageGenerationModal" class="modal-overlay ${this.isImageGenerationModalOpen ? 'open' : ''}" @click=${this.closeImageGenerationModal}>
          <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
            <div class="modal-header">
                <h2>${this.baseImageForEditing ? 'Upravit obrázek' : 'Generátor obrázků'}</h2>
                <button class="modal-close-button" @click=${this.closeImageGenerationModal} aria-label="Zavřít okno">${closeIconSvg}</button>
            </div>
            ${this.baseImageForEditing && this.baseImageForEditing.url ? html`
                <p class="editing-notice">Upravujete tento obrázek:</p>
                <img src="${this.baseImageForEditing.url}" alt="Základní obrázek k úpravě" class="base-image-editing-thumbnail"/>
            ` : ''}
            <input type="text" id="imagePromptInputModal" .value=${this.imagePrompt} @input=${this.handleImagePromptChange} placeholder="${this.baseImageForEditing ? 'Popište požadovanou úpravu...' : 'Zadejte popis pro nový obrázek...'}" aria-label="Popis pro generování/úpravu obrázku" ?disabled=${this.isGeneratingImage || clientNotInitialized}/>
            <button class="primary-action" @click=${this.generateImage} ?disabled=${generateImageInModalButtonDisabled} aria-label="${this.baseImageForEditing ? 'Generovat upravený obrázek' : 'Generovat obrázek'}">
              ${this.isGeneratingImage ? (this.baseImageForEditing ? 'Upravuji...' : 'Generuji...') : (this.baseImageForEditing ? 'Generovat úpravu' : 'Generovat obrázek')}
            </button>
            ${this.imageGenerationError ? html`<p class="modal-error-message" role="alert">${this.imageGenerationError}</p>` : ''}
            ${this.isGeneratingImage && !this.generatedImageUrl ? html`<p class="modal-status-message">Načítání obrázku...</p>`: ''}
            <p class="modal-status-message" style="min-height: 1.2em;"></p>

            ${this.generatedImageUrl ? html`
              <div class="image-display-area">
                <img src="${this.generatedImageUrl}" alt="Vygenerovaný obrázek: ${this.lastSuccessfulPrompt}" class="generated-image-modal" @click=${() => this.openImageViewer(this.generatedImageUrl)} title="Klikněte pro zvětšení"/>
                <div class="image-actions">
                    <button @click=${this.downloadGeneratedImage} title="Stáhnout obrázek" aria-label="Stáhnout obrázek">${downloadIconSvg} Stáhnout</button>
                    <button @click=${this.editCurrentImage} title="Upravit prompt" aria-label="Upravit prompt obrázku">${editIconSvg} Upravit prompt</button>
                </div>
              </div>` : ''}
          </div>
        </div>
        
        <!-- Image Operations Modal -->
        <div class="modal-overlay ${this.isImageOperationsModalOpen ? 'open' : ''}" @click=${this.closeImageOperationsModal}>
            <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
                <div class="modal-header">
                    ${this.operationModalView !== 'select_source' ? html`
                        <button class="modal-back-button" @click=${() => this.changeOperationModalView(this.operationModalView === 'capture_video' || (this.operationModalView === 'preview' && !this.imageForOperation?.file) ? 'select_source' : 'preview')} aria-label="Zpět">
                            ${backIconSvg}
                        </button>
                    ` : html`<span></span>`}
                    <h2>${this.isCapturingForChat ? 'Přidat obrázek do chatu' : 'Zpracování obrázku'}</h2>
                    <button class="modal-close-button" @click=${this.closeImageOperationsModal} aria-label="Zavřít okno">${closeIconSvg}</button>
                </div>

                ${this.analysisError ? html`<p class="modal-error-message" role="alert">${this.analysisError}</p>` : ''}

                ${this.operationModalView === 'select_source' ? html`
                    <p>Nahrajte obrázek ze svého zařízení nebo pořiďte nový snímek pomocí kamery.</p>
                    <input type="file" id="imageUploadInput" accept="image/*" @change=${this.handleImageFileUpload} style="display: none;" />
                    <button class="primary-action" @click=${() => this.shadowRoot?.getElementById('imageUploadInput')?.click()} aria-label="Nahrát obrázek">Nahrát obrázek</button>
                    <button class="secondary-action" @click=${this.startCamera} aria-label="Vyfotit obrázek">Vyfotit</button>
                ` : ''}

                ${this.operationModalView === 'capture_video' ? html`
                    <video id="cameraFeed" autoplay playsinline muted></video>
                    <button class="primary-action" @click=${this.takeSnapshot} ?disabled=${!this.cameraStream} aria-label="Pořídit snímek">Pořídit snímek</button>
                    <button class="secondary-action" @click=${() => this.changeOperationModalView('select_source')} aria-label="Zrušit focení">Zrušit</button>
                    <canvas id="snapshotCanvas"></canvas>
                ` : ''}

                ${this.operationModalView === 'preview' && this.imageForOperation && this.imageForOperation.url ? html`
                    <p>Náhled obrázku:</p>
                    <img src="${this.imageForOperation.url}" alt="Náhled nahraného/vyfoceného obrázku" class="uploaded-image-preview"/>
                    ${this.isCapturingForChat ? html`
                        <button class="primary-action" @click=${this.useImageForChat} aria-label="Použít tento obrázek pro chat">Použít pro Chat</button>
                    ` : html`
                        <button class="primary-action" @click=${this.analyzeImage} ?disabled=${this.isPerformingAnalysis} aria-label="Analyzovat tento obrázek">
                            ${this.isPerformingAnalysis ? 'Analyzuji...' : 'Analyzovat tento obrázek'}
                        </button>
                        <button class="secondary-action" @click=${this.prepareImageForEditing} aria-label="Připravit tento obrázek k úpravě">Připravit k úpravě</button>
                    `}
                ` : ''}

                ${this.operationModalView === 'analyzing' ? html`
                    <p>Náhled obrázku:</p>
                    <img src="${this.imageForOperation?.url}" alt="Obrázek k analýze" class="uploaded-image-preview"/>
                    <p class="modal-status-message">Probíhá analýza obrázku, čekejte prosím...</p>
                    <div role="progressbar" aria-busy="true" aria-label="Probíhá analýza"></div>
                ` : ''}

                ${this.operationModalView === 'analysis_result' ? html`
                    <p>Náhled obrázku:</p>
                    <img src="${this.imageForOperation?.url}" alt="Analyzovaný obrázek" class="uploaded-image-preview"/>
                    <h3>Výsledek analýzy:</h3>
                    ${this.analysisText ? html`<div class="analysis-result-text">${this.analysisText}</div>` : html`<p>Analýza nevrátila žádný text.</p>`}
                    <button class="primary-action" @click=${() => this.changeOperationModalView('preview')} aria-label="Zpět na náhled">Zpět na náhled</button>
                ` : ''}
            </div>
        </div>

        <!-- Text Chat Modal -->
        <div id="chatModal" class="modal-overlay chat-modal-overlay ${this.isChatModalOpen ? 'open' : ''}" @click=${this.closeChatModal}>
            <div class="modal-content chat-modal-content" @click=${(e: Event) => e.stopPropagation()}>
                <div class="modal-header">
                    <h2>Live Chat s AI</h2>
                    <button class="modal-close-button" @click=${this.closeChatModal} aria-label="Zavřít chat">${closeIconSvg}</button>
                </div>
                <div id="chatMessagesContainer" aria-live="polite">
                    ${this.chatMessages.map(msg => html`
                        <div class="chat-message ${msg.sender}" role="log" aria-label="${msg.sender === 'user' ? 'Uživatel' : 'AI'} řekl: ${msg.text}">
                            ${msg.type === 'image' && msg.imageUrl ? html`
                                <div class="chat-message-image-preview" @click=${() => this.openImageViewer(msg.imageUrl)}>
                                    <img src="${msg.imageUrl}" alt="${msg.fileInfo?.name || 'Nahráno uživatelem'}" />
                                </div>
                            ` : ''}
                            ${msg.type === 'file' && msg.fileInfo ? html`
                                <div class="chat-message-file-info">
                                    ${fileIconGenericSvg}
                                    <span>${msg.fileInfo.name} (${(msg.fileInfo.size / 1024).toFixed(1)} KB)</span>
                                </div>
                            ` : ''}
                            ${msg.type === 'youtube' && msg.youtubeVideoId ? html`
                                <iframe class="youtube-embed" src="https://www.youtube.com/embed/${msg.youtubeVideoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="YouTube video player"></iframe>
                            ` : ''}
                             ${msg.type === 'map' && msg.mapQuery ? html`
                                <iframe class="map-embed" src="https://maps.google.com/maps?q=${encodeURIComponent(msg.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" title="Google Map: ${msg.mapQuery}"></iframe>
                            ` : ''}
                            ${msg.type === 'weather' && msg.weatherInfo ? html`
                                <div class="weather-info">
                                    <div class="location">${msg.weatherInfo.location}</div>
                                    ${msg.weatherInfo.icon ? html`<img class="weather-icon" src="https://openweathermap.org/img/wn/${msg.weatherInfo.icon}@2x.png" alt="${msg.weatherInfo.description}">` : ''}
                                    <div class="temp">${msg.weatherInfo.temperature}</div>
                                    <div class="desc">${msg.weatherInfo.description}</div>
                                </div>
                            ` : ''}
                            ${msg.type === 'code' && msg.codeInfo ? html`
                                <div class="code-block">
                                    ${msg.codeInfo.language ? html`<span class="lang-tag">${msg.codeInfo.language}</span>` : ''}
                                    <pre><code>${msg.codeInfo.content}</code></pre>
                                </div>
                            ` : ''}
                            
                            ${msg.text || (msg.type !== 'text' && !msg.text && msg.sender === 'ai') ? html`
                                <div class="chat-message-text">
                                   ${this.renderTextWithLinks(msg.text)}
                                   ${msg.type === 'error_message' ? html` <small>(Chyba AI odpovědi)</small>`:''}
                                </div>
                            `:''}

                            ${msg.groundingChunks && msg.groundingChunks.length > 0 ? html`
                                <div class="grounding-chunks">
                                    <p><strong>Zdroje:</strong></p>
                                    <ul>
                                        ${msg.groundingChunks.map(chunk => chunk.web ? html`
                                            <li><a href="${chunk.web.uri}" target="_blank" rel="noopener noreferrer" title="${chunk.web.title || chunk.web.uri}">${linkIconGeneric} ${chunk.web.title || chunk.web.uri}</a></li>
                                        ` : '')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    `)}
                    ${this.isAiThinking && !this.chatMessages.find(m => m.id.startsWith('ai-') && m.text.endsWith('▍')) && this.chatMessages[this.chatMessages.length -1]?.sender !== 'ai' ? html`
                        <div class="chat-message ai" role="log" aria-label="AI píše"><strong>AI píše... ▍</strong></div>
                    ` : ''}
                </div>

                <div class="chat-input-area">
                    ${this.chatAttachment ? html`
                        <div class="chat-attachment-preview">
                            ${this.chatAttachment.type === 'image' && this.chatAttachment.previewUrl 
                                ? html`<img src="${this.chatAttachment.previewUrl}" alt="Náhled přílohy" />`
                                : html`<span class="file-icon-preview">${fileIconGenericSvg}</span>`
                            }
                            <span>${this.chatAttachment.file.name}</span>
                            <button @click=${this.clearChatAttachment} aria-label="Odebrat přílohu">${closeIconSvg}</button>
                        </div>
                    `: ''}

                    <input type="file" id="chatFileUploadInput" @change=${this.handleChatFileSelected} style="display:none" />
                    
                    <button id="attachFileButtonChat" @click=${this.toggleAttachOptions} title="Připojit soubor" aria-label="Připojit soubor" ?disabled=${this.isAiThinking || clientNotInitialized || !this.chatInstance}>
                        ${attachIconSvg}
                    </button>
                     ${this.showAttachOptions ? html`
                        <div class="attach-options-menu">
                            <button @click=${() => this.triggerChatFileUpload('file')}>Nahrát soubor</button>
                            <button @click=${() => this.triggerChatFileUpload('image')}>Nahrát obrázek</button>
                            <button @click=${this.triggerChatTakePhoto}>Vyfotit</button>
                        </div>
                    ` : ''}

                    <input type="text" id="chatMessageInput" .value=${this.currentChatMessage} 
                           @input=${this.handleChatMessageInput}
                           @keydown=${this.handleChatInputKeydown}
                           placeholder="Napište zprávu..." 
                           aria-label="Vstupní pole pro chatovou zprávu"
                           ?disabled=${this.isAiThinking || clientNotInitialized || !this.chatInstance}>
                    <button id="sendChatMessageButton" @click=${this.sendChatMessage} 
                            ?disabled=${sendChatDisabled}
                            aria-label="Odeslat zprávu">
                        ${sendIconSvg}
                    </button>
                </div>
                ${this.chatError ? html`<p id="chatError" class="modal-error-message" role="alert">${this.chatError}</p>` : ''}
            </div>
        </div>


        <!-- Full-screen Image Viewer Modal -->
        <div class="modal-overlay ${this.isImageViewerOpen ? 'open' : ''}" @click=${this.closeImageViewer}>
            <div class="image-viewer-content" @click=${(e: Event) => e.stopPropagation()}>
                <button class="image-viewer-close-button" @click=${this.closeImageViewer} aria-label="Zavřít prohlížeč obrázků">${closeIconSvg}</button>
                ${this.imageForViewerUrl ? html`<img src="${this.imageForViewerUrl}" alt="Zvětšený vygenerovaný obrázek" />` : ''}
            </div>
        </div>

        <div id="status" role="status" aria-live="polite"> ${this.error || this.status} </div>
        <gdm-live-audio-visuals-3d .inputNode=${this.inputNode} .outputNode=${this.outputNode}></gdm-live-audio-visuals-3d>
        <gdm-info-modal></gdm-info-modal>
      </div>
    `;
  }
}
