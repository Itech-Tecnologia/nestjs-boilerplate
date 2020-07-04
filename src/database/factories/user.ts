import { Factory } from 'fishery';

import { RoleSlug } from '~/roles/entities/role.entity';
import { User } from '~/users/entities/user.entity';

import chance from './chance';
import role from './role';

export default Factory.define<User>(() => {
  const firstname = chance.first();
  const lastname = chance.last();

  return {
    id: chance.guid(),
    firstname,
    lastname,
    fullname: `${firstname} ${lastname}`,
    email: chance.email(),
    password: chance.string({
      alpha: true,
      numeric: true,
      symbols: true,
      length: 8,
    }),
    birthdate: chance.birthday(),
    roles: [role.build({ slug: RoleSlug.USER })],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
