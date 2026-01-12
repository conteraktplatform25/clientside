export class MetaAPIError extends Error {
  constructor(
    message: string,
    public code?: number,
    public type?: string,
    public subcode?: number
  ) {
    super(message);
  }
}

export async function parseMetaError(res: Response): Promise<MetaAPIError> {
  const body = await res.json().catch(() => null);

  if (body?.error) {
    const err = body.error;
    return new MetaAPIError(err.message || 'Meta API Error', err.code, err.type, err.error_subcode);
  }

  return new MetaAPIError('Unknown Meta API error');
}
