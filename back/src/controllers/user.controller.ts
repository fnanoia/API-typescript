import { Request, Response } from "express";
import {
  createUser,
  findAll,
  findById,
  validatePassword,
  updateUser,
} from "../services/user.service";
import { hashPassword } from "../utils/jwt";

//register controller
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send("Missing fields");
    }

    const newUser = { username, email, password };

    const user = await createUser(newUser);

    return res.send(user);
  } catch (err: any) {
    return res.status(409).send("Error at register " + err);
  }
};

//login controller
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userValidation = { email, password };

    const validate = await validatePassword(userValidation);

    if (!validate) {
      return res.status(401).send("Wrong email or password");
    }

    return res.send("User succesffully auth");
  } catch (err: any) {
    return res.status(409).send(err);
  }
};

//find all users in DB
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await findAll();

    return res.send(users);
  } catch (err: any) {
    return res.status(409).send(err);
  }
};

//find one user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await findById(id);

    return res.send(user);
  } catch (err: any) {
    return res.status(404).send("User not found");
  }
};

// update user by ID
export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await findById(id);
  if (!user) {
    return res.status(404).send("User not found");
  }

  const { email, username, password, birthdate } = req.body;

  const hash = await hashPassword(password);
  const hashUsername = await hashPassword(user.password);

  const newUser = {
    email: email ? email : user.email,
    username: username ? username : user.username,
    password: password ? hash : hashUsername,
    birthdate: birthdate ? birthdate : user.birthdate,
  };
  try {
    const user = await updateUser(id, newUser);

    return res.send(user);
  } catch (err: any) {
    return res.status(400).send("Error updating User " + err);
  }
};
