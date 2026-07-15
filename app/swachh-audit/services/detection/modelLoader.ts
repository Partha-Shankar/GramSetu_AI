import type { InferenceSession } from 'onnxruntime-web';

class ModelLoader {
  private session: InferenceSession | null = null;
  private loadPromise: Promise<InferenceSession | null> | null = null;

  /**
   * Lazy loads onnxruntime-web and creates an InferenceSession for the YOLO model.
   * If the model weight file is missing or browser support is lacking, it throws.
   */
  async loadModel(): Promise<InferenceSession> {
    if (typeof window === 'undefined') {
      throw new Error('ONNX Runtime can only be loaded in browser environments.');
    }

    if (this.session) {
      return this.session;
    }

    if (this.loadPromise) {
      const session = await this.loadPromise;
      if (session) return session;
    }

    this.loadPromise = (async () => {
      try {
        // Lazy-load the heavy onnxruntime-web package
        const ort = await import('onnxruntime-web');

        // Configure WASM paths to point to public assets if needed
        ort.env.wasm.numThreads = 1;
        
        const modelUrl = '/models/yolov8n.onnx';

        // Check if the model exists on the server first before downloading
        const response = await fetch(modelUrl, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`Model weights not found at ${modelUrl}`);
        }

        // Initialize the inference session
        const session = await ort.InferenceSession.create(modelUrl, {
          executionProviders: ['webgl', 'wasm'], // WebGL for GPU speed, WASM as CPU fallback
        });

        this.session = session;
        return session;
      } catch (err) {
        console.error('Failed to load ONNX model:', err);
        this.loadPromise = null; // Reset so we can retry if needed
        throw err;
      }
    })();

    const session = await this.loadPromise;
    if (!session) {
      throw new Error('Inference session was not loaded.');
    }
    return session;
  }

  /**
   * Returns whether the model is cached and ready.
   */
  isModelLoaded(): boolean {
    return this.session !== null;
  }

  /**
   * Clears the cached session from memory.
   */
  unloadModel(): void {
    this.session = null;
    this.loadPromise = null;
  }
}

export const modelLoader = new ModelLoader();
