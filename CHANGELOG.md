# Changelog

## v0.8.0-beta3 (2017-10-12) [diff](https://github.com/adamrenklint/bap/compare/v0.8.0-beta1...v0.8.0-beta3)

- Delegate attribute changes on note with position expression to its expanded ghost notes

## v0.8.0-beta1 (2017-08-19) [diff](https://github.com/adamrenklint/bap/compare/v0.7.4...v0.8.0-beta1)

- Return `-1` when buffer sourceStartIndex is higher than buffer.length, instead of throwing error

## v0.7.4 (2017-06-19) [diff](https://github.com/adamrenklint/bap/compare/v0.7.3...v0.7.4)

- Fixed nested sequences with different length throwing out-of-bounds errors

## v0.7.3 (2017-06-13) [diff](https://github.com/adamrenklint/bap/compare/v0.7.2...v0.7.3)

- Expose bap.Model

## v0.7.2 (2016-06-28) [diff](https://github.com/adamrenklint/bap/compare/v0.7.0...v0.7.2)

- Fix error when playing a layer without knowing the Channel, Pattern, Kit or Slot

## v0.7 "geniuz" (2016-06-28) [diff](https://github.com/adamrenklint/bap/compare/v0.6.0...v0.7.0)

- **BREAKING!** Changed `param.pitch` to represent semitones, i.e. `note.pitch = -12` will reduce pitch by one octave, setting the playback rate to `0.5` [#45](https://github.com/adamrenklint/bap/issues/45) [(Manvir Singh)](https://github.com/gurs1kh)
- Added `bap.pitchByRatio` helper to calculate exact pitch [(Manvir Singh)](https://github.com/gurs1kh)
- Added `started` and `stopped` events to Note, Channel, Pattern, Kit, Slot and Layer, triggered when layer source playback starts and stops [#52](https://github.com/adamrenklint/bap/issues/52)
- Changed default attack and release values on `bap.compressor` for better out-of-box result [#48](https://github.com/adamrenklint/bap/issues/48)

## v0.6 "large" (2016-06-03) [diff](https://github.com/adamrenklint/bap/compare/v0.5.1...v0.6.0)

- Added `pitch` and `pan` attributes on Pattern, which will affect all of its channels and notes
- Fixed an issue where if a layer was used in multiple slots, the wrong slot would be used to calculate composite params [#46](https://github.com/adamrenklint/bap/issues/46)

## v0.5.1 (2016-05-19) [diff](https://github.com/adamrenklint/bap/compare/v0.5.0...v0.5.1)

- Fixed setting `pattern.volume` to `0` playing at full volume [#44](https://github.com/adamrenklint/bap/issues/44)

## v0.5 "lotus" (2015-05-12) [diff](https://github.com/adamrenklint/bap/compare/v0.4.1...v0.5.0)

- Added `bap.new()` method to create a completely new instance of Bap, with its clock and event bus separated from all other instances [#43](https://github.com/adamrenklint/bap/issues/43)

## v0.4.1 (2016-05-11) [diff](https://github.com/adamrenklint/bap/compare/v0.4.0...v0.4.1)

- Updated [Dilla](https://github.com/adamrenklint/dilla) to fix an issue with dropping notes on patterns with more than 9 beats per bar [#42](https://github.com/adamrenklint/bap/issues/42)

## v0.4 "apollo" (2015-10-07) [diff](https://github.com/adamrenklint/bap/compare/v0.3.0...v0.4.0)

- **BREAKING:** Changed bitcrusher normalization frequency attribute to a proper frequency range [#37](https://github.com/adamrenklint/bap/issues/37)
- Added ```connect``` method to kit, slot, layer, channel and note, making them connectable with bap effect factories, using smart, dynamic and performant node creation and routing
- Added reverb, delay, compressor, overdrive, filter, chorus, phaser and ping pong delay effect factories for sample and oscillator layers [#15](https://github.com/adamrenklint/bap/issues/15)
- Added pattern volume attribute and master bap.volume attribute
- Added ```trimToZeroCrossingPoint``` param to trim clipping edges from beginning and end from sample buffers
- Improved performance and memory footprint with general object and Web Audio node pooling, avoiding V8 deopt patterns and allocating temporary memory
- Removed memoization of lookahead steps for pattern or sequence that is not looping or longer than 16 bars

## v0.3 "pete" (2015-09-03) [diff](https://github.com/adamrenklint/bap/compare/v0.2.2...v0.3.0)

- Added bitcrusher effect for sample layers [#23](https://github.com/adamrenklint/bap/issues/23)
- Added ```note.after``` callback that is triggered after a note source has stopped playing
- Added `clock.looped` attribute, increases each time a sequence reaches its end
- Added ```trigger``` param on note [#24](https://github.com/adamrenklint/bap/issues/24)
- Deprecated ```key``` parameter on note [#24](https://github.com/adamrenklint/bap/issues/24)
- Changed ```pattern > kit``` connection to use numeric ids [#24](https://github.com/adamrenklint/bap/issues/24)
- Changed ```kit > slot``` connection to use ```QWERTY``` ids [#24](https://github.com/adamrenklint/bap/issues/24)
- Fixed error when reversing sample without offset and duration longer than actual buffer duration [#25](https://github.com/adamrenklint/bap/issues/25)
- Fixed `clock.tempo` dropping to 0 when pausing or stopping playback
- Fixed `bap.clock` trowing error when starting playback without sequence
- Fixed playback being completely broken in Safari and Mobile Safari [#30](https://github.com/adamrenklint/bap/issues/30)

## v0.2.2 (2015-05-26) [diff](https://github.com/adamrenklint/bap/compare/v0.2.1...v0.2.2)

- Fixed broken links to examples in README

## v0.2.1 (2015-05-10) [diff](https://github.com/adamrenklint/bap/compare/v0.2.0...v0.2.1)

- Fixed incorrectly formatted header comments in ```bap.min.js```

## v0.2 "marl" (2015-05-07) [diff](https://github.com/adamrenklint/bap/compare/v0.1.0...v0.2.0)

- Added ```bap.sequence```, multi-layered sequences from patterns and other sequences, with variable tempo
- Added ```pattern.then```, ```pattern.after``` and ```pattern.and``` methods for combining patterns and sequences into new sequence
- Added ```sample.channel``` param to define behavior for stereo buffers
- Added ```sample.reverse``` param to reverse buffer or slice of buffer
- Added ```sample.loop``` param to define looping behavior
- Added ```note.transform```, ```channel.transform``` and ```pattern.transform``` callback to allow modification of notes after expanding position expressions
- Added ```clock.tempo``` read-only attribute for getting current tempo
- Added ```clock.step``` callback to cancel scheduling of step
- Updated to [dilla v1.5](https://www.npmjs.com/package/dilla) and [dilla-expressions v2.0](https://www.npmjs.com/package/dilla-expressions):
  - Added *greater than* and *less than* position expression operators
  - Expressions engine performance boost 25-1500x

## v0.1 "damu" (2015-04-19) [diff](https://github.com/adamrenklint/bap/compare/a31c03fd0e95c7cace5615c37db5eebdec877f95...v0.1.0)

- Initial public release

---
*Generated with [redok](https://github.com/adamrenklint/redok) @ Monday June 19th, 2017 - 10:10:57 AM*
