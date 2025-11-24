import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 800,
  chunkOverlap: 100,
  separators: ['\n\n## ', '\n## ', '\n\n# ', '\n# ', '\n\n', '\n', ' ', ''],
});
