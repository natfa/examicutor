import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { User, Role } from '../../models';

async function getActiveSession(req: Request, res: Response): Promise<void> {
  if (!req.session) throw new Error('req.session is undefined');

  res.status(200).send({
    id: req.session.user.id,
    email: req.session.user.email,
    role: req.session.user.role,
  });
};

async function createAccount(req: Request, res: Response): Promise<void> {
  const saltRounds = 10;
  const { email, password, passwordRepeat, role } = req.body;

  if (password !== passwordRepeat) {
    res.status(400).send('Passwords don\'t match');
    return;
  }

  const exists = await User.findOne({ where: { email }});
  if (exists) {
    res.status(400).send('Email already in use');
    return;
  }

  const roleObject = await Role.findOne({ where: { name: role }});
  if (roleObject === null) {
    res.status(400).send('Such a role does\'t exist');
    return;
  }

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email,
    passwordHash,
    roleId: roleObject.id,
  });

  res.status(200).send({
    id: user.id,
    email: user.email,
    role: roleObject.name,
  });
};

async function authenticate(req: Request, res: Response): Promise<void> {
  if (req.session === undefined) throw new Error('req.session is undefined');

  if (req.session.user) {
    res.status(400).send('Already authenticated');
    return;
  }

  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    include: User.associations.role
  });

  if (user === null) {
    res.status(401).end();
    return;
  }
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    res.status(401).end();
    return;
  }

  // users must always have roles
  if (user.role === undefined) throw new Error('user.role is undefined');

  req.session.user = {
    id: user.id,
    email: user.email,
    role: user.role.name,
  }

  res.status(200).send({
    id: user.id,
    email: user.email,
    role: user.role.name,
  });
};

export default {
  authenticate,
  getActiveSession,
  createAccount,
}
