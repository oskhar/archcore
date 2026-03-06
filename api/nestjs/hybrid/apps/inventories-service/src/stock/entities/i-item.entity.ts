export class IItem {
  constructor(
    public readonly id: string,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly sku: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
  ) {}
}
