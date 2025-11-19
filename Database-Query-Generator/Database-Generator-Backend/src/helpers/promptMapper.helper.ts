class PromptMapper {
  public queryParams: string;
  public promptContent: string;
  public promptMapper: Map<string, string> = new Map();

  constructor(queryParams: string, promptContent: string) {
    this.queryParams = queryParams;
    this.promptContent = promptContent;
    this.clearMapper();
    this.initalizationMapper();
  }

  public initalizationMapper() {
    this.promptMapper.set("database", this.queryParams);
    this.promptMapper.set("prompt", this.promptContent);
  }

  public getPromptMapper() {
    if (this.promptMapper.get("database")?.toString() === this.queryParams) {
      return this.promptMapper;
    }
  }

  public clearMapper() {
    this.promptMapper.clear();
  }
}

export default PromptMapper;
