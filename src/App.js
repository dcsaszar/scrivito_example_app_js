/* eslint-disable max-classes-per-file */
import * as React from "react";
import * as Scrivito from "scrivito";
import { HelmetProvider } from "react-helmet-async";

import CurrentPageMetadata from "./Components/CurrentPageMetadata";
import ErrorBoundary from "./Components/ErrorBoundary";
import Footer from "./Components/Footer";
import Intercom from "./Components/Intercom";
import Navigation from "./Components/Navigation";
import NotFoundErrorPage from "./Components/NotFoundErrorPage";
import CookieConsentBanner from "./Components/CookieConsentBanner";
import Tracking from "./Components/Tracking";
import { CookieConsentProvider } from "./Components/CookieConsentContext";

export const helmetContext = {};

let tid;

const UPDATES_PER_PAGE = 2;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, page: 0, pages: undefined };
    this.step = this.step.bind(this);
  }

  async componentDidMount() {
    const pages = await Scrivito.load(() => {
      const objs = Scrivito.Obj.where("_objClass", "equals", "TextWidget")
        .order("title")
        .toArray();

      objs.forEach((o) => Scrivito.urlFor(o));

      return objs;
    });
    this.setState({ pages }, () => {
      tid = setTimeout(this.step, 0);
    });
  }

  componentWillUnmount() {
    clearTimeout(tid);
  }

  step() {
    if (this.state.page === this.state.pages.length) {
      performance.measure(`𝝨`, "overall");
      logPerformance();
      return;
    }

    if (this.state.count === 0) {
      if (this.state.page === 0) {
        performance.mark("overall");
      }
      const obj = this.state.pages[this.state.page];
      performance.mark(Scrivito.urlFor(obj));
      // next page
      Scrivito.navigateTo(obj, {
        params: {
          i: `${this.state.page + 1}.of.${this.state.pages.length}`,
        },
      });
    }

    this.setState({ count: this.state.count + 1 }, () => {
      if (this.state.count <= UPDATES_PER_PAGE) {
        tid = setTimeout(this.step, 0);
        return;
      }
      const obj = this.state.pages[this.state.page];
      performance.measure(Scrivito.urlFor(obj), Scrivito.urlFor(obj));

      this.setState({ page: this.state.page + 1, count: 0 }, () => {
        tid = setTimeout(this.step, 0);
      });
    });
  }

  render() {
    return (
      <ErrorBoundary>
        <CookieConsentProvider>
          <HelmetProvider context={helmetContext}>
            <div>
              <div className="content-wrapper">
                <Navigation />
                <Scrivito.CurrentPage />
                <NotFoundErrorPage />
              </div>
              <Footer />
              <CurrentPageMetadata />
              <CookieConsentBanner />
              <Tracking />
              <Intercom />
            </div>
          </HelmetProvider>
        </CookieConsentProvider>
      </ErrorBoundary>
    );
  }
}

export default App;

function logPerformance() {
  console.log(
    performance
      .getEntriesByType("measure")
      .map(
        (m) =>
          `${m.name.replace(
            `${window.location.origin}`,
            ""
          )}\t${m.duration.toFixed(1)}`
      )
      .join("\n")
  );
}
