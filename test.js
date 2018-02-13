const test = require('tape');
const sample = require('./index');

test('it ends both listenable and sink when pullable ends', t => {
  t.plan(28);
  const upwardsExpectedListenable = [
    [0, 'function'],
    [2, 'undefined']
  ];
  const upwardsExpectedPullable = [
    [0, 'function'],
    [1, 'undefined'],
    [1, 'undefined'],
    [1, 'undefined'],
    [1, 'undefined']
  ];
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined'],
  ];
  const downwardsExpected = [10, 20, 30];

  function makePullable() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpectedPullable.shift();
      t.equals(type, e[0], 'upwards P type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards P data is expected: ' + e[1]);
      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (type === 2) {
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 30);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
    };
    return source;
  }

  function makeListenable() {
    let sent = 0;
    let id;
    const source = (type, data) => {
      const e = upwardsExpectedListenable.shift();
      t.equals(type, e[0], 'upwards L type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards L data is expected: ' + e[1]);
      if (type === 2) {
        clearInterval(id);
        return;
      }
      if (type === 0) {
        const sink = data;
        id = setInterval(() => {
          if (sent < 5) {
            sent++;
            sink(1, 'x');
            return;
          } else {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
    return source;
  }

  function makeSink() {
    let talkback;
    return (type, data) => {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
        return talkback(1);
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
        return talkback(1);
      }
    };
  }

  const pullable = makePullable();
  const listenable = makeListenable();
  const source = sample(pullable)(listenable);
  const sink = makeSink();
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it ends both listenable and pullable when sink ends', t => {
  t.plan(21);
  const upwardsExpectedListenable = [
    [0, 'function'],
    [2, 'undefined']
  ];
  const upwardsExpectedPullable = [
    [0, 'function'],
    [1, 'undefined'],
    [1, 'undefined'],
    [2, 'undefined']
  ];
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
  ];
  const downwardsExpected = [10, 20];

  function makePullable() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpectedPullable.shift();
      t.equals(type, e[0], 'upwards P type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards P data is expected: ' + e[1]);
      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (type === 2) {
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 30);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
    };
    return source;
  }

  function makeListenable() {
    let sent = 0;
    let id;
    const source = (type, data) => {
      const e = upwardsExpectedListenable.shift();
      t.equals(type, e[0], 'upwards L type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards L data is expected: ' + e[1]);
      if (type === 2) {
        clearInterval(id);
        return;
      }
      if (type === 0) {
        const sink = data;
        id = setInterval(() => {
          if (sent < 5) {
            sent++;
            sink(1, 'x');
            return;
          } else {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
    return source;
  }

  function makeSink() {
    let talkback;
    return (type, data) => {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
        return talkback(1);
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
        talkback(1);
        if (downwardsExpected.length === 0) {
          talkback(2);
        }
      }
    };
  }

  const pullable = makePullable();
  const listenable = makeListenable();
  const source = sample(pullable)(listenable);
  const sink = makeSink();
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

test('it ends both pullable and sink when listenable ends', t => {
  t.plan(21);
  const upwardsExpectedListenable = [
    [0, 'function']
  ];
  const upwardsExpectedPullable = [
    [0, 'function'],
    [1, 'undefined'],
    [1, 'undefined'],
    [2, 'undefined']
  ];
  const downwardsExpectedType = [
    [0, 'function'],
    [1, 'number'],
    [1, 'number'],
    [2, 'undefined']
  ];
  const downwardsExpected = [10, 20];

  function makePullable() {
    let _sink;
    let sent = 0;
    const source = (type, data) => {
      const e = upwardsExpectedPullable.shift();
      t.equals(type, e[0], 'upwards P type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards P data is expected: ' + e[1]);
      if (type === 0) {
        _sink = data;
        _sink(0, source);
        return;
      }
      if (type === 2) {
        return;
      }
      if (sent === 0) {
        sent++;
        _sink(1, 10);
        return;
      }
      if (sent === 1) {
        sent++;
        _sink(1, 20);
        return;
      }
      if (sent === 2) {
        sent++;
        _sink(1, 30);
        return;
      }
      if (sent === 3) {
        _sink(2);
        return;
      }
    };
    return source;
  }

  function makeListenable() {
    let sent = 0;
    let id;
    const source = (type, data) => {
      const e = upwardsExpectedListenable.shift();
      t.equals(type, e[0], 'upwards L type is expected: ' + e[0]);
      t.equals(typeof data, e[1], 'upwards L data is expected: ' + e[1]);
      if (type === 2) {
        clearInterval(id);
        return;
      }
      if (type === 0) {
        const sink = data;
        id = setInterval(() => {
          if (sent < 2) {
            sent++;
            sink(1, 'x');
            return;
          } else {
            sink(2);
            clearInterval(id);
            return;
          }
        }, 100);
        sink(0, source);
      }
    };
    return source;
  }

  function makeSink() {
    let talkback;
    return (type, data) => {
      const et = downwardsExpectedType.shift();
      t.equals(type, et[0], 'downwards type is expected: ' + et[0]);
      t.equals(typeof data, et[1], 'downwards data type is expected: ' + et[1]);
      if (type === 0) {
        talkback = data;
        return talkback(1);
      }
      if (type === 1) {
        const e = downwardsExpected.shift();
        t.equals(data, e, 'downwards data is expected: ' + e);
        talkback(1);
      }
    };
  }

  const pullable = makePullable();
  const listenable = makeListenable();
  const source = sample(pullable)(listenable);
  const sink = makeSink();
  source(0, sink);

  setTimeout(() => {
    t.pass('nothing else happens');
    t.end();
  }, 700);
});

