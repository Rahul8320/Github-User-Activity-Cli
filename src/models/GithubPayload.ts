export interface GithubPayload {
  repository_id: number;
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: GithubPayloadCommit[];
}

export interface GithubPayloadCommit {
  sha: string;
  author: GithubPayloadCommitAuthor;
  message: string;
  distinct: boolean;
  url: string;
}

export interface GithubPayloadCommitAuthor {
  name: string;
  email: string;
}
