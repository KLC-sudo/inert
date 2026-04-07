import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      tailwindcss(),
      {
        name: 'save-content-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.method === 'POST' && req.url === '/api/save-content') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  const filePath = path.resolve(__dirname, 'content.json');
                  fs.writeFileSync(filePath, body, 'utf8');
                  res.statusCode = 200;
                  res.end('Saved successfully');
                } catch (err) {
                  res.statusCode = 500;
                  res.end('Error saving file');
                }
              });
            } else if (req.method === 'POST' && req.url?.startsWith('/api/upload-image')) {
              const url = new URL(req.url, `http://${req.headers.host}`);
              const filenameParam = url.searchParams.get('filename');

              const chunks: any[] = [];
              req.on('data', chunk => chunks.push(chunk));
              req.on('end', () => {
                try {
                  const buffer = Buffer.concat(chunks);

                  // Simple multipart parsing since we can't easily use multer in vite config without more setup
                  // We look for the file content between boundaries
                  const contentType = req.headers['content-type'] || '';
                  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

                  if (!boundaryMatch) {
                    // Fallback for raw binary if for some reason content-type isn't multipart
                    // This supports potential legacy calls or direct binary uploads
                    const filename = filenameParam || `upload-${Date.now()}.bin`;
                    saveFile(filename, buffer, res);
                    return;
                  }

                  const boundary = '--' + (boundaryMatch[1] || boundaryMatch[2]);

                  // Find the file data in the buffer
                  // This is a naive implementation for dev server purposes
                  // In production, server.js uses multer which is robust
                  const bufferString = buffer.toString('binary');
                  const parts = bufferString.split(boundary);

                  let fileContent = null;
                  let filename = filenameParam;

                  for (const part of parts) {
                    if (part.includes('Content-Disposition: form-data; name="file"')) {
                      // Extract filename if not provided in query param
                      if (!filename) {
                        const match = part.match(/filename="([^"]+)"/);
                        if (match) filename = match[1];
                      }

                      // proper body extraction
                      const bodyStartIndex = part.search(/\r\n\r\n/);
                      if (bodyStartIndex !== -1) {
                        // The end of the part has \r\n
                        const bodyEndIndex = part.lastIndexOf('\r\n');
                        if (bodyEndIndex > bodyStartIndex) {
                          // Convert back to buffer to preserve binary data
                          const binaryString = part.substring(bodyStartIndex + 4, bodyEndIndex);
                          fileContent = Buffer.from(binaryString, 'binary');
                        }
                      }
                      break;
                    }
                  }

                  if (fileContent && filename) {
                    saveFile(filename, fileContent, res);
                  } else {
                    // Fallback in case parsing failed or it was actually raw
                    const finalFilename = filenameParam || `upload-${Date.now()}`;
                    saveFile(finalFilename, buffer, res);
                  }

                } catch (err) {
                  res.statusCode = 500;
                  res.end('Error uploading file');
                }
              });

              function saveFile(filename: string, content: Buffer, res: any) {
                const uploadDir = path.resolve(__dirname, 'public/uploads');
                if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true });
                }
                const filePath = path.join(uploadDir, filename);
                fs.writeFileSync(filePath, content);
                res.statusCode = 200;
                res.end(JSON.stringify({ url: `/uploads/${filename}` }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
        '/uploads': 'http://localhost:3000'
      }
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
