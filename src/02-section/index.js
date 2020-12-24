const Section = require('./Section')
const i18n = require('../_data/i18n')
const isReference = new RegExp('^(' + i18n.references.join('|') + '):?', 'i')
const section_reg = /(?:\n|^)(={2,5}.{1,200}?={2,5})/

//interpret ==heading== lines
const parse = {
  heading: require('./heading'),
  table: require('../table'),
  paragraphs: require('../03-paragraph'),
  templates: require('../template'),
  references: require('../reference'),
  startEndTemplates: require('./start-to-end'),
}

const oneSection = function (section, doc) {
  parse.startEndTemplates(section, doc)
  //parse-out the <ref></ref> tags
  parse.references(section)
  //parse-out all {{templates}}
  parse.templates(section, doc)
  //parse the tables
  parse.table(section)
  //now parse all double-newlines
  parse.paragraphs(section, doc)
  section = new Section(section)
  return section
}

const removeReferenceSection = function (sections) {
  return sections.filter((s, i) => {
    if (isReference.test(s.title()) === true) {
      if (s.paragraphs().length > 0) {
        return true
      }
      //does it have some wacky templates?
      if (s.templates().length > 0) {
        return true
      }
      //what it has children? awkward
      if (sections[i + 1] && sections[i + 1].depth > s.depth) {
        sections[i + 1].depth -= 1 //move it up a level?...
      }
      return false
    }
    return true
  })
}

const parseSections = function (doc) {
  let sections = []
  let restWiki = doc._wiki;
  let restWikiIndex = 0;
  while(true) {
    let headingMatch = restWiki.match(section_reg);
    if (!headingMatch) {
      break; //No more sections
    }
    let wiki, heading, wikiIndex;
    if (headingMatch.index !== 0) {
      // Implicit section before...
      wiki = restWiki.slice(0, headingMatch.index);
      wikiIndex = restWikiIndex;
      heading = '';
      restWikiIndex += headingMatch.index;
      restWiki = restWiki.slice(headingMatch.index);
    }
    else {
      wiki = restWiki.slice(0, headingMatch.index);
      wikiIndex = restWikiIndex;
      heading = headingMatch[1]; // First capture group
      let nextSectionIndex = headingMatch.index + headingMatch[0].length;
      restWikiIndex += nextSectionIndex;
      restWiki = restWiki.slice(nextSectionIndex);
      if (wiki === '' && heading === '') {
        //usually an empty 'intro' section
        continue
      }
    }

    console.log(wiki);
    console.log(heading);
    console.log(restWiki);

    let section = {
      title: '',
      depth: null,
      wiki,
      wikiStart: wikiIndex,
      wikiLength: wiki.length,
      templates: [],
      tables: [],
      infoboxes: [],
      references: [],
    }
    //figure-out title/depth
    parse.heading(section, heading)
    //parse it up
    let s = oneSection(section, doc)
    sections.push(s)
  }

  //remove empty references section
  return removeReferenceSection(sections)
}

module.exports = parseSections
