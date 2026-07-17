const { modulesData, modulesList } = require('../../data/modules');

describe('modulesData', () => {
  it('exports an object with 5 modules', () => {
    expect(Object.keys(modulesData)).toHaveLength(5);
  });

  it('each module has required fields', () => {
    for (const id of [1, 2, 3, 4, 5]) {
      const mod = modulesData[id];
      expect(mod).toBeDefined();
      expect(mod.id).toBe(id);
      expect(mod.title).toEqual(expect.any(String));
      expect(mod.description).toEqual(expect.any(String));
      expect(mod.duration).toEqual(expect.any(String));
      expect(mod.level).toEqual(expect.any(String));
      expect(mod.topics).toEqual(expect.any(Array));
      expect(mod.challenge).toEqual(expect.any(String));
      expect(mod.videoUrl).toEqual(expect.any(String));
      expect(mod.materials).toEqual(expect.any(Array));
    }
  });

  it('module 1 is Ingeniería de Prompts', () => {
    expect(modulesData[1].title).toContain('Ingeniería');
  });

  it('module 5 is Proyecto Disruptivo', () => {
    expect(modulesData[5].title).toContain('Disruptivo');
  });
});

describe('modulesList', () => {
  it('exports an array of 5 modules', () => {
    expect(modulesList).toHaveLength(5);
  });

  it('each list entry has id, title, description, level', () => {
    for (const entry of modulesList) {
      expect(entry.id).toEqual(expect.any(Number));
      expect(entry.title).toEqual(expect.any(String));
      expect(entry.description).toEqual(expect.any(String));
      expect(entry.level).toEqual(expect.any(String));
    }
  });
});
