jest.mock('../utils/logger');

describe('requireModule', () => {
  let requireModule: any;

  beforeEach(() => {
    requireModule = jest.requireActual('./requireModule').requireModule;
  });

  it('should require a module from the given root', async () => {
    const theModule = await requireModule(process.cwd(), './package.json');
    expect(theModule).toBeDefined();
  });

  it('should return null if the module cannot be found', async () => {
    const theModule = await requireModule('.', 'non-existent');
    const { logger } = jest.requireMock('../utils/logger');
    expect(theModule).toBe(null);
    expect(logger.logger.warn).toHaveBeenCalledWith(
      expect.anything(),
      'Failed to resolve: non-existent',
    );
  });
});
