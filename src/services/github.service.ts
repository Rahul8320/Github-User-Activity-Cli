import axios from "axios";
import GithubApiConstant from "../constants/github-api.constant";
import { GithubActivity } from "../models/GithubActivity";
import { AnalysisResultDto } from "../models/AnalysisResultDto";
import { groupBy } from "../lib/groupBy";

export default class GithubService {
  private username: string;

  constructor(username: string) {
    this.username = username;
  }

  public async getRecentActivity(): Promise<void> {
    const url = GithubApiConstant.getRecentActivityUrl(this.username);
    const response = await axios.get<GithubActivity[]>(url);
    const data: GithubActivity[] = response.data;

    console.log(`${data.length} activities found for ${this.username}.`);

    if (data.length === 0) {
      return;
    }

    const analysisResult = this.getAnalysisResults(data);
    return this.printEventLogs(analysisResult);
  }

  private getAnalysisResults(
    activities: GithubActivity[]
  ): AnalysisResultDto[] {
    let analysisResults: AnalysisResultDto[] = [];

    const groupByEventTypes: Map<string, GithubActivity[]> = groupBy(
      activities,
      (activity) => activity.type
    );
    console.log(
      `${groupByEventTypes.size} event types found: [${Array.from(
        groupByEventTypes.keys()
      ).join(", ")}]`
    );

    groupByEventTypes.forEach(
      (activitiesByEvent: GithubActivity[], eventType: string) => {
        const groupByRepoName: Map<string, GithubActivity[]> = groupBy(
          activitiesByEvent,
          (activity) => activity.repo.name
        );

        groupByRepoName.forEach((activitiesByRepo: GithubActivity[]) => {
          const { name: repoName, url: repoUrl } = activitiesByRepo[0].repo;
          const created_at = activitiesByRepo[0].created_at;

          analysisResults.push({
            type: eventType,
            numberOfActions: activitiesByRepo.length,
            repoName,
            repoUrl,
            created_at,
          });
        });
      }
    );

    return analysisResults;
  }

  private printEventLogs(analysisResult: AnalysisResultDto[]): void {
    console.log(`\n Recent activities: \n`);
    analysisResult.forEach((result: AnalysisResultDto) => {
      const eventType = result.type;
      const count = result.numberOfActions;
      const repoName = result.repoName;

      switch (eventType) {
        case "PushEvent":
          console.log(` - Pushed ${count} commits to ${repoName}.`);
          break;
        case "CreateEvent":
          console.log(` - Created ${repoName} repository.`);
          break;
        case "ForkEvent":
          console.log(` - Forked ${count} times in ${repoName}.`);
          break;
        case "WatchEvent":
          console.log(` - Watched ${count} times in ${repoName}.`);
          break;
        case "DeleteEvent":
          console.log(` - Deleted ${count} times in ${repoName}.`);
          break;
        case "PullRequestEvent":
          console.log(` - Merged ${count} pull requests in ${repoName}.`);
          break;
        case "IssuesEvent":
          console.log(` - Opened ${count} issues in ${repoName}.`);
          break;
        case "IssueCommentEvent":
          console.log(` - Commented on ${count} issues in ${repoName}.`);
          break;
        case "ReleaseEvent":
          console.log(` - Released ${count} times in ${repoName}.`);
          break;
        case "CommitCommentEvent":
          console.log(` - Commented on ${count} commits in ${repoName}.`);
          break;
        case "PublicEvent":
          console.log(` - Made public ${count} times in ${repoName}.`);
          break;
        case "PullRequestReviewCommentEvent":
          console.log(` - Commented on ${count} pull requests in ${repoName}.`);
          break;

        default:
          console.log(` - ${eventType} in ${repoName}.`);
          break;
      }
    });

    console.log("\n");
  }
}
