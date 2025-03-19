import { Request, Response } from "express";
import User from "../models/User";
import * as bcrypt from "bcrypt";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { createToken } from "../utils/jwt";

class AuthController {
  static create = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const user = new User(body);

      const userExist = await User.findOne({ where: { email: body.email } });
      if (userExist) {
        res.status(409).json({ message: "User exist already" });
        return;
      }

      const hashPassword = bcrypt.hashSync(body.password, 10);
      user.password = hashPassword;
      user.token = generateToken();
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });
      res.json({ message: "User created" });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Token is not valid");
      res.status(401).json({ message: error });
      return;
    }
    user.confirmed = true;
    user.token = null;
    await user.save();
    res.json({ message: "Email has been confirmed!" });
    return;
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { body } = req;

      const user = await User.findOne({ where: { email: body.email } });
      if (!user) {
        res.status(404).json({ message: "Email or password is not correct" });
        return;
      }
      if (!user.confirmed) {
        res.status(403).json({ message: "This account is not confirmed" });
        return
      }
      const isMatch = bcrypt.compareSync(body.password, user.password);
      if (!isMatch) {
        res.status(401).send({ message: "Email or password is not correct" });
        return;
      }

      const token = createToken(user.id)

      res.json({
        user,
        token
      })
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const {email} = req.body;

    const user = await User.findOne({where: {email}});
    if(!user){
      res.status(404).send({message: "user not found"})
    }
    user.token = generateToken();
    await user.save()

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token
    })
    res.json({mesage: "Check you email to reset your password"})
    } catch (error) {
      console.log(error);
      res.status(500).json({ error});
    }
    
  }

  static validateToken = async (req: Request, res: Response) => {
    try {
      const {token} = req.body;

      const tokenExist = await User.findOne({where: {token}});
  
      if(!tokenExist) {
        res.status(404).send({message: "The token is not valid!"});
        return;
      }
      res.send({message: "Token valid...."})
    
    } catch (error) {
      console.log(error);
      res.status(500).json({ error});
    }
   
  }

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    try {
      const {token} = req.params;
    const {password} = req.body;

    const user = await User.findOne({where: {token}});
  
    if(!user) {
      res.status(404).send({message: "The token is not valid!"});
      return;
    }
    user.password = await bcrypt.hash(password, 10);
    user.token = null;
    await user.save()
    res.json({message: "The password has been modified!"})
    return
    } catch (error) {
      res.status(500).send({error});
      return
    }

  }

  static user = async (req: Request, res: Response) => {
    res.json(req.user)
    return
  }
  

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    try {
      const {current_password, password} = req.body;
    const {id} = req.user;
    const user = await User.findByPk(id);

    if(!bcrypt.compareSync(current_password, user.password)){
      res.status(401).send({message: "The password is incorrect"});
      return
    }
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    res.json({
      message: "Password updated!"
    })
    return

    } catch (error) {
      res.status(500).send({error});
      return
    }
  }

  static checkPassword = async(req: Request, res: Response) => {
    try {
      const {password} = req.body;
      const {id} = req.user;
      const user = await User.findByPk(id);

      const isMatch = bcrypt.compareSync(password, user.password);
      if(!isMatch){
        res.status(401).send({message: "The password is incorrect"});
        return;
      }
      res.json({message: "The password has been verified"});
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({error})
    }
  }

}

export default AuthController;
