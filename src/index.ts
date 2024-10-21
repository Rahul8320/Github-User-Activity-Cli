#! /usr/bin/env node

import { Command } from "commander";
import { executeOptionUsername } from "./commands";
import { Logger } from "./lib/logger";

const program = new Command();

Logger.printLogo("GitHub User Activity");

program
  .version("1.0.0")
  .description("Find most recent activity of a GitHub user")
  .option("-u, --username <username>", "GitHub username")
  .parse(process.argv);

const options = program.opts();

// Default show options
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

if (options.username) {
  executeOptionUsername(options.username);
} else {
  Logger.errorLog(`Error: unknown option.`);
  program.outputHelp();
}
