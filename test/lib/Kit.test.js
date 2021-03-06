var chai = require('chai');
var expect = chai.expect;
var Kit = require('../../lib/Kit');
var Slot = require('../../lib/Slot');

var kit;

beforeEach(function () {
  kit = new Kit();
});

describe('Kit', function () {

  describe('slot(id, slot)', function () {
    describe('when id is not a string', function () {
      it('should throw an error', function () {
        expect(function () {
          kit.slot(null)
        }).to.throw(/invalid slot identifier/i);
        expect(function () {
          kit.slot(12)
        }).to.throw(/invalid slot identifier/i);
      });
    });
    describe('when id is a single letter', function () {
      describe('when slot is not an instance of Slot', function () {
        it('should return the current slot assigned to id', function () {
          var slot = new Slot();
          kit.slot('Q', slot);
          expect(kit.slot('Q')).to.equal(slot);
        });
        describe('when there is no slot assigned to id', function () {
          it('should return a new slot, assigned to id', function () {
            var slot = kit.slot('Q');
            expect(slot).to.be.instanceOf(Slot);
          });
        });
      });
      describe('when slot is an instance of Slot', function () {
        it('should assign the slot to id', function () {
          var slot = new Slot();
          kit.slot('Q', slot);
          expect(kit.slot('Q')).to.equal(slot);
        });
      });
    });
  });
});
