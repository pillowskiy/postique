export class ToggleLikeCommand {
  constructor(
    public readonly targetId: string,
    public readonly initiatedBy: string,
  ) {}
}
