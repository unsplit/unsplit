var vows = require('vows'),
    assert = require('assert');
 
vows.describe('Deep Thought').addBatch({
    'An instance of DeepThought': {
        topic: new DeepThought,
 
        'should know the answer to the ultimate question of life': function (deepThought) {
            assert.equal (deepThought.question('what is the answer to the universe?'), 42);
        }
    }
});
