export interface Item {
  name: string;
  price: number;
}

export interface Change {
  before?: Item;
  after?: Item;
}

export interface ItemMap {
  [key: string]: Item;
}
