

var assert = require('chai').assert;
var util = require('../lib/util');
describe('util', function() {
  describe('setObj', function() {
    var obj = { a : { }, exist: 1 };

    it('should set value using dot notation', function() {
      util.setObj(obj, 'parent.not.exist', 1);
      assert.equal(1, obj.parent.not.exist);

      util.setObj(obj, 'a.b', 1);
      assert.equal(1, obj.a.b);
    });

    it('should set value without dot', function() {
      util.setObj(obj, 'simple', 2);
      assert.equal(2, obj.simple);
    });

    it('should delete key if value is undefined', function() {
      util.setObj(obj, 'exist');
      assert.isUndefined(obj.exist);
    });
  });

  describe('getObj', function() {
    var obj = { very: { deep: { key: 1 }}, simple: 2 };

    it('should get value using dot notation', function() {
      assert.equal(util.getObj(obj, 'very.deep.key'), 1);
    });

    it('should get value without dot', function() {
      assert.equal(util.getObj(obj, 'simple'), 2);
    });

    it('should get default value', function() {
      assert.isUndefined(util.getObj(obj, 'not exist'));
      assert.equal(util.getObj(obj, 'not exist', ''), '');
    });
  });
});
