export abstract class StatsAccessControlList {
  abstract canViewPostsStatistics(userId: string): Promise<boolean>;
}
