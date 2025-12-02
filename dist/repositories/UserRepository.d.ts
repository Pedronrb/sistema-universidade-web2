import { User } from "../models/User";
export declare class UserRepository {
    create(user: User): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    update(id: number, user: Partial<User>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}
