import { Factory } from 'fishery';

import { Role, RoleSlug } from '~/roles';

import chance from './chance';

export default Factory.define<Role>(() => ({
  id: chance.guid(),
  slug: chance.pickone(Object.values(RoleSlug)),
  name: chance.first(),
  description: chance.sentence(),
  users: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}));
