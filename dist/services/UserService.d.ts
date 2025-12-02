import { User } from "../models/User";
export declare class UserService {
    private repository;
    create(user: User): Promise<User>;
    list(): Promise<User[]>;
    find(id: number): Promise<User | null>;
    update(id: number, data: Partial<User>): Promise<User | null>;
    delete(id: number): Promise<boolean>;
}
