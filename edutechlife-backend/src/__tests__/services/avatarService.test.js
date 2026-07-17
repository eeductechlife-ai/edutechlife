const { generateAvatar } = require('../../services/avatarService');

describe('avatarService', () => {
  it('has generateAvatar function', () => {
    expect(typeof generateAvatar).toBe('function');
  });
});
