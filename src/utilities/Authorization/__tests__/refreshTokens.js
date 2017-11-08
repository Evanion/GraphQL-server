/**
 * @jest-environment node
 */

import jwt from 'jsonwebtoken';
import 'utilities/Authorization'
import refreshTokens from '../refreshTokens'


jest.genMockFromModule('jsonwebtoken');
jest.genMockFromModule('utilities/Authorization');



const mockUser = {
  id: 1,
  roles: [],
  password: 'foobar'
};
const mockModel = {
  findById: id => {
    return id === 1 ? mockUser : null
  }
};

const mockSecret = 'a';
const mockSecret2 = 'b';
const mockRefreshToken = jwt.sign({user: 1}, mockUser.password + mockSecret2, {expiresIn: '6h'});
const mockInvalidRefreshTokenSignature = jwt.sign({user: 1}, mockUser.password + mockSecret, {expiresIn: '6h'});
const mockRefreshTokenInvalidUser = jwt.sign({user: 2}, mockUser.password + mockSecret2, {expiresIn: '6h'});
const mockRefreshTokenInvalidPayload = jwt.sign({foo: 'bar'}, mockUser.password + mockSecret2, {expiresIn: '6h'});

describe('refreshTokens', () => {
  it('should return an object of tokens', () => {
    expect.assertions(2);
    return refreshTokens(mockRefreshToken, mockModel, mockSecret, mockSecret2).then(result => {
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(3)
    })
  });

  it('should reject invalid refreshTokens', () => {
    expect.assertions(2);
    return refreshTokens('not a valid JWT token', mockModel, mockSecret, mockSecret2).then(result => {
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(0)
    })
  });

  it('should reject invalid refreshToken signature', () => {
    expect.assertions(2);
    return refreshTokens(mockInvalidRefreshTokenSignature, mockModel, mockSecret, mockSecret2).then(result => {
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(0)
    })
  });

  it('should reject invalid payload', () => {
    expect.assertions(2);
    return refreshTokens(mockRefreshTokenInvalidPayload, mockModel, mockSecret, mockSecret2).then(result => {
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(0)
    })
  });

  it('should reject invalid user', () => {
    expect.assertions(2);
    return refreshTokens(mockRefreshTokenInvalidUser, mockModel, mockSecret, mockSecret2).then(result => {
      expect(typeof result).toBe('object');
      expect(Object.keys(result).length).toBe(0)
    })
  });
});

