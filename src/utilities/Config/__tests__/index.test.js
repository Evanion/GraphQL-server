// @flow
import Config from '../index';

const mockConfigObj = {
  backslash: '\\testing',
  backslashValue: 'testing',
  envTest: 'TEST_VALUE',
  envTestValue: 'test value',
  test: 'testValue'
};

describe('Config', () => {
  beforeEach(() => {
    Config.cfg = jest.fn(key => mockConfigObj[key]);
  });

  afterEach(() => {
    jest.fn().mockReset();
    delete Config.env[mockConfigObj.envTest];
  });

  it('should return config values from the config file', () => {
    Config.cfg.test = mockConfigObj.test;

    const value = Config.get('test');

    expect.assertions(1);
    expect(value).toBe(mockConfigObj.test);
  });

  it('should return config values from the env object', () => {
    Config.cfg.envTest = mockConfigObj.envTest;
    Config.env[mockConfigObj.envTest] = mockConfigObj.envTestValue;

    const value = Config.get('envTest');

    expect.assertions(1);
    expect(value).toBe(mockConfigObj.envTestValue);
  });

  it("should return the original config value if it doesn't exist in the env object", () => {
    Config.cfg.envTest = mockConfigObj.envTest;
    const value = Config.get('envTest');

    expect.assertions(1);
    expect(value).toBe(mockConfigObj.envTest);
  });

  it('should remove backslash from the start of a value', () => {
    Config.cfg.backslash = mockConfigObj.backslash;
    const value = Config.get('backslash');

    expect.assertions(1);
    expect(value).toBe(mockConfigObj.backslashValue);
  });
});
