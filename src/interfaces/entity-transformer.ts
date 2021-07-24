export interface EntityTransformer {
  transform(entity: any): Record<string, unknown>;
}
