var wtf = require('./lib')
var test = require('tape')

test('remove wikitext from caption titles', function (t) {
  var str = `
hello
== {{anchor|Foo}} Foo [[Bar]] ==
this is working
i believe that 5===true and y===false
  `
  var sections = wtf(str)
    .sections()
    .map((s) => s.json())
  t.equal(sections.length, 2, 'two-sections')
  t.equal(sections[0].title, '', 'implicit-section')
  t.equal(sections[0].start, 0, 'implicit-section start')
  t.equal(sections[0].length, 0, 'implicit-section length')
  t.equal(sections[1].title, 'Foo Bar', 'clean-section')
  t.equal(sections[1].start, 7, 'clean-section start')
  t.equal(sections[1].length, 32, 'clean-section length')
  t.end()
})

test('catch indented first sentence', function (t) {
  var str = `:hello one
ok now you start`
  var doc = wtf(str)
  t.equal(doc.text(), 'ok now you start\n * hello one')
  t.end()
})

test('empty intro text', function (t) {
  var str = `==English==
  how bout that
  `
  var sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'leading-section')

  str = `
==English==
how bout that`
  sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'newline-section')

  str = `
==English==
how bout that


`
  sections = wtf(str)
    .sections()
    .map((s) => s.title())
  t.deepEqual(sections, ['English'], 'extra-whitespace')
  t.end()
})
