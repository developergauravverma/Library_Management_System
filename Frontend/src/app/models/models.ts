
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  userType: UserType;
  accountStatus: AccountStatus;
  createOn: string;
}

export enum AccountStatus {
  UNAPROOVED,
  ACTIVE,
  BLOCKED,
}

export enum UserType {
  NONE,
  ADMIN,
  STUDENT,
}

export interface BookCategory{
  id:number;
  category: string;
  subCategory: string
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  ordered: boolean;
  bookCategoryId: number;
  bookCategory: BookCategory;
}

export interface BooksByCategory {
  bookCategoryId: number;
  category: string;
  subCategory: string;
  books: Book[];
}
