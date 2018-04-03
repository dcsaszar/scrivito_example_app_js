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
