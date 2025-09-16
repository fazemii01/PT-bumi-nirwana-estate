import weaviate from 'weaviate-client';

async function recreateChatbotSchema() {
  const client = await weaviate.connectToLocal({
    host: 'localhost',
    port: 4900,
    grpcPort: 50051,
  });

  const indexName = 'Chatbot';

  const collections = await client.collections.listAll();
  if (collections.some(c => c.name === indexName)) {
    console.log(`Deleting old collection: ${indexName}`);
    await client.collections.delete(indexName);
  }

  await client.collections.create({
    name: indexName,
    properties: [
      { name: 'text', dataType: 'text' },
      { name: 'source', dataType: 'text' },
      { name: 'file_name', dataType: 'text' }
    ],
    vectorizers: weaviate.configure.vectorizer.none(),
  });

  console.log(`Weaviate collection "${indexName}" recreated successfully.`);
}

recreateChatbotSchema().catch(console.error);