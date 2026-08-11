import {
  createRecord,
  generateLoremRecords,
  getRecordLookups,
  getRecords,
} from './tableService.js'

describe('tableService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normalizes paginated records from the API response', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            {
              id: 7,
              content: 'Lorem ipsum',
              category: { id: 3, name: 'Technology' },
              status: { id: 2, name: 'Active' },
              owner: { id: 9, name: 'Bill' },
              priority: { id: 1, name: 'High' },
              lastModified: '21:46:51',
            },
          ],
          pagination: {
            page: 2,
            pageSize: 10,
            totalRecords: 21,
            totalPages: 3,
          },
        }),
      })

    const result = await getRecords({
      page: 2,
      pageSize: 10,
      search: '  lorem  ',
      sortBy: 'id',
      sortDir: 'desc',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/records?page=2&pageSize=10&search=lorem&sortBy=id&sortDir=desc',
      expect.objectContaining({
        method: 'GET',
      }),
    )

    expect(result).toEqual({
      currentPage: 2,
      totalPages: 3,
      totalRecords: 21,
      pageSize: 10,
      rows: [
        {
          rawId: 7,
          id: '#LX-0007',
          content: 'Lorem ipsum',
          description: '',
          category: 'Technology',
          categoryId: 3,
          status: 'Active',
          statusId: 2,
          owner: 'Bill',
          ownerId: 9,
          priority: 'High',
          priorityId: 1,
          lastModified: '21:46:51',
        },
      ],
    })
  })

  it('normalizes lookup collections from mixed payload shapes', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ id: 1, name: 'Technology' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: ['Active', 'Inactive'],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ value: 'High' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 5, label: 'Bill' }],
        }),
      })

    const lookups = await getRecordLookups()

    expect(lookups).toEqual({
      categories: [{ id: 1, label: 'Technology' }],
      statuses: [
        { id: 'Active', label: 'Active' },
        { id: 'Inactive', label: 'Inactive' },
      ],
      priorities: [{ id: 'High', label: 'High' }],
      owners: [{ id: 5, label: 'Bill' }],
    })
  })

  it('sends a trimmed payload when creating a record', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 8,
          content: 'Lorem nou',
          category: 'Technology',
          status: 'Active',
          owner: 'Bill',
          priority: 'High',
          lastModified: '22:10:00',
        }),
      })

    await createRecord({
      content: '  Lorem nou  ',
      categoryId: '3',
      statusId: '2',
      ownerId: '9',
      priorityId: '1',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/records',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          content: 'Lorem nou',
          categoryId: 3,
          statusId: 2,
          ownerId: 9,
          priorityId: 1,
        }),
      }),
    )
  })

  it('throws the API message when bulk generation fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Generarea a esuat.',
      }),
    })

    await expect(generateLoremRecords(20)).rejects.toThrow(
      'Generarea a esuat.',
    )
  })
})
