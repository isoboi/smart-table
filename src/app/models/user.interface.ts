export interface UserInterface {
  _id: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  name: Name;
  company: string;
  email: string;
  address: string;
  tags: string[];
  favoriteFruit: string;
}

export interface Name {
  first: string;
  last: string;
}
