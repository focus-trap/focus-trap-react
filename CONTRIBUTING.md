# Contributing

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.MD). By participating in this project you agree to abide by its terms.

Fork the repo, then clone your fork to your machine and run `yarn install`

Format with `yarn format`

Lint with `yarn lint`

Run the demos with `yarn start`. Then open your browser to http://localhost:9966

> Note that changes to **test** files ([demo](./demo) HTML and JS) are hot-reloaded, but changes to the [source](index.js) **are not**. It would be great if source changes were also hot-reloaded. If you know how to fix that, please do!

## Testing

Test with `yarn test` (checks formatting, checks lint, runs both unit and E2E tests).  
To troubleshoot headless E2E test failures, recording can be found at `cypress/videos/*.mp4`.  
Note: By default `chrome` is the browser on which headless E2E test are running

Unit test (only) with `yarn test-unit`

E2E test can alo be run in interactive mode on Cypress UI which is easier for development and troubleshooting with `yarn test-cypress`

## API Changes

If you added/removed options in the API, please remember to update the docs in the [README](README.md) as well as the [typings](index.d.ts).

## Changeset

Before posting your PR, please add a changeset by running `yarn changeset` and following the prompts. This will help us quickly make a release with your enhancements.

If your changes don't affect the source or typings, then a changeset is not needed (and you can ignore the bot's automated comment on your PR about not finding one as part of your changes).

## Anything Helps

We want to recognize **all** contributions. To that end, we use the [All Contributors Bot](https://allcontributors.org/docs/en/bot/usage) to automate adding all types of contributions to our [README](README.md).

Please feel free to use the bot on your own issue or PR to add yourself as a contributor, or remind one of the maintainers to do so.

No contribution is too small not to be included. We appreciate your help!
