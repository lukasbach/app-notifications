export const notificationSchema = {
  properties: {
    id: {
      type: 'string',
    },
    appVersions: {
      type: 'array',
    },
    apps: {
      type: 'array',
    },
    after: {
      type: 'string',
    },
    before: {
      type: 'string',
    },
    title: {
      type: 'string',
      required: true,
    },
    summary: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    author: {
      type: 'object',
      required: true,
      properties: {
        name: {
          type: 'string',
          required: true
        },
        url: {
          type: 'string',
        },
        avatar: {
          type: 'string',
        },
      },
    },
  },
};
