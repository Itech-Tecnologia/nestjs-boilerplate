import { Factory } from 'fishery';

import { User } from '~/users/entities/user.entity';

import chance from './chance';

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
    roles: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});
