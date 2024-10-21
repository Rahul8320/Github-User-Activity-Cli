import axios from "axios";
import GithubApiConstant from "../constants/github-api.constant";
import { GithubActivity } from "../models/GithubActivity";
import { AnalysisResultDto } from "../models/AnalysisResultDto";
import { groupBy } from "../lib/groupBy";
import { Logger } from "../lib/logger";

export default class GithubService {
  private username: string;

  constructor(username: string) {
    this.username = username;
  }

  public async getRecentActivity(): Promise<void> {
    const url = GithubApiConstant.getRecentActivityUrl(this.username);
    const response = await axios.get<GithubActivity[]>(url);
    const data: GithubActivity[] = response.data;

    Logger.printHeader("Summery");
    Logger.infoLog(`${data.length} activities found for ${this.username}.`);

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
    Logger.infoLog(
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
    Logger.printHeader("Recent activities:");

    // Group activities by month
    const groupByMonth = new Map<string, AnalysisResultDto[]>();

    analysisResult.forEach((result) => {
      const date = new Date(result.created_at);
      const month = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!groupByMonth.has(month)) {
        groupByMonth.set(month, []);
      }
      groupByMonth.get(month)!.push(result);
    });

    groupByMonth.forEach((results, month) => {
      Logger.printSubHeader(month);
      results.forEach((result: AnalysisResultDto) => {
        const eventType = result.type;
        const count = result.numberOfActions;
        const repoName = result.repoName;

        switch (eventType) {
          case "PushEvent":
            Logger.printDetails(`Pushed ${count} commits to ${repoName}.`);
            break;
          case "CreateEvent":
            Logger.printDetails(`Created ${repoName} repository.`);
            break;
          case "ForkEvent":
            Logger.printDetails(`Forked ${count} times in ${repoName}.`);
            break;
          case "WatchEvent":
            Logger.printDetails(`Watched ${count} times in ${repoName}.`);
            break;
          case "DeleteEvent":
            Logger.printDetails(`Deleted ${count} times in ${repoName}.`);
            break;
          case "PullRequestEvent":
            Logger.printDetails(
              `Merged ${count} pull requests in ${repoName}.`
            );
            break;
          case "IssuesEvent":
            Logger.printDetails(`Opened ${count} issues in ${repoName}.`);
            break;
          case "IssueCommentEvent":
            Logger.printDetails(`Commented on ${count} issues in ${repoName}.`);
            break;
          case "ReleaseEvent":
            Logger.printDetails(`Released ${count} times in ${repoName}.`);
            break;
          case "CommitCommentEvent":
            Logger.printDetails(
              `Commented on ${count} commits in ${repoName}.`
            );
            break;
          case "PublicEvent":
            Logger.printDetails(`Made public ${count} times in ${repoName}.`);
            break;
          case "PullRequestReviewCommentEvent":
            Logger.printDetails(
              `Commented on ${count} pull requests in ${repoName}.`
            );
            break;

          default:
            Logger.printDetails(`${eventType} in ${repoName}.`);
            break;
        }
      });
      console.log();
    });
  }
}
