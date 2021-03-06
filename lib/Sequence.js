var PlayableModel = require('./PlayableModel');
var PositionModel = require('./PositionModel');
var sequenceActions = require('./utils/sequenceActions');

function hashify (grid) {
  return grid.map(function (row) {
    return row.map(function (item) {
      return item.cid;
    }).join('+');
  }).join('>');
}

function findFirst (grid) {
  return grid[0] && grid[0][0];
}

function findLongest (row) {
  var longest = 0;
  row.forEach(function (item) {
    if (item.bars > longest) {
      longest = item.bars;
    }
  });
  return longest;
}

function forAll (grid, cb) {
  grid.forEach(function (row) {
    if (Array.isArray(row)) {
      forAll(row, cb);
    }
    else {
      cb(row);
    }
  });
}

var Sequence = PlayableModel.extend({

  type: 'sequence',

  props: {
    loop: ['boolean', true, false],
    sequences: ['sequence-grid', true, function () { return []; }]
  },

  dataTypes: {
    'sequence-grid': {
      set: function (newVal) {
        return {
          val: newVal,
          type: Array.isArray(newVal) && Array.isArray(newVal[0]) || !newVal[0] ? 'sequence-grid' : typeof newVal
        };
      },

      compare: function (currentVal, newVal) {
        var isSame = hashify(currentVal) === hashify(newVal);
        if (!isSame) {
          forAll(currentVal, function (seq) {
            this.stopListening(seq);
          }.bind(this));

          forAll(newVal, function (seq) {
            this.listenTo(seq, 'change:channels change:sequences', this._forwardChannelChange);
          }.bind(this));
        }
        return isSame;
      }
    }
  },

  derived: {
    tempo: {
      deps: ['sequences'],
      fn: function () {
        var first = findFirst(this.sequences);
        return first && first.tempo || 120;
      }
    },
    bars: {
      deps: ['sequences'],
      fn: function () {
        var total = 0;
        if (this.sequences.length) {
          this.sequences.forEach(function (row) {
            total += findLongest(row);
          });
        }
        return total;
      }
    },
    beatsPerBar: {
      deps: ['sequences'],
      fn: function () {
        var first = findFirst(this.sequences);
        return first && first.beatsPerBar || 4;
      }
    }
  },

  constructor: function () {
    var args = Array.prototype.slice.call(arguments);
    var types = ['sequence', 'pattern'];
    var sequences = [];
    var cont = true;
    var next;

    while (cont && args.length) {
      if (args[0] && ~types.indexOf(args[0].type)) {
        sequences.push([args.shift()]);
      }
      else if (args[0] && Array.isArray(args[0])) {
        sequences.push(args.shift());
      }
      else {
        cont = false;
      }
    }

    args[0] = args[0] || {};
    if (sequences.length) {
      args[0].sequences = sequences;
    }
    PlayableModel.apply(this, args);
  },

  initialize: function () {
    PlayableModel.prototype.initialize.apply(this, arguments);
    this.cacheMethodUntilEvent('notes', 'change:sequences');
    this.cacheMethodUntilEvent('patterns', 'change:sequences');
    this.cacheMethodUntilEvent('tempoAt', 'change:sequences');
  },

  notes: function (bar, beat, tick) {
    var notes = {};
    if (bar < 1 || bar > this.bars) throw new Error('Invalid argument: bar is not within sequence length');

    notes[bar] = [];
    var patternsForBar = this.patterns(bar);

    var cid = this.cid;
    Object.keys(patternsForBar).forEach(function (offset) {
      var patterns = patternsForBar[offset];
      var innerBar = bar - parseInt(offset, 10);
      patterns.forEach(function (pattern) {
        notes[bar] = notes[bar].concat(pattern.notes(innerBar, beat, tick));
      });
    });

    return notes;
  },

  patterns: function (bar, outerOffset) {
    if (typeof bar !== 'number') throw new Error('Invalid argument: bar is not a number');
    if (bar < 1 || bar > this.bars) throw new Error('Invalid argument: bar is not within sequence length');
    var patterns = {};
    var sequences = this.sequences.slice();
    var offset = 0;
    outerOffset = outerOffset || 0;
    var next, longest, start, end;

    while (sequences.length) {
      next = sequences.shift();
      longest = findLongest(next);
      start = offset + 1;
      end = offset + longest;
      if (bar >= start && bar <= end) {
        sequences = [];
      }
      else {
        offset += longest;
      }
    }

    var cid = this.cid;
    next.forEach(function (seq) {
      var innerOffset = offset + outerOffset;
      var currentBar = bar - offset;
      if (seq.type === 'sequence') {
        if (seq.bars < currentBar) return;
        var nestedPatternList = seq.patterns(currentBar, innerOffset);
        Object.keys(nestedPatternList).forEach(function (nestedOffset) {
          var nestedPatterns = nestedPatternList[nestedOffset];
          patterns[nestedOffset] = (patterns[nestedOffset] || []).concat(nestedPatterns);
        });
      }
      else {
        patterns[innerOffset] = patterns[innerOffset] || [];
        patterns[innerOffset].push(seq);
      }
    });

    return patterns;
  },

  tempoAt: function (bar) {
    var tempoChanges = this.tempoChanges();
    var validChanges = tempoChanges.filter(function (change) {
      return change[0] <= bar;
    });
    return validChanges.length ? validChanges[validChanges.length - 1][1] : 120;
  },

  tempoChanges: function () {
    var changes = [];
    var bar = 1;
    var lastTempo = null;

    this.sequences.forEach(function (row) {
      row = row[0];
      if (row.tempo !== lastTempo) {
        changes.push([bar, row.tempo, row.beatsPerBar]);
        lastTempo = row.tempo;
      }
      bar += row.bars;
    });

    return changes;
  },

  then: function () {
    var sequences = sequenceActions.then(this, arguments);
    return new this.constructor({ sequences: sequences });
  },

  after: function () {
    var sequences = sequenceActions.after(this, arguments);
    return new this.constructor({ sequences: sequences });
  },

  and: function () {
    var sequences = sequenceActions.and(this, arguments);
    return new this.constructor({ sequences: sequences });
  },

  _forwardChannelChange: function () {
    this.trigger('change:sequences');
  }
});

module.exports = Sequence;
