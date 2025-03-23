import {initLlama} from 'llama.rn';
import {LlamaContext, RNLlamaOAICompatibleMessage, TokenData} from 'llama.rn';
import FS from 'react-native-fs2/src';

const DOWNLOAD_URL = 'https://huggingface.co/lmstudio-community/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L.gguf';
const MODEL_FILENAME = 'DeepSeek.gguf';
const MODEL_PATH = `${FS.DocumentDirectoryPath}/${MODEL_FILENAME}`;

class LlamaService {
  private context: LlamaContext | null = null;

  private async downloadModel(onProgressUpdate?: (progress: number) => void) {
    try {
      const exists = await FS.exists(MODEL_PATH);
      if (exists) return;

      const {promise} = FS.downloadFile({
        fromUrl: DOWNLOAD_URL,
        toFile: MODEL_PATH,
        begin: () => {},
        progress: status => {
          const progress = status.bytesWritten / status.contentLength;
          console.debug('Download progress:', progress);
          onProgressUpdate?.(progress);
        },
      });
      await promise;
    } catch (err) {
      console.error('Error downloading Model:', err);
    }
  }

  async initialize(onProgressUpdate?: (progress: number) => void) {
    try {
      await this.downloadModel(onProgressUpdate);
      this.context = await initLlama({
        model: MODEL_PATH,
        use_mlock: true, // force system to keep model in RAM
        n_ctx: 2048, // max number of tokens
        n_gpu_layers: 1, // > 0: enable Metal on iOS,
      });
    } catch (error) {
      console.error('Error initializing Model:', error);
    }
  }

  async completion(
    messages: RNLlamaOAICompatibleMessage[],
    onPartialCompletion: (data: TokenData) => void,
  ) {
    try {
      const res = await this.context?.completion(
        {
          messages,
          n_predict: 2048,
          ignore_eos: false,
          stop: ['<｜end▁of▁sentence｜>', '</s>'],
        },
        onPartialCompletion,
      );
      return res?.text.trim() ?? 'No results';
    } catch (err) {
      console.error('Error LLM completion:', err);
      return 'No results';
    }
  }

  async cleanup() {
    try {
      await this.context?.release();
    } catch {}
  }
}

export default new LlamaService();
