import GithubService from "./services/github.service";
import { Logger } from "./lib/logger";

export const executeOptionUsername = async (username: string) => {
  try {
    if (username === undefined || username === null || username.trim() === "") {
      Logger.errorLog("Please provide a username");
      process.exit(1);
    }

    const githubService = new GithubService(username);

    console.log(`Getting recent activity for ${username}`);
    await githubService.getRecentActivity();
  } catch (err: any) {
    Logger.errorLog(`Error: ${err.message}`);
  }
};
