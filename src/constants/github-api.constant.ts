export default class GithubApiConstant {
  private static readonly BASE_URL = "https://api.github.com/users";
  private static readonly PUBLIC_EVENTS = "/events/public";

  public static getRecentActivityUrl(username: string): string {
    return `${GithubApiConstant.BASE_URL}/${username}${GithubApiConstant.PUBLIC_EVENTS}`;
  }
}
