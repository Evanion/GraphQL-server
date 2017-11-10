/**
 * @jest-environment node
 */

import jwt from 'jsonwebtoken';
import createTokens from '../createTokens';

jest.genMockFromModule('jsonwebtoken');

const mockUser = {
  id: 1,
  roles: []
};

const mockSecret = 'a';
const mockSecret2 = 'b';

describe('createTokens', () => {
  it('should return an array of tokens', () => {
    expect.assertions(2);
    return createTokens(mockUser, mockSecret, mockSecret2).then(result => {
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });
});
