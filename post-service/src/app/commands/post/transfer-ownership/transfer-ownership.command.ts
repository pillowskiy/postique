export class TransferPostOwnershipCommand {
  constructor(
    public readonly postId: string,
    public readonly newOwner: string,
    public readonly initiatedBy: string,
  ) {}
}
