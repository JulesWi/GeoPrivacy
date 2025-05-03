const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_DB_NAME__ = mongoServer.instanceInfo.dbName;

  // Teardown function
  global.__TEARDOWN_MONGO__ = async () => {
    await mongoServer.stop();
  };
};
