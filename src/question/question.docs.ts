import { Question } from './entity/question.entity';

export default {
  get: {
    ['posts']: {
      operation: {
        description: 'Returns posts lists.',
      },
      response: {
        [200]: {
          description: 'Returns posts lists.',
          type: Question,
        },
        [400]: { description: 'Posts does not exist' },
      },
    },
  },
  post: {
    ['question']: {
      operation: {
        description: "Returns a user's post lists.",
      },
      response: {
        [200]: {
          description: "Returns a user's post lists.",
          type: Question,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  patch: {
    [':post_id']: {
      operation: {
        description: 'Returns a updated post.',
      },
      response: {
        [200]: {
          description: 'Returns a updated post.',
          type: Question,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  delete: {
    [':post_id']: {
      operation: {
        description: 'Returns a deleted post.',
      },
      response: {
        [200]: {
          description: 'Returns a deleted post.',
          type: Question,
        },
        [400]: { description: 'Post does not exist' },
      },
    },
  },
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
