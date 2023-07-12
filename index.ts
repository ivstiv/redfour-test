import Lock from "redfour";



const testLock = new Lock({
  redis: 'redis://localhost:6379',
  namespace: "my-namespace",
});

const run = async () => {
  const id = Math.random().toString();

  // First, acquire the lock.
  let firstLock;
  try {
    firstLock = await testLock.acquireLock(id, 60 * 1000 /* Lock expires after 60sec if not released */);
    if (!firstLock.success) {
      console.log('lock exists', firstLock);
    } else {
      console.log('lock acquired initially');
    }
  } catch (err) {
    console.log('error acquiring', err);
  }

  // Another server might be waiting for the lock like this. (This example is in a `setTimeout` so that
  // we can test this using a single process, though.)
  setTimeout(async () => {
    let lock;
    try {
      lock = await testLock.waitAcquireLock(id, 60 * 1000 /* Lock expires after 60sec */ , 10 * 1000 /* Wait for lock for up to 10sec */);
      if (!lock.success) {
        console.log('wait expired without acquiring lock');
      } else {
        // The lock.immediate boolean will be false in this case, but if waitAcquireLock managed to
        // acquire the lock immediately, the boolean would be true.
        console.log('lock acquired after wait!', lock);
        process.exit(0);
      }
    } catch (err) {
      console.log('error wait acquiring', err);
    }
  });

  // When the original lock is released, `waitAcquireLock` is fired on the other server.
  setTimeout(async () => {
    try {
      await testLock.releaseLock(firstLock);
      console.log('released lock (after several seconds)');
    } catch (err) {
      console.log('error releasing', err);
    }
  }, 3 * 1000);
}


run();