// Needed polyfill to support an iterable ObjSearch in older browsers.
// See https://www.scrivito.com/objsearch-aaa67c3157464d01
import 'core-js/modules/es6.symbol';

import * as Scrivito from 'scrivito';
import './Objs';
import './config';
import sitemapXml from './utils/sitemapXml';
import writeContentToExtract from './utils/writeContentToExtract';

function generate() {
  window.prerenderReady = false;
  Scrivito.load(sitemapXml)
    .then(writeContentToExtract)
    .then(() => {
      window.prerenderReady = true;
    });
}

generate();
