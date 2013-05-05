## Node & Phantom Twitter Bot

This script allows you to craft your own personal assistant. It can fetch information (with Node.js or Phantom.js web scrapers) at specific times, or within a particular time frame. Like a good servant, you can always tell it what to do (via a @mention). It listens for keywords and relates them back to functions and scrapers.

#### Dependencies

The Twitter aspects of the bot require the all-powerful [ntwitter](https://github.com/AvianFlu/ntwitter).

It can be installed with `npm install ntwitter`

If you plan to use any Phantom scrapers, you'll obviously need to install [Phantom.js](http://phantomjs.org/).

#### Twitter Auth

Twitter authentication can be generated on [this developer page](https://dev.twitter.com/apps/new).

You will find a reference to a file `credentials.js` that does not exist, and should be created at the root directory level and contain:

```
module.exports = {
    consumer_key: "string",
    consumer_secret: "string",
    access_token_key: "string",
    access_token_secret: "string"
};
```

The `.gitignore` includes a reference to the file so it is not accidentally committed for all to see on GitHub. If that does accidentally happen it is suggested that you regenerate your tokens on the developer site. 