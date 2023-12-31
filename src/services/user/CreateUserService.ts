import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
   name: string;
   email: string;
   password: string;
}

class CreateUserService {
   async execute({ name, email, password }: UserRequest) {
      // verificar se enviou um email
      if (!email) {
         throw new Error("Email inválido!");
      }

      // verificar se email já estar cadastrado
      const userAlreadyExists = await prismaClient.user.findFirst({
         where: {
            email: email,
         },
      });

      if (userAlreadyExists) {
         throw new Error("Email já cadastrado, tente outro!");
      }

      // criptografando senha
      const passwordHash = await hash(password, 8);

      // cadastrando usuário
      const user = await prismaClient.user.create({
         data: {
            name: name,
            email: email,
            password: passwordHash,
         },
         // select é para informar o que queremos devolver
         select: {
            id: true,
            name: true,
            email: true,
         },
      });

      return user;
   }
}

export { CreateUserService };
