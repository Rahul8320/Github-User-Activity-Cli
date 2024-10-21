import { GithubPayload } from "./GithubPayload";
import { GithubRepo } from "./GithubRepo";
import { GithubUser } from "./GithubUser";

export interface GithubActivity {
  id: string;
  type: string;
  actor: GithubUser;
  repo: GithubRepo;
  payload: GithubPayload;
  created_at: string;
  public: boolean;
}
