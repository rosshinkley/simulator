module.exports.identify = {
  userId: '019mr8mf4r',
  traits: {
    name: 'Michael Bolton',
    email: 'mbolton@initech.com',
    plan: 'Enterprise',
    friends: 42
  }
};

module.exports.track = {
  userId: '019mr8mf4r',
  event: 'Purchased an Item',
  properties: {
    revenue: 39.95,
    shippingMethod: '2-day'
  }
};

module.exports.page = {
  userId: '019mr8mf4r',
  category: 'Docs',
  name: 'Node.js Library',
  properties: {
    url: 'https://segment.com/docs/libraries/node',
    path: '/docs/libraries/node/',
    title: 'Node.js Library - Segment',
    referrer: 'https://github.com/segmentio/analytics-node'
  }
};

module.exports.alias = {
  previousId: 'old_id',
  userId: 'new_id'
};

module.exports.group = {
  userId: '019mr8mf4r',
  groupId: '56',
  traits: {
    name: 'Initech',
    description: 'Accounting Software'
  }
};

