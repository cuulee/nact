const freeze = require('../freeze');
const assert = require('assert');

class AbstractPersistenceEngine {
  events (persistenceKey, offset, limit, tags) {
    throw new Error('#events() is yet implemented');
  }

  latestSnapshot (persistenceKey) {
    throw new Error('#latestSnapshot() is yet implemented');
  }

  takeSnapshot (persistedSnapshot) {
    throw new Error('#takeSnapshot() is yet implemented');
  }

  persist (persistedEvent) {
    throw new Error('#persist() is not yet implemented');
  }
}

class PersistedSnapshot {
  constructor (data, sequenceNumber, key, createdAt = new Date().getTime()) {
    if (data === null || data === undefined) {
      throw new Error('data should not be null or undefined');
    }

    // Sequence number should be a number.
    // This is an internal error if this is not the case as this is defined by the engine and hence shouldn't
    // be exposed to users of the framework
    assert(typeof (sequenceNumber) === 'number');

    this.data = data;
    this.sequenceNumber = sequenceNumber;
    this.key = key;
    this.createdAt = createdAt;

    // A snapshot should be immutable
    freeze(this);
  }
}

class PersistedEvent {
  constructor (data, sequenceNumber, key, tags = [], createdAt = new Date().getTime()) {
    // data should not be undefined or null
    if (data === null || data === undefined) {
      throw new Error('data should not be null or undefined');
    }
    // Tags should be an array of strings
    if (!tags || !(tags instanceof Array) || !(tags.reduce((isStrArray, tag) => isStrArray && typeof (tag) === 'string', true))) {
      throw new Error('tags should be a string array');
    }

    // Sequence number should be a number.
    // This is an internal error if this is not the case as this is defined by the engine and hence shouldn't
    // be exposed to users of the framework
    assert(typeof (sequenceNumber) === 'number');

    this.data = data;
    this.tags = tags.sort();
    this.sequenceNumber = sequenceNumber;
    this.key = key;
    this.createdAt = createdAt;

    // A PersistedEvent should be immutable
    freeze(this);
  }
}

module.exports = { PersistedEvent, PersistedSnapshot, AbstractPersistenceEngine };
