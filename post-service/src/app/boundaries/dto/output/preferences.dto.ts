export class MuteResultOutput {
  constructor(public readonly muted: boolean) {}
}

export class ToggleAuthorOutput extends MuteResultOutput {}
export class TogglePostOutput extends MuteResultOutput {}
