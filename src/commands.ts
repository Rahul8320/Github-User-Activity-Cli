import GithubService from "./services/github.service";
import { Logger } from "./lib/logger";
import { EventType } from "./models/eventType";

export const executeOptionUsername = async (
  username: string,
  details: boolean,
  filter: string | undefined
) => {
  try {
    if (username === undefined || username === null || username.trim() === "") {
      Logger.errorLog("Please provide a username");
      process.exit(1);
    }

    // Validate event type if provided
    const validEventTypes = Object.values(EventType).map((eventType) =>
      eventType.toLowerCase()
    );
    if (filter && !validEventTypes.includes(filter.toLowerCase())) {
      console.error(
        `Invalid event type: ${filter}. Supported event types: ${validEventTypes.join(
          ", "
        )}`
      );

      return;
    }

    const githubService = new GithubService(username);

    console.log(`Getting recent activity for ${username}`);
    await githubService.getRecentActivities(details, filter);
  } catch (err: any) {
    Logger.errorLog(`Error: ${err.message}`);
  }
};
