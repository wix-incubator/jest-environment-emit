import { resolveSubscription } from './resolveSubscription';

describe('resolveSubscription', function () {
  it('should tolerate falsy values', async function () {
    const callback = await resolveSubscription(process.cwd(), undefined as any);
    expect(callback).not.toThrow();
  });
});
