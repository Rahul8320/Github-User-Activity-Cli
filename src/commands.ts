import GithubService from "./services/github.service";

export const executeOptionUsername = async (username: string) => {
  try {
    if (username === undefined || username === null || username.trim() === "") {
      console.log("Please provide a username");
      process.exit(1);
    }

    const githubService = new GithubService(username);

    console.log(`Getting recent activity for ${username}`);
    await githubService.getRecentActivity();
  } catch (err: any) {
    console.log(`Error: ${err.message}`);
  }
};
