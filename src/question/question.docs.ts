import { QuestionComment } from './entity/question-comment.entity';
import { Question } from './entity/question.entity';

export default {
  get: {
    ['question']: {
      operation: {
        description: 'Return lists of Questions.',
      },
      response: {
        [200]: {
          description: 'Return lists of Questions.',
          type: Question,
        },
        [400]: { description: 'Error get Questions' },
      },
    },
    ['question/my']: {
      operation: {
        description: 'Return lists of my Questions.',
      },
      response: {
        [200]: {
          description: 'Return lists of my Questions.',
          type: Question,
        },
        [400]: { description: 'Error get Questions' },
      },
    },
    ['question/comment/:question_id']: {
      operation: {
        description: 'Return Questions Comments with question ID.',
      },
      response: {
        [200]: {
          description: 'Return Questions Comments with question ID.',
          type: QuestionComment,
        },
        [400]: { description: 'Error get Comments' },
      },
    },
  },
  post: {
    ['question']: {
      operation: {
        description: 'Returns a question.',
      },
      response: {
        [200]: {
          description: 'Returns a question.',
          type: Question,
        },
        [400]: { description: 'Question does not exist' },
      },
    },
    ['question/like/:question_id']: {
      operation: {
        description: 'User trun on question like.',
      },
      response: {
        [200]: {
          description: 'Return void.',
        },
        [400]: { description: 'Question does not exist' },
      },
    },
    ['question/unlike/:question_id']: {
      operation: {
        description: 'User trun off question like.',
      },
      response: {
        [200]: {
          description: 'Return void.',
        },
        [400]: { description: 'Question does not exist' },
      },
    },
    ['question/comment/:question_id']: {
      operation: {
        description: 'Create a Comment.',
      },
      response: {
        [200]: {
          description: 'Return void.',
        },
        [400]: { description: 'Error Comment' },
      },
    },
  },
  patch: {
    ['question/:question_id']: {
      operation: {
        description: 'Returns a updated question.',
      },
      response: {
        [200]: {
          description: 'Returns a updated question.',
          type: Question,
        },
        [400]: { description: 'Question does not exist' },
      },
    },
  },
  delete: {
    ['question/:question_id']: {
      operation: {
        description: 'Returns a deleted question.',
      },
      response: {
        [200]: {
          description: 'Returns a deleted question.',
          type: Question,
        },
        [400]: { description: 'Question does not exist' },
      },
    },
  },
  unauthorized: {
    description: 'Token is missing, or the token is invalid.',
  },
};
