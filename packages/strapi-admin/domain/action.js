'use strict';

const _ = require('lodash');
const { curry, isArray } = require('lodash/fp');

const actionFields = [
  'section',
  'displayName',
  'category',
  'subCategory',
  'pluginName',
  'subjects',
  'conditions',
  'options',
];

const defaultAction = {
  options: {
    fieldsRestriction: true,
    applyToProperties: undefined,
  },
};

/**
 * Return a prefixed id that depends on the pluginName
 * @param {Object} params
 * @param {Object} params.pluginName - pluginName on which the action is related
 * @param {Object} params.uid - uid defined by the developer
 */
const getActionId = ({ pluginName, uid }) => {
  if (pluginName === 'admin') {
    return `admin::${uid}`;
  } else if (pluginName) {
    return `plugins::${pluginName}.${uid}`;
  }

  return `application::${uid}`;
};

/**
 * Create a permission action
 * @param {Object} attributes - action attributes
 */
const createAction = attributes => {
  const action = _.cloneDeep(_.pick(attributes, actionFields));
  action.actionId = getActionId(attributes);

  if (['settings', 'plugins'].includes(attributes.section)) {
    action.subCategory = attributes.subCategory || 'general';
  }

  return _.merge({}, defaultAction, action);
};

const appliesToProperty = curry((property, action) => {
  const {
    options: { applyToProperties },
  } = action;

  if (!isArray(applyToProperties)) {
    return false;
  }

  return applyToProperties.includes(property);
});

module.exports = {
  getActionId,
  createAction,
  appliesToProperty,
};
